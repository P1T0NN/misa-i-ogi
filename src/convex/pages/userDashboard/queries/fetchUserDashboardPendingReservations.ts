// LIBRARIES
import { ConvexError } from 'convex/values';

// CONFIG
import { query } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { getUserDashboardPendingReservations } from '../helpers/getUserDashboardPendingReservations';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type { UserDashboardPendingReservation } from '../types/userDashboardTypes';

export const fetchUserDashboardPendingReservations = query({
	args: {},
	handler: async (ctx): Promise<UserDashboardPendingReservation[]> => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new ConvexError({
				code: 'NOT_AUTHENTICATED',
				message: { key: 'GenericMessages.NOT_AUTHENTICATED' }
			} satisfies ConvexErrorPayload);
		}

		const ownedHospitalities = await ctx.db
			.query('hospitalities')
			.withIndex('by_owner', (q) => q.eq('ownerId', userId))
			.take(1);

		if (ownedHospitalities.length === 0) return [];

		const result = await getUserDashboardPendingReservations(ctx, userId);
		return result.items;
	}
});
