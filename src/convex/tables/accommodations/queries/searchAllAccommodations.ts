// LIBRARIES
import { v } from 'convex/values';

// HELPERS
import { createSearchQuery } from '@/convex/helpers/fetchOptimized';

/** Admin accommodation search across every row, for dropdown pickers. */
export const searchAllAccommodations = createSearchQuery('searchAllAccommodations', {
	table: 'accommodations',
	auth: 'admin',
	args: { search: v.string() },
	search: (_ctx, args) => ({
		index: 'search_name',
		searchField: 'name',
		query: args.search
	})
});
