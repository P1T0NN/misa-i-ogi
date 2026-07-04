// HELPERS
import { getProTrial, getUserPlan } from '@/convex/tables/proTrials/helpers/proTrial';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Access gate for self-service venue creation (`createUserHospitality`).
 *
 * Reads the account-level `proTrials` row (shared with custom partnerships).
 * Unlike `ensureCustomPartnershipAccess`, the trial is NOT auto-started here —
 * the user opts in via the Add Hospitality gate card (`startProTrial`) first.
 *
 * - Pro plan → always allowed.
 * - No trial row → failed {@link MutationResult} (UI shows the start-trial card).
 * - Trial running → allowed, unlimited.
 * - Trial over → failed {@link MutationResult}; the expiry cron separately
 *   deactivates the venues created during the trial.
 *
 * Returns `null` when allowed.
 */
export async function ensureHospitalityCreateAccess(
	ctx: MutationCtx,
	userId: string
): Promise<MutationResult | null> {
	const plan = await getUserPlan(ctx, userId);
	if (plan === 'pro') return null;

	const trial = await getProTrial(ctx, userId);

	if (!trial) {
		return {
			success: false,
			message: { key: 'GenericMessages.PRO_TRIAL_REQUIRED' }
		};
	}

	if (Date.now() >= trial.endsAt) {
		return {
			success: false,
			message: { key: 'GenericMessages.PRO_TRIAL_EXPIRED' }
		};
	}

	return null;
}
