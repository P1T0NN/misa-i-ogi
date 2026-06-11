// CONFIG
import { components } from '@/convex/_generated/api';
import { query } from '@/convex/_generated/server';

// HELPERS
import { requireAdmin } from '@/convex/auth/middleware/authMiddleware';
import { countGuests } from '../helpers/countGuests';
import { getRecentReservations } from '@/convex/tables/reservations/helpers/getRecentReservations';
import { getReservationCountsByStatus } from '@/convex/tables/reservations/helpers/getReservationCountsByStatus';

// UTILS
import { summarizeAccommodations } from '../utils/summarizeAccommodations';
import { summarizeActivePartnerships } from '../utils/summarizeActivePartnerships';
import { summarizeHospitalities } from '../utils/summarizeHospitalities';

// TYPES
import type { AdminDashboardPageResult } from '../types/adminDashboardTypes';

export const fetchAdminDashboardPage = query({
	args: {},
	handler: async (ctx): Promise<AdminDashboardPageResult> => {
		await requireAdmin(ctx);

		const [
			totalUsers,
			accommodations,
			hospitalities,
			partnerships,
			guestCount,
			reservationCounts,
			recentReservations
		] = await Promise.all([
			ctx.runQuery(components.betterAuth.userQueries.countUsers, {}),
			ctx.db.query('accommodations').collect(),
			ctx.db.query('hospitalities').collect(),
			ctx.db.query('partnerships').collect(),
			countGuests(ctx),
			getReservationCountsByStatus(ctx),
			getRecentReservations(ctx)
		]);

		const {
			active: activePartnerships,
			activeAccommodationIds,
			activeHospitalityIds
		} = summarizeActivePartnerships(partnerships);

		const accommodationSummary = summarizeAccommodations(accommodations, activeAccommodationIds);

		const hospitalitySummary = summarizeHospitalities(hospitalities, activeHospitalityIds);

		return {
			totals: {
				users: totalUsers,
				accommodations: accommodationSummary.total,
				activeAccommodations: accommodationSummary.active,
				hospitalities: hospitalitySummary.total,
				activeHospitalities: hospitalitySummary.active,
				partnerships: activePartnerships,
				guests: guestCount
			},
			reservationCounts,
			setupHealth: {
				inactiveAccommodations: accommodationSummary.inactive,
				inactiveHospitalities: hospitalitySummary.inactive,
				unlinkedAccommodations: accommodationSummary.unlinked,
				unlinkedHospitalities: hospitalitySummary.unlinked,
				pendingReservations: reservationCounts.pending
			},
			recentReservations
		};
	}
});
