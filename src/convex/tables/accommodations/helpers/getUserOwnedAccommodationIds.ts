// HELPERS
import { getUserOwnedAccommodations } from './getUserOwnedAccommodations';

// TYPES
import type { Id } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

export async function getUserOwnedAccommodationIds(
	ctx: QueryCtx,
	userId: string
): Promise<Id<'accommodations'>[]> {
	const accommodations = await getUserOwnedAccommodations(ctx, userId);
	return accommodations.map((accommodation) => accommodation._id);
}
