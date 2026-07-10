// LIBRARIES
import { v } from 'convex/values';
import { adminMutation } from '@/convex/auth/middleware/authMiddleware';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Admin-only createType switch. NON-DESTRUCTIVE by construction:
 *
 * - `platform → user`: always safe. A platform venue holds no partnership rows (it
 *   partners every accommodation implicitly), so the switch is a plain patch. The
 *   venue keeps its id, history, and connect code, and is immediately linkable via
 *   custom partnerships.
 * - `user → platform`: allowed ONLY when the venue has no active partnerships. A
 *   platform venue cannot own explicit rows, so rather than silently delete them we
 *   refuse and tell the admin to revoke the venue's partnerships first.
 *
 * Nothing is ever auto-deleted. Visibility is left untouched (dormant field).
 */
export const setHospitalityCreateType = adminMutation('setHospitalityCreateType')({
	args: {
		hospitalityId: v.id('hospitalities'),
		createType: v.union(v.literal('platform'), v.literal('user'))
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const hospitality = await ctx.db.get(args.hospitalityId);
		if (!hospitality) {
			return { success: false, message: { key: 'GenericMessages.HOSPITALITY_NOT_FOUND' } };
		}

		const current = hospitality.createType ?? 'platform';
		if (current === args.createType) {
			return { success: true, message: { key: 'GenericMessages.HOSPITALITY_CREATE_TYPE_UPDATED' } };
		}

		// user → platform: refuse while explicit partnerships are still active — a platform
		// venue can't own them, and we never delete data behind the admin's back.
		if (args.createType === 'platform') {
			const activePartnerships = await ctx.db
				.query('partnerships')
				.withIndex('by_hospitality_active', (q) =>
					q.eq('hospitalityId', args.hospitalityId).eq('isActive', true)
				)
				.collect();
			if (activePartnerships.length > 0) {
				return {
					success: false,
					message: { key: 'GenericMessages.HOSPITALITY_CREATE_TYPE_HAS_PARTNERSHIPS' }
				};
			}
		}

		await ctx.db.patch(args.hospitalityId, { createType: args.createType });

		ctx.audit(AUDIT_ACTIONS.HOSPITALITY_UPDATE, {
			resource: { table: 'hospitalities', id: args.hospitalityId },
			before: { createType: current },
			after: { createType: args.createType }
		});

		return { success: true, message: { key: 'GenericMessages.HOSPITALITY_CREATE_TYPE_UPDATED' } };
	}
});
