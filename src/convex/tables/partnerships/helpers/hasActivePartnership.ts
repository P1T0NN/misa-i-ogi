// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

export async function hasActiveAccommodationPartnership(
	ctx: QueryCtx,
	accommodationId: Id<'accommodations'>
): Promise<boolean> {
	const partnership = await ctx.db
		.query('partnerships')
		.withIndex('by_accommodation_active', (q) =>
			q.eq('accommodationId', accommodationId).eq('isActive', true)
		)
		.first();
	return partnership !== null;
}

export async function hasActiveHospitalityPartnership(
	ctx: QueryCtx,
	hospitalityId: Id<'hospitalities'>
): Promise<boolean> {
	const partnership = await ctx.db
		.query('partnerships')
		.withIndex('by_hospitality_active', (q) =>
			q.eq('hospitalityId', hospitalityId).eq('isActive', true)
		)
		.first();
	return partnership !== null;
}
