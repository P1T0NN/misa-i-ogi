// LIBRARIES
import { query } from '../../_generated/server';
import { authComponent } from '../auth';

// UTILS
import { isGuestStayIdentity } from '@/convex/tables/guests/utils/isGuestStayIdentity';

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (isGuestStayIdentity(identity)) {
			return null;
		}

		const user = await authComponent.safeGetAuthUser(ctx);
		if (!user) return null;

		// Portfolio ownership flags — used by analytics empty states and similar UI
		// that only needs "owns at least one?" (not counts or partnership totals).
		//
		// We resolve them here instead of a dedicated page query because:
		// - `getCurrentUser` is already subscribed once in the root layout and synced
		//   into `authClass`, so every protected page can read the flags without another
		//   Convex subscription or loading waterfall.
		// - `.take(1)` on `by_owner` is cheap (existence check, not a full portfolio load).
		// - Real platform users almost always own accommodations and/or hospitalities, so
		//   the extra work piggybacks on a query we were already paying for anyway.
		const [accommodation, hospitality, trial] = await Promise.all([
			ctx.db
				.query('accommodations')
				.withIndex('by_owner', (q) => q.eq('ownerId', user._id))
				.take(1),
			ctx.db
				.query('hospitalities')
				.withIndex('by_owner', (q) => q.eq('ownerId', user._id))
				.take(1),
			// Account-level pro-trial state — indexed point read, piggybacked here
			// for the same reason as the flags above (header badge + feature gates
			// read it without another subscription).
			ctx.db
				.query('proTrials')
				.withIndex('by_user', (q) => q.eq('userId', user._id))
				.unique()
		]);

		const hasAccommodations: boolean = accommodation.length > 0;
		const hasHospitalities: boolean = hospitality.length > 0;

		return {
			...user,
			hasAccommodations,
			hasHospitalities,
			plan: (user as { plan?: string | null }).plan ?? 'free',
			/** `null` = trial never started; otherwise its end timestamp (may be past). */
			proTrialEndsAt: trial?.endsAt ?? null
		};
	}
});
