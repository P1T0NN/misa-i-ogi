// LIBRARIES
import { authMutation } from '@/convex/auth/middleware/authMiddleware';

// CONFIG
import { SUBSCRIPTION_ENABLED } from '@/shared/config.js';

// HELPERS
import { getProTrial, startProTrialIfMissing } from '@/convex/tables/proTrials/helpers/proTrial';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Explicit opt-in to the account-level free trial (the Add Hospitality gate
 * card today; any future Pro-gated feature can reuse it). Calling again while
 * active is a harmless no-op success (double click, two tabs); after expiry it
 * fails — the trial never restarts.
 */
export const startProTrial = authMutation('startProTrial')({
	args: {},
	returns: mutationResultValidator,
	handler: async (ctx): Promise<MutationResult> => {
		// Paid tier is closed for launch — no new trials can start.
		if (!SUBSCRIPTION_ENABLED) {
			return { success: false, message: { key: 'GenericMessages.FORBIDDEN' } };
		}

		const existing = await getProTrial(ctx, ctx.userId);
		if (existing && Date.now() >= existing.endsAt) {
			return {
				success: false,
				message: { key: 'GenericMessages.PRO_TRIAL_EXPIRED' }
			};
		}

		const { trialId, endsAt, started } = await startProTrialIfMissing(ctx, ctx.userId);

		// Only a genuinely new trial is evidence-worthy; re-calls while active are no-ops.
		if (started) {
			ctx.audit(AUDIT_ACTIONS.TRIAL_START, {
				resource: { table: 'proTrials', id: trialId },
				after: { endsAt }
			});
		}

		return { success: true, message: { key: 'GenericMessages.PRO_TRIAL_STARTED' } };
	}
});
