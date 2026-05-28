// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getActiveGuestSessionFromAuth } from '@/convex/tables/guests/helpers/getActiveGuestSessionFromAuth';
import { hasActiveAccommodationHospitalityPartnership } from '@/convex/tables/partnerships/helpers/getAccommodationPartnerships';

// UTILS
import { authComponent } from '@/convex/auth/auth';

// TYPES
import type { HospitalityDetailsResult } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

/**
 * Hospitality detail gated at the Convex boundary.
 *
 * Allowed callers:
 * - active guest stay identities
 * - admins
 * - the owner of the hospitality row
 *
 * Missing/inactive rows and unauthorized non-guest callers both return `not_found`.
 * Active guests get `not_partnered` when the hospitality exists but their current
 * accommodation does not have an active partnership with it.
 */
export const fetchHospitalityDetails = query({
	args: {
		hospitalityId: v.id('hospitalities')
	},
	handler: async (ctx, args): Promise<HospitalityDetailsResult> => {
		const hospitality = await ctx.db.get(args.hospitalityId);
		if (!hospitality?.isActive) return { status: 'not_found' };

		const activeGuest = await getActiveGuestSessionFromAuth(ctx);
		if (activeGuest) {
			const hasGuestAccess = await hasActiveAccommodationHospitalityPartnership(
				ctx,
				activeGuest.accommodationId,
				hospitality._id
			);
			if (!hasGuestAccess) return { status: 'not_partnered' };
		} else {
			const currentUser = await authComponent.safeGetAuthUser(ctx);
			const isAdmin = currentUser?.role === 'admin';
			const isOwner = currentUser?._id === hospitality.ownerId;

			if (!isAdmin && !isOwner) return { status: 'not_found' };
		}

		return {
			status: 'available',
			hospitality: {
				_id: hospitality._id,
				name: hospitality.name,
				type: hospitality.type,
				address: hospitality.address,
				city: hospitality.city,
				country: hospitality.country,
				description: hospitality.description,
				contactPhone: hospitality.contactPhone,
				coverImageUrl: hospitality.coverImageUrl
			}
		};
	}
});
