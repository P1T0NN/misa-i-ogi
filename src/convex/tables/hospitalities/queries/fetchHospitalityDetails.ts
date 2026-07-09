// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';
import { authComponent } from '@/convex/auth/auth';

// HELPERS
import { getActiveGuestSessionFromAuth } from '@/convex/tables/guests/helpers/getActiveGuestSessionFromAuth';
import { resolveGuestPartnershipForDetail } from '@/convex/tables/partnerships/helpers/resolveGuestPartnershipOffer';
import { getGuestActiveHospitalityReservation } from '@/convex/tables/reservations/helpers/getGuestActiveHospitalityReservation';

// UTILS
import { isGuestStayIdentity } from '@/convex/tables/guests/utils/isGuestStayIdentity';

// VALIDATORS
import {
	hospitalityDetailsSafe,
	projectHospitalityGuestReservation
} from '@/convex/tables/hospitalities/validators/hospitalityQueryValidators';

// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { HospitalityDetailsResult } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';
import type { PartnershipBenefitSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';

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

		const identity = await ctx.auth.getUserIdentity();
		const activeGuest = await getActiveGuestSessionFromAuth(ctx);

		let guestReservation: Doc<'reservations'> | null = null;
		let partnership: PartnershipBenefitSafe | null = null;

		if (isGuestStayIdentity(identity) && !activeGuest) {
			return { status: 'not_found' };
		}

		if (activeGuest) {
			const guestPartnership = await resolveGuestPartnershipForDetail(
				ctx,
				activeGuest.accommodationId,
				hospitality
			);
			if (!guestPartnership.hasAccess) return { status: 'not_partnered' };

			partnership = guestPartnership.offer;

			guestReservation = await getGuestActiveHospitalityReservation(
				ctx,
				activeGuest._id,
				hospitality._id
			);
		} else {
			const currentUser = await authComponent.safeGetAuthUser(ctx);
			const isAdmin = currentUser?.role === 'admin';
			const isOwner = currentUser?._id === hospitality.ownerId;

			if (!isAdmin && !isOwner) return { status: 'not_found' };
		}

		return {
			status: 'available',
			hospitality: hospitalityDetailsSafe.project(hospitality),
			partnership,
			guestReservation: guestReservation
				? projectHospitalityGuestReservation(guestReservation)
				: null
		};
	}
});
