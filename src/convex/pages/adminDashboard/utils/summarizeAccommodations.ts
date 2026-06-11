// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';

export function summarizeAccommodations(
	accommodations: Doc<'accommodations'>[],
	linkedAccommodationIds: Set<Id<'accommodations'>>
) {
	let active = 0;
	let inactive = 0;
	let unlinked = 0;

	for (const accommodation of accommodations) {
		if (accommodation.isActive) {
			active += 1;

			if (!linkedAccommodationIds.has(accommodation._id)) {
				unlinked += 1;
			}
		} else {
			inactive += 1;
		}
	}

	return {
		total: accommodations.length,
		active,
		inactive,
		unlinked
	};
}
