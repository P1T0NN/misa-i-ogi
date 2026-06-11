// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';

export function summarizeHospitalities(
	hospitalities: Doc<'hospitalities'>[],
	linkedHospitalityIds: Set<Id<'hospitalities'>>
) {
	let active = 0;
	let inactive = 0;
	let unlinked = 0;

	for (const hospitality of hospitalities) {
		if (hospitality.isActive) {
			active += 1;

			if (!linkedHospitalityIds.has(hospitality._id)) {
				unlinked += 1;
			}
		} else {
			inactive += 1;
		}
	}

	return {
		total: hospitalities.length,
		active,
		inactive,
		unlinked
	};
}
