// LIBRARIES
import { v } from 'convex/values';

// HELPERS
import { fetchOptimized } from '@/convex/helpers/fetchOptimized';

/**
 * Admin-only paginated list of `partnerships` rows. Cursor pagination — no joins;
 * the table only stores foreign keys to accommodations and hospitalities.
 */
export const fetchAllPartnerships = fetchOptimized('fetchAllPartnerships', {
	table: 'partnerships',
	auth: 'admin',
	args: {
		sortColumn: v.optional(
			v.union(v.literal('accommodation'), v.literal('hospitality'), v.literal('created'))
		),
		sortDirection: v.optional(v.union(v.literal('asc'), v.literal('desc')))
	},
	order: (args) => args.sortDirection ?? 'desc',
	where: (_ctx, args) => {
		if (args.sortColumn === 'accommodation') return { index: 'by_accommodation' };
		if (args.sortColumn === 'hospitality') return { index: 'by_hospitality' };
		return null;
	}
});
