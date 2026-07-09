export type AdminDashboardTotals = {
	users: number;
	accommodations: number;
	hospitalities: number;
	partnerships: number;
	guests: number;
};

export type AdminDashboardPageResult = {
	totals: AdminDashboardTotals;
};
