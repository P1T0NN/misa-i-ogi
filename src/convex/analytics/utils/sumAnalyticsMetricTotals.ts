export function sumAnalyticsMetricTotals(totals: Map<string, number>) {
	let total = 0;
	for (const value of totals.values()) total += value;
	return total;
}
