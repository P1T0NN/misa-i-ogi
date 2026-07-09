// LIBRARIES
import { ConvexError } from 'convex/values';

// CONFIG
import { query } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { getOwnerReservationStatusCount } from '@/convex/helpers/ownerCounterHelpers';
import { getUserDashboardStats } from '../helpers/getUserDashboardStats';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type { UserDashboardCounts } from '../types/userDashboardTypes';

export const fetchUserDashboardStats = query({
	args: {},
	handler: async (ctx): Promise<UserDashboardCounts> => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new ConvexError({
				code: 'NOT_AUTHENTICATED',
				message: { key: 'GenericMessages.NOT_AUTHENTICATED' }
			} satisfies ConvexErrorPayload);
		}

		const [accommodations, hospitalities, pendingReservationsCount] = await Promise.all([
			ctx.db
				.query('accommodations')
				.withIndex('by_owner', (q) => q.eq('ownerId', userId))
				.collect(),
			ctx.db
				.query('hospitalities')
				.withIndex('by_owner', (q) => q.eq('ownerId', userId))
				.collect(),
			getOwnerReservationStatusCount(ctx, userId, 'pending')
		]);

		return await getUserDashboardStats(ctx, {
			userId,
			accommodations,
			hospitalities,
			pendingReservationsCount
		});
	}
});
