// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';
import type { UserDashboardStat } from '../types/userDashboardTypes';

type GetUserDashboardStatsArgs = {
	accommodations: Doc<'accommodations'>[];
	hospitalities: Doc<'hospitalities'>[];
	pendingReservationsCount: number;
};

function formatCount(value: number) {
	return value.toLocaleString('en-US');
}

async function getActivePartnershipCount(ctx: QueryCtx, args: GetUserDashboardStatsArgs) {
	const activePartnershipIds = new Set<string>();

	for (const accommodation of args.accommodations) {
		const partnerships = await ctx.db
			.query('partnerships')
			.withIndex('by_accommodation', (q) => q.eq('accommodationId', accommodation._id))
			.collect();

		for (const partnership of partnerships) {
			if (partnership.isActive) activePartnershipIds.add(partnership._id);
		}
	}

	for (const hospitality of args.hospitalities) {
		const partnerships = await ctx.db
			.query('partnerships')
			.withIndex('by_hospitality', (q) => q.eq('hospitalityId', hospitality._id))
			.collect();

		for (const partnership of partnerships) {
			if (partnership.isActive) activePartnershipIds.add(partnership._id);
		}
	}

	return activePartnershipIds.size;
}

export async function getUserDashboardStats(
	ctx: QueryCtx,
	args: GetUserDashboardStatsArgs
): Promise<UserDashboardStat[]> {
	const activeAccommodationCount = args.accommodations.filter(
		(accommodation) => accommodation.isActive
	).length;
	const activeHospitalityCount = args.hospitalities.filter((hospitality) => hospitality.isActive).length;
	const activePartnershipCount = await getActivePartnershipCount(ctx, args);

	return [
		{
			key: 'stays',
			label: 'Stays',
			value: formatCount(args.accommodations.length),
			detail: `${formatCount(activeAccommodationCount)} active accommodations`
		},
		{
			key: 'venues',
			label: 'Venues',
			value: formatCount(args.hospitalities.length),
			detail: `${formatCount(activeHospitalityCount)} active venues`
		},
		{
			key: 'activeLinks',
			label: 'Active links',
			value: formatCount(activePartnershipCount),
			detail: 'Current stay to venue partnerships'
		},
		{
			key: 'pendingReservations',
			label: 'Pending',
			value: formatCount(args.pendingReservationsCount),
			detail: 'Reservation requests to review'
		}
	];
}
