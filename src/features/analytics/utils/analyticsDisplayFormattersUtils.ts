// LIBRARIES
import { computeConversionRatePercent } from '@piton-/analytics-convex';
import { getLocale } from '@/shared/lib/paraglide/runtime';

export function formatAnalyticsCount(value: number) {
	const locale = getLocale();

	return value.toLocaleString(locale);
}

export function formatAnalyticsConversionRate(requests: number, confirmed: number) {
	const ratePercent = computeConversionRatePercent({
		numerator: confirmed,
		denominator: requests
	});

	if (ratePercent === undefined) return '0%';
	return `${Math.round(ratePercent)}%`;
}

export function formatAnalyticsType(value: string) {
	return value.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}
