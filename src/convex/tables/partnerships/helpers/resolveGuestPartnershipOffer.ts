// HELPERS
import { getActiveAccommodationPartnership } from '@/convex/tables/partnerships/helpers/getActiveAccommodationPartnership';
import { partnershipBenefitSafe } from '@/convex/tables/partnerships/validators/partnershipQueryValidators';

// UTILS
import { isPlatformHospitality } from '@/convex/tables/hospitalities/utils/isPlatformHospitality';

// TYPES
import type { PartnershipBenefitSafe } from '@/convex/tables/partnerships/types/partnershipsTypes';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';

/**
 * Guest-facing offer for a stay pair. Returns `null` when there is no label to
 * show (no active custom partnership).
 */
export async function resolveGuestPartnershipOffer(
	ctx: QueryCtx | MutationCtx,
	accommodationId: Id<'accommodations'>,
	hospitality: Doc<'hospitalities'>,
	explicitPartnership?: Doc<'partnerships'> | null
): Promise<PartnershipBenefitSafe | null> {
	if (isPlatformHospitality(hospitality)) {
		return partnershipBenefitSafe.project(hospitality);
	}

	const partnership =
		explicitPartnership ??
		(await getActiveAccommodationPartnership(ctx, accommodationId, hospitality._id));
	if (!partnership) return null;

	return partnershipBenefitSafe.project(partnership);
}

/**
 * Access check + detail offer in one partnership read for non-platform venues.
 */
export async function resolveGuestPartnershipForDetail(
	ctx: QueryCtx | MutationCtx,
	accommodationId: Id<'accommodations'>,
	hospitality: Doc<'hospitalities'>
): Promise<{ hasAccess: boolean; offer: PartnershipBenefitSafe | null }> {
	if (isPlatformHospitality(hospitality)) {
		return {
			hasAccess: true,
			offer: partnershipBenefitSafe.project(hospitality)
		};
	}

	const partnership = await getActiveAccommodationPartnership(
		ctx,
		accommodationId,
		hospitality._id
	);
	if (!partnership) {
		return { hasAccess: false, offer: null };
	}

	return {
		hasAccess: true,
		offer: partnershipBenefitSafe.project(partnership)
	};
}
