// LIBRARIES
import { ConvexError } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { getReservations } from '@/convex/tables/reservations/helpers/getReservations';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type {
	FetchReservationsSummaryResult,
	ReservationCounts
} from '@/convex/tables/reservations/types/reservationsTypes';

/** Owner-scoped reservation list plus tab metadata. */
export const fetchReservationsSummary = query({
	args: {},
	handler: async (ctx): Promise<FetchReservationsSummaryResult> => {
		const ownerId = await getAuthUserId(ctx);
		if (!ownerId) {
			throw new ConvexError({
				code: 'NOT_AUTHENTICATED',
				message: { key: 'GenericMessages.NOT_AUTHENTICATED' }
			} satisfies ConvexErrorPayload);
		}

		const reservations = await getReservations(ctx, ownerId);

		const hospitalityNames = [
			...new Set(reservations.map((reservation) => reservation.hospitalityName))
		].sort();

		const counts: ReservationCounts = {
			pending: 0,
			confirmed: 0,
			cancelled: 0,
			no_show: 0
		};

		for (const reservation of reservations) {
			counts[reservation.status] += 1;
		}

		return {
			hospitalityNames,
			counts
		};
	}
});
