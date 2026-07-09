// HELPERS
import { getActivePartnershipsCount } from '@/convex/helpers/ownerCounterHelpers';

// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';
import type { UserDashboardCounts } from '../types/userDashboardTypes';

type GetUserDashboardStatsArgs = {
	userId: string;
	accommodations: Doc<'accommodations'>[];
	hospitalities: Doc<'hospitalities'>[];
	pendingReservationsCount: number;
};

export async function getUserDashboardStats(
	ctx: QueryCtx,
	args: GetUserDashboardStatsArgs
): Promise<UserDashboardCounts> {
	const activeAccommodationCount = args.accommodations.filter(
		(accommodation) => accommodation.isActive
	).length;
	const activeHospitalityCount = args.hospitalities.filter(
		(hospitality) => hospitality.isActive
	).length;
	const activePartnershipCount = await getActivePartnershipsCount(ctx, args.userId);

	return {
		accommodations: args.accommodations.length,
		activeAccommodations: activeAccommodationCount,
		hospitalities: args.hospitalities.length,
		activeHospitalities: activeHospitalityCount,
		partnerships: activePartnershipCount,
		pendingReservations: args.pendingReservationsCount
	};
}
