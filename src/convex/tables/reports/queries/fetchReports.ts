// HELPERS
import { fetchOptimized } from '@/convex/helpers/fetchOptimized';

/**
 * Admin-only paginated list of user reports, newest first (built-in
 * `by_creation_time`, cursor strategy — O(per page) at any table size).
 * No consumer page yet; shaped for `ConvexDataTable` when one is built.
 */
export const fetchReports = fetchOptimized('fetchReports', {
	table: 'reports',
	auth: 'admin'
});
