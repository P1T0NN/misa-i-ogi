// LIBRARIES
import { getLocale } from '@/shared/lib/paraglide/runtime';

/** Straight-line ("as the crow flies") distance in metres between two lat/lng points (haversine). */
export function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number): number {
	const R = 6371000;
	const toRad = (d: number) => (d * Math.PI) / 180;
	const dLat = toRad(bLat - aLat);
	const dLng = toRad(bLng - aLng);
	const s =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** Compact, locale-aware distance, e.g. "320 m" (en) or "1,2 km" (sr). */
export function formatDistance(meters: number): string {
	const km = meters >= 1000;
	return new Intl.NumberFormat(getLocale(), {
		style: 'unit',
		unit: km ? 'kilometer' : 'meter',
		maximumFractionDigits: km ? 1 : 0
	}).format(km ? meters / 1000 : Math.round(meters / 10) * 10);
}
