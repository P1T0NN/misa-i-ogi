// TYPES
import type { Doc, Id } from '@/convex/_generated/dataModel';

export function summarizeActivePartnerships(partnerships: Doc<'partnerships'>[]) {
	const activeAccommodationIds = new Set<Id<'accommodations'>>();
	const activeHospitalityIds = new Set<Id<'hospitalities'>>();
	let active = 0;

	for (const partnership of partnerships) {
		if (!partnership.isActive) continue;

		active += 1;
		activeAccommodationIds.add(partnership.accommodationId);
		activeHospitalityIds.add(partnership.hospitalityId);
	}

	return {
		active,
		activeAccommodationIds,
		activeHospitalityIds
	};
}
