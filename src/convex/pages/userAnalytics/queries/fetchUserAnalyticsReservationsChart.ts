// CONFIG
import { query } from '@/convex/_generated/server';

// HELPERS
import { requireAuthUserId } from '@/convex/auth/middleware/authMiddleware';
import { getUserAnalyticsChartData } from '../helpers/getUserAnalyticsChartData';

// TYPES
import type { UserAnalyticsChartPoint } from '../types/userAnalyticsTypes';

export const fetchUserAnalyticsReservationsChart = query({
	args: {},
	handler: async (ctx): Promise<UserAnalyticsChartPoint[]> => {
		const userId = await requireAuthUserId(ctx);

		return getUserAnalyticsChartData(ctx, 'newReservations', userId);
	}
});
