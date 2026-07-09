// LIBRARIES
import { m } from '@/shared/lib/paraglide/messages';

// TYPES
import type {
	HospitalityType,
	ReservationMode
} from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

/**
 * Per-kind message accessors — call at use time (e.g. in render), not at module load,
 * so Paraglide can follow locale switches.
 */
export const HOSPITALITIES_DATA: Record<HospitalityType, () => string> = {
	restaurant: () => m['HospitalityData.typeRestaurant'](),
	cafe: () => m['HospitalityData.typeCafe'](),
	bar: () => m['HospitalityData.typeBar'](),
	night_club: () => m['HospitalityData.typeNightClub'](),
	horse_ride: () => m['HospitalityData.typeHorseRide'](),
	spa: () => m['HospitalityData.typeSpa'](),
	tour: () => m['HospitalityData.typeTour'](),
	other: () => m['HospitalityData.typeOtherVenue']()
};

const HOSPITALITIES_ORDER = [
	'restaurant',
	'cafe',
	'bar',
	'night_club',
	'horse_ride',
	'spa',
	'tour',
	'other'
] as const satisfies readonly HospitalityType[];

/** Localized label for a `hospitalities.type` value (tables, public pages, filters). */
export function labelHospitalityType(type: HospitalityType): string {
	return HOSPITALITIES_DATA[type]();
}

/** Select options for admin create/edit forms — order matches product defaults. */
export function hospitalityTypeSelectOptions(): Array<{ value: HospitalityType; label: string }> {
	return HOSPITALITIES_ORDER.map((value) => ({ value, label: labelHospitalityType(value) }));
}

/** Available reservation workflows. Additional options can be restored when implemented. */
export function reservationModeSelectOptions(): Array<{ value: ReservationMode; label: string }> {
	return [{ value: 'managed_request', label: m['ManagedReservationsAlert.title']() }];
}

/**
 * Admin-only `createType` picker. `platform` = a public venue every accommodation
 * can be linked to; `user` = a private venue reachable only through the owner's
 * custom-partnership connect code (never shown in other accommodations' benefits).
 */
export function partnerTypeSelectOptions(): Array<{ value: 'platform' | 'user'; label: string }> {
	return [
		{ value: 'platform', label: m['HospitalityData.partnerTypePlatform']() },
		{ value: 'user', label: m['HospitalityData.partnerTypeUser']() }
	];
}
