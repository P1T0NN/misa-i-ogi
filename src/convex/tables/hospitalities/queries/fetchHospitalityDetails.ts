// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getHospitalitySafe } from '@/convex/tables/hospitalities/helpers/getHospitality';

// TYPES
import type { HospitalityDetailsSafe } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

/**
 * Public venue detail. Today: {@link getHospitalitySafe} only.
 * Later: merge partnerships and linked accommodations into this response.
 */
export const fetchHospitalityDetails = query({
	args: {
		hospitalityId: v.id('hospitalities')
	},
	handler: async (ctx, args): Promise<HospitalityDetailsSafe | null> =>
		getHospitalitySafe(ctx, args.hospitalityId)
});
