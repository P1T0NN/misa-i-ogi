// LIBRARIES
import { v } from 'convex/values';

// HELPERS
import { createSearchQuery } from '@/convex/helpers/fetchOptimized';

/**
 * Owner-scoped accommodation search for dropdown pickers. Matches on `name` via the
 * `search_name` full-text index, filtered to the caller's own rows.
 */
export const searchMyAccommodations = createSearchQuery('searchMyAccommodations', {
	table: 'accommodations',
	auth: 'user',
	args: { search: v.string() },
	search: (_ctx, args, auth) => {
		if (!auth.userId) return null;
		return {
			index: 'search_name',
			searchField: 'name',
			query: args.search,
			eq: { ownerId: auth.userId }
		};
	}
});
