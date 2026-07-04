// HELPERS
import { authComponent } from '@/convex/auth/auth';

// TYPES
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';
import type { Doc, Id } from '@/convex/_generated/dataModel';

/** "1 month free" on the landing page — one trial per account, forever. */
export const PRO_TRIAL_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

/** The user's plan off the better-auth row; missing field = `free`. */
export async function getUserPlan(ctx: QueryCtx, userId: string): Promise<string> {
	const user = await authComponent.getAnyUserById(ctx, userId);
	return (user as { plan?: string } | null)?.plan ?? 'free';
}

/** The account's single trial row, or `null` if never started. */
export async function getProTrial(ctx: QueryCtx, userId: string): Promise<Doc<'proTrials'> | null> {
	return await ctx.db
		.query('proTrials')
		.withIndex('by_user', (q) => q.eq('userId', userId))
		.unique();
}

/**
 * Insert the one-per-account trial row if it doesn't exist yet. Shared by the
 * explicit `startProTrial` mutation and the custom-partnership auto-start path.
 * Returns the trial row id, its end timestamp, and whether this call inserted
 * it (`started: false` = one already existed, expired or not — callers decide
 * how to fail).
 */
export async function startProTrialIfMissing(
	ctx: MutationCtx,
	userId: string
): Promise<{ trialId: Id<'proTrials'>; endsAt: number; started: boolean }> {
	const existing = await getProTrial(ctx, userId);
	if (existing) return { trialId: existing._id, endsAt: existing.endsAt, started: false };

	const endsAt = Date.now() + PRO_TRIAL_DURATION_MS;
	const trialId = await ctx.db.insert('proTrials', { userId, endsAt });
	return { trialId, endsAt, started: true };
}
