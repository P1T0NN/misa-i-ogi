// TYPES
import type { QueryCtx } from '@/convex/_generated/server';

export async function getReservations(ctx: QueryCtx, hospitalityOwnerId: string) {
	return await ctx.db
		.query('reservations')
		.withIndex('by_hospitality_owner', (q) => q.eq('hospitalityOwnerId', hospitalityOwnerId))
		.order('desc')
		.collect();
}
