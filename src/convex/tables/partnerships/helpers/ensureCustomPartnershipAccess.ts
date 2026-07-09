// CONFIG
import { SUBSCRIPTION_ENABLED } from '@/shared/config.js';

// HELPERS
import {
	getProTrial,
	getUserPlan,
	startProTrialIfMissing
} from '@/convex/tables/proTrials/helpers/proTrial';
import { logAudit } from '@/convex/tables/auditLog/helpers/logAudit';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Access gate for every code path about to insert a custom `partnerships` row
 * (instant connect, request accept) — and ONLY those paths, never on request
 * send. The trial always belongs to the *accommodation* owner: "custom
 * partnerships" is scoped to what an accommodation has connected, matching the
 * landing pricing card.
 *
 * Reads the account-level `proTrials` row (shared with hospitality creation).
 * - Pro plan → always allowed.
 * - No trial row yet → this activation STARTS the account's trial (Convex
 *   mutations are transactional, so a failed caller rolls it back too).
 * - Trial running → allowed, unlimited.
 * - Trial over → failed {@link MutationResult}; the expiry cron separately
 *   deactivates the assets created during the trial.
 *
 * Returns `null` when allowed.
 */
export async function ensureCustomPartnershipAccess(
	ctx: MutationCtx,
	accommodationOwnerId: string
): Promise<MutationResult | null> {
	const plan = await getUserPlan(ctx, accommodationOwnerId);
	if (plan === 'pro') return null;

	if (!SUBSCRIPTION_ENABLED) {
		return { success: false, message: { key: 'GenericMessages.FORBIDDEN' } };
	}

	const trial = await getProTrial(ctx, accommodationOwnerId);

	if (trial && Date.now() >= trial.endsAt) {
		return {
			success: false,
			message: { key: 'GenericMessages.CUSTOM_PARTNERSHIP_TRIAL_EXPIRED' }
		};
	}

	// First live custom partnership silently starts the account's trial — record
	// it so this entry path leaves the same evidence as the explicit button.
	const { trialId, endsAt, started } = await startProTrialIfMissing(ctx, accommodationOwnerId);
	if (started) {
		logAudit(ctx, AUDIT_ACTIONS.TRIAL_START, {
			userId: accommodationOwnerId,
			resource: { table: 'proTrials', id: trialId },
			after: { endsAt },
			metadata: { via: 'custom_partnership' }
		});
	}

	return null;
}
