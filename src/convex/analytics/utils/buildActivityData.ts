type AnalyticsTimeSeriesPoint = Record<string, number>;

export function buildActivityData(args: {
	qrScansSeries: AnalyticsTimeSeriesPoint[];
	guestActivationsSeries: AnalyticsTimeSeriesPoint[];
	reservationsSeries: AnalyticsTimeSeriesPoint[];
}): { date: number; qrScans: number; guestActivations: number; reservations: number }[] {
	const qrScansByDate = new Map(
		args.qrScansSeries.map((point) => [point.date, point.qrScans ?? 0])
	);
	const activationsByDate = new Map(
		args.guestActivationsSeries.map((point) => [point.date, point.guestActivations ?? 0])
	);
	const reservationsByDate = new Map(
		args.reservationsSeries.map((point) => [point.date, point.newReservations ?? 0])
	);

	const dates = [...qrScansByDate.keys()].sort((first, second) => first - second);

	return dates.map((date) => ({
		date,
		qrScans: qrScansByDate.get(date) ?? 0,
		guestActivations: activationsByDate.get(date) ?? 0,
		reservations: reservationsByDate.get(date) ?? 0
	}));
}
