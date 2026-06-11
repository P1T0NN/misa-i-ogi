// LIBRARIES
import { ConvexError } from 'convex/values';

// CONFIG
import { query } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
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

		const [accommodations, hospitalities, pendingReservations] = await Promise.all([
			ctx.db
				.query('accommodations')
				.withIndex('by_owner', (q) => q.eq('ownerId', userId))
				.collect(),
			ctx.db
				.query('hospitalities')
				.withIndex('by_owner', (q) => q.eq('ownerId', userId))
				.collect(),
			ctx.db
				.query('reservations')
				.withIndex('by_hospitality_owner_status', (q) =>
					q.eq('hospitalityOwnerId', userId).eq('status', 'pending')
				)
				.collect()
		]);

		return await getUserDashboardStats(ctx, {
			accommodations,
			hospitalities,
			pendingReservationsCount: pendingReservations.length
		});
	}
});
