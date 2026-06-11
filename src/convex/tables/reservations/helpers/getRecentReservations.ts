// TYPES
import type { QueryCtx } from '@/convex/_generated/server';

const RECENT_RESERVATION_LIMIT = 5;

export async function getRecentReservations(ctx: QueryCtx) {
	return ctx.db.query('reservations').order('desc').take(RECENT_RESERVATION_LIMIT);
}
