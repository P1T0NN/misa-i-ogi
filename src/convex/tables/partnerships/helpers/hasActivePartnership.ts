import { getActiveAccommodationPartnership } from '@/convex/tables/partnerships/helpers/getActiveAccommodationPartnership';
import { isPlatformHospitality } from '@/convex/tables/hospitalities/utils/isPlatformHospitality';

// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';

/** Whether a guest stay may access a venue (platform = implicit; custom = active row). */
export async function hasActivePartnership(
	ctx: QueryCtx | MutationCtx,
	accommodationId: Id<'accommodations'>,
	hospitalityOrId: Id<'hospitalities'> | Doc<'hospitalities'>
): Promise<boolean> {
	const hospitality =
		typeof hospitalityOrId === 'string' ? await ctx.db.get(hospitalityOrId) : hospitalityOrId;
	if (!hospitality?.isActive) return false;

	if (isPlatformHospitality(hospitality)) return true;

	const partnership = await getActiveAccommodationPartnership(
		ctx,
		accommodationId,
		hospitality._id
	);

	return partnership !== null;
}

/** Delete guard — accommodation still has an active explicit partnership row. */
export async function hasActiveAccommodationPartnership(
	ctx: QueryCtx | MutationCtx,
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

/** Delete guard — hospitality still has an active explicit partnership row. */
export async function hasActiveHospitalityPartnership(
	ctx: QueryCtx | MutationCtx,
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
