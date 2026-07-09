// TYPES
import type { ProjectionType } from '@/convex/helpers/createProjection';
import type {
	partnershipAccommodationSafeValidator,
	partnershipBenefitSafe,
	partnershipScanHospitalitySafe
} from '@/convex/tables/partnerships/validators/partnershipQueryValidators';
import type { Infer } from 'convex/values';

/** Guest-facing partnership offer label — `benefit` only. */
export type PartnershipBenefitSafe = ProjectionType<typeof partnershipBenefitSafe>;

/** Venue card on a stay's perks list — not the full detail page. */
export type PartnershipScanHospitalitySafe = ProjectionType<typeof partnershipScanHospitalitySafe>;

/** Custom partnership row joined with its venue for the guest stay perks list. */
export type PartnershipAccommodationSafe = Infer<typeof partnershipAccommodationSafeValidator>;
