// LIBRARIES
import { internalMutation } from '@/convex/_generated/server';

// HELPERS
import { getUserPlan } from '@/convex/tables/proTrials/helpers/proTrial';
import { logAudit } from '@/convex/tables/auditLog/helpers/logAudit';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

/**
 * Expire due pro trials. For each unswept trial past its `endsAt` (unless the
 * owner upgraded to Pro first): deactivate the account's Pro-gated assets,
 * stamped `deactivationReason: 'trial_expired'` so a future Pro upgrade can
 * reactivate precisely —
 *   - `custom`-created partnerships on their accommodations, and
 *   - `user`-created hospitalities they own —
 * then stamp `expiredAt` either way.
 *
 * Creation paths are gated write-time (`ensureCustomPartnershipAccess`,
 * `ensureHospitalityCreateAccess`), so the worst case between expiry and the
 * next hourly run is existing assets staying live a little longer — never new
 * ones being created.
 */
export const expireProTrials = internalMutation({
	args: {},
	handler: async (ctx) => {
		const now = Date.now();

		const dueTrials = await ctx.db
			.query('proTrials')
			.withIndex('by_expired_ends', (q) => q.eq('expiredAt', undefined).lte('endsAt', now))
			.collect();

		let deactivatedPartnerships = 0;
		let deactivatedHospitalities = 0;

		for (const trial of dueTrials) {
			const plan = await getUserPlan(ctx, trial.userId);
			const skippedPro = plan === 'pro';

			let trialPartnerships = 0;
			let trialHospitalities = 0;

			if (!skippedPro) {
				const accommodations = await ctx.db
					.query('accommodations')
					.withIndex('by_owner', (q) => q.eq('ownerId', trial.userId))
					.collect();

				for (const accommodation of accommodations) {
					const partnerships = await ctx.db
						.query('partnerships')
						.withIndex('by_accommodation_active', (q) =>
							q.eq('accommodationId', accommodation._id).eq('isActive', true)
						)
						.collect();

					for (const partnership of partnerships) {
						if (partnership.createType !== 'custom') continue;
						await ctx.db.patch(partnership._id, {
							isActive: false,
							deactivationReason: 'trial_expired'
						});
						trialPartnerships++;
					}
				}

				const hospitalities = await ctx.db
					.query('hospitalities')
					.withIndex('by_owner', (q) => q.eq('ownerId', trial.userId))
					.collect();

				for (const hospitality of hospitalities) {
					if (hospitality.createType !== 'user' || !hospitality.isActive) continue;
					await ctx.db.patch(hospitality._id, {
						isActive: false,
						deactivationReason: 'trial_expired'
					});
					trialHospitalities++;
				}
			}

			await ctx.db.patch(trial._id, { expiredAt: now });
			deactivatedPartnerships += trialPartnerships;
			deactivatedHospitalities += trialHospitalities;

			// System-initiated, but attributed to the affected account so the event
			// shows up in that user's audit trail during a dispute ("my venues vanished").
			logAudit(ctx, AUDIT_ACTIONS.TRIAL_EXPIRE, {
				userId: trial.userId,
				resource: { table: 'proTrials', id: trial._id },
				metadata: {
					initiatedBy: 'system_cron',
					skippedPro,
					deactivatedPartnerships: trialPartnerships,
					deactivatedHospitalities: trialHospitalities
				}
			});
		}

		return {
			processed: dueTrials.length,
			deactivatedPartnerships,
			deactivatedHospitalities
		};
	}
});
