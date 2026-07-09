// CONFIG
import { components } from '@/convex/_generated/api';
import { query } from '@/convex/_generated/server';

// HELPERS
import { requireAdmin } from '@/convex/auth/middleware/authMiddleware';
import { analytics } from '@/convex/analytics';
import { COUNTER_KEYS } from '@/convex/helpers/counterKeys';
import { countGuests } from '../helpers/countGuests';

// TYPES
import type { AdminDashboardPageResult } from '../types/adminDashboardTypes';

export const fetchAdminDashboardPage = query({
	args: {},
	handler: async (ctx): Promise<AdminDashboardPageResult> => {
		await requireAdmin(ctx);

		// All O(1) counter reads — no table is collected, so the dashboard's
		// reactive read set stays tiny and it doesn't re-run on every row write.
		const [totalUsers, entityCounts, guestCount] = await Promise.all([
			ctx.runQuery(components.betterAuth.userQueries.countUsers, {}),
			analytics.counters.getMany(ctx, [
				COUNTER_KEYS.ACCOMMODATIONS_TOTAL,
				COUNTER_KEYS.HOSPITALITIES_TOTAL,
				COUNTER_KEYS.PARTNERSHIPS_TOTAL
			]),
			countGuests(ctx)
		]);

		return {
			totals: {
				users: totalUsers,
				accommodations: entityCounts[COUNTER_KEYS.ACCOMMODATIONS_TOTAL] ?? 0,
				hospitalities: entityCounts[COUNTER_KEYS.HOSPITALITIES_TOTAL] ?? 0,
				partnerships: entityCounts[COUNTER_KEYS.PARTNERSHIPS_TOTAL] ?? 0,
				guests: guestCount
			}
		};
	}
});
