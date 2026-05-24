// LIBRARIES
import { v } from 'convex/values';

// HELPERS
import { fetchOptimized } from '@/convex/helpers/fetchOptimized';

/**
 * Admin-only paginated list of every hospitality. Cursor pagination — stays O(per page)
 * as the table grows. Optional column sort uses declared indexes (`by_name`, `by_city`,
 * `by_type`); default order is `_creationTime` (newest first).
 */
export const fetchAllHospitalities = fetchOptimized('fetchAllHospitalities', {
	table: 'hospitalities',
	auth: 'admin',
	args: {
		sortColumn: v.optional(
			v.union(
				v.literal('name'),
				v.literal('city'),
				v.literal('type'),
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
		return null;
	}
});
