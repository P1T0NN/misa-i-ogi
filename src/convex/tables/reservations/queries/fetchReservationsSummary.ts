// LIBRARIES
import { ConvexError } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { getOwnerReservationCounts } from '@/convex/helpers/ownerCounterHelpers';

// VALIDATORS
import { fetchReservationsSummaryResultValidator } from '@/convex/tables/reservations/validators/reservationQueryValidators';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type { FetchReservationsSummaryResult } from '@/convex/tables/reservations/types/reservationsTypes';

/** Owner-scoped reservation tab metadata (counts + filter venue names). */
export const fetchReservationsSummary = query({
	args: {},
	returns: fetchReservationsSummaryResultValidator,
	handler: async (ctx): Promise<FetchReservationsSummaryResult> => {
		const ownerId = await getAuthUserId(ctx);
		if (!ownerId) {
			throw new ConvexError({
				code: 'NOT_AUTHENTICATED',
				message: { key: 'GenericMessages.NOT_AUTHENTICATED' }
			} satisfies ConvexErrorPayload);
		}

		const [counts, hospitalities] = await Promise.all([
			getOwnerReservationCounts(ctx, ownerId),
			ctx.db
				.query('hospitalities')
				.withIndex('by_owner', (q) => q.eq('ownerId', ownerId))
				.collect()
		]);

		return {
			hospitalityNames: hospitalities.map((hospitality) => hospitality.name).sort(),
			counts
		};
	}
});
