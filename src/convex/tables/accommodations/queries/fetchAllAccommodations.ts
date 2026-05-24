// LIBRARIES
import { v } from 'convex/values';

// HELPERS
import { fetchOptimized } from '@/convex/helpers/fetchOptimized';

/**
 * Admin-only paginated list of every accommodation. Cursor pagination — stays O(per page)
 * as the table grows. Optional column sort uses declared indexes (`by_name`, `by_city`,
 * `by_type`, `by_scan_token`); default order is `_creationTime` (newest first).
 */
export const fetchAllAccommodations = fetchOptimized('fetchAllAccommodations', {
	table: 'accommodations',
	auth: 'admin',
	args: {
		sortColumn: v.optional(
			v.union(
				v.literal('name'),
				v.literal('city'),
				v.literal('type'),
				v.literal('scanToken'),
				v.literal('created')
			)
		),
		sortDirection: v.optional(v.union(v.literal('asc'), v.literal('desc')))
	},
	order: (args) => args.sortDirection ?? 'desc',
	where: (_ctx, args) => {
		if (args.sortColumn === 'name') return { index: 'by_name' };
		if (args.sortColumn === 'city') return { index: 'by_city' };
		if (args.sortColumn === 'type') return { index: 'by_type' };
		if (args.sortColumn === 'scanToken') return { index: 'by_scan_token' };
		return null;
	}
});
