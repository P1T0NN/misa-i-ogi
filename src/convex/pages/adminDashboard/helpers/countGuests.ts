// TYPES
import type { QueryCtx } from '@/convex/_generated/server';

export async function countGuests(ctx: QueryCtx) {
	const guests = await ctx.db.query('guests').collect();
	return guests.length;
}
