// HELPERS
import { fetchOptimized } from '@/convex/helpers/fetchOptimized';

/** Owner-facing paginated list of active platform venues (partnerships hub + admin pickers). */
export const fetchActivePlatformHospitalities = fetchOptimized({
	table: 'hospitalities',
	auth: 'user',
	strategy: 'cursor',
	order: 'asc',
	where: async () => ({
		index: 'by_create_type_active' as const,
		eq: { createType: 'platform' as const, isActive: true }
	})
});
