import { PARTNERSHIP_BENEFIT_MAX_LENGTH } from '@/shared/config.js';

/** Trim + length gate. Returns null when invalid. */
export function parsePartnershipBenefit(input: string): string | null {
	const benefit = input.trim();
	if (benefit.length === 0 || benefit.length > PARTNERSHIP_BENEFIT_MAX_LENGTH) return null;
	return benefit;
}
