// LIBRARIES
import { m } from '@/shared/lib/paraglide/messages';

// TYPES
import type { AccommodationType } from '@/convex/tables/accommodations/types/accommodationsTypes';

/** Call at use time so Paraglide can follow locale switches. */
export const ACCOMMODATIONS_DATA: Record<AccommodationType, () => string> = {
	apartment: () => m['AccommodationsData.typeApartment'](),
	hotel: () => m['AccommodationsData.typeHotel'](),
	villa: () => m['AccommodationsData.typeVilla'](),
	hostel: () => m['AccommodationsData.typeHostel'](),
	other: () => m['AccommodationsData.typeOther']()
};

const ACCOMMODATIONS_ORDER = [
	'apartment',
	'hotel',
	'villa',
	'hostel',
	'other'
] as const satisfies readonly AccommodationType[];

/** Localized label for an `accommodations.type` value (tables, public pages, filters). */
export function labelAccommodationType(type: AccommodationType): string {
	return ACCOMMODATIONS_DATA[type]();
}

/** Select options for admin create/edit forms. */
export function accommodationTypeSelectOptions(): Array<{
	value: AccommodationType;
	label: string;
}> {
	return ACCOMMODATIONS_ORDER.map((value) => ({ value, label: labelAccommodationType(value) }));
}
