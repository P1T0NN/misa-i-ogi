export function getAnalyticsMetricValue(totals: Map<string, number>, id: string) {
	return totals.get(id) ?? 0;
}
