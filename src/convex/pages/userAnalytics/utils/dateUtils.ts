export const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfUtcDay(timestamp: number) {
	const date = new Date(timestamp);
	return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}
