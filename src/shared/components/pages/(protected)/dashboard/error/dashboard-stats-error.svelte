<script lang="ts">
	// COMPONENTS
	import DashboardStatsItem from '../dashboard-stats/dashboard-stats-item.svelte';

	// TYPES
	import type { DashboardStat } from '../dashboard-stats/dashboard-stats.svelte';
	import type { UserDashboardStatKey } from '@/convex/pages/userDashboard/types/userDashboardTypes.js';
	import type { Component } from 'svelte';

	// LUCIDE ICONS
	import Link2Icon from '@lucide/svelte/icons/link-2';
	import BedDoubleIcon from '@lucide/svelte/icons/bed-double';
	import StoreIcon from '@lucide/svelte/icons/store';
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';

	type DashboardIcon = Component<{ class?: string }>;

	const iconByKey: Record<UserDashboardStatKey, DashboardIcon> = {
		accommodations: BedDoubleIcon,
		hospitalities: StoreIcon,
		partnerships: Link2Icon,
		pendingReservations: CalendarCheckIcon
	};

	const fallbackMetrics: DashboardStat[] = [
		{ id: 'accommodations', label: 'Stays', value: '0' },
		{ id: 'hospitalities', label: 'Venues', value: '0' },
		{ id: 'partnerships', label: 'Active links', value: '0' },
		{ id: 'pendingReservations', label: 'Pending', value: '0' }
	];
</script>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
	{#each fallbackMetrics as metric (metric.id)}
		<DashboardStatsItem {metric} icon={iconByKey[metric.id as UserDashboardStatKey]} />
	{/each}
</div>
