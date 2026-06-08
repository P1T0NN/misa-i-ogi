// TYPES
import type { QueryCtx } from '@/convex/_generated/server';
import type {
	UserDashboardPendingReservation,
	UserDashboardPendingReservationsResult
} from '../types/userDashboardTypes';

const DASHBOARD_PENDING_RESERVATIONS_LIMIT = 2;

export async function getUserDashboardPendingReservations(
	ctx: QueryCtx,
	userId: string,
	limit = DASHBOARD_PENDING_RESERVATIONS_LIMIT
): Promise<UserDashboardPendingReservationsResult> {
	const reservations = await ctx.db
		.query('reservations')
		.withIndex('by_hospitality_owner_status', (q) =>
			q.eq('hospitalityOwnerId', userId).eq('status', 'pending')
		)
		.order('desc')
		.collect();

	const items: UserDashboardPendingReservation[] = reservations.slice(0, limit).map((reservation) => ({
		id: reservation._id,
		guestName: reservation.guestName,
		hospitalityName: reservation.hospitalityName,
		email: reservation.email,
		phone: reservation.phone,
		guestCount: reservation.guestCount,
		requestedTime: reservation.requestedTime,
		status: reservation.status
	}));

	return {
		items,
		totalCount: reservations.length
	};
}
