// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';
import type { UserDashboardCounts } from '../types/userDashboardTypes';

type GetUserDashboardStatsArgs = {
	accommodations: Doc<'accommodations'>[];
	hospitalities: Doc<'hospitalities'>[];
	pendingReservationsCount: number;
};

async function getActivePartnershipCount(ctx: QueryCtx, args: GetUserDashboardStatsArgs) {
	const partnershipGroups = await Promise.all([
		...args.accommodations.map((accommodation) =>
			ctx.db
				.query('partnerships')
				.withIndex('by_accommodation_active', (q) =>
					q.eq('accommodationId', accommodation._id).eq('isActive', true)
				)
				.collect()
		),
		...args.hospitalities.map((hospitality) =>
			ctx.db
				.query('partnerships')
				.withIndex('by_hospitality_active', (q) =>
					q.eq('hospitalityId', hospitality._id).eq('isActive', true)
				)
				.collect()
		)
	]);

	// A partnership can match through both sides when the user owns the stay AND the venue.
	const activePartnershipIds = new Set(
		partnershipGroups.flat().map((partnership) => partnership._id)
	);
	return activePartnershipIds.size;
}

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
	const activePartnershipCount = await getActivePartnershipCount(ctx, args);

	return {
		accommodations: args.accommodations.length,
		activeAccommodations: activeAccommodationCount,
		hospitalities: args.hospitalities.length,
		activeHospitalities: activeHospitalityCount,
		partnerships: activePartnershipCount,
		pendingReservations: args.pendingReservationsCount
	};
}
