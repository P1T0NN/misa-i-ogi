<script lang="ts" module>
	// TYPES
	import type { Component } from 'svelte';
	import type {
		UserDashboardStat,
		UserDashboardStatKey
	} from '@/convex/pages/userDashboard/types/userDashboardTypes.js';

	type DashboardIcon = Component<{ class?: string }>;

	export interface DashboardStat extends UserDashboardStat {
		label: string;
		value: string;
		detail: string;
		icon: DashboardIcon;
	}
</script>

<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import DashboardStatsItem from './dashboard-stats-item.svelte';
	import DashboardStatsLoading from '../loading/dashboard-stats-loading.svelte';
	import DashboardStatsError from '../error/dashboard-stats-error.svelte';

	// LUCIDE ICONS
	import Link2Icon from '@lucide/svelte/icons/link-2';
	import BedDoubleIcon from '@lucide/svelte/icons/bed-double';
	import StoreIcon from '@lucide/svelte/icons/store';
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';

	const iconByKey: Record<UserDashboardStatKey, DashboardIcon> = {
		stays: BedDoubleIcon,
		venues: StoreIcon,
		activeLinks: Link2Icon,
		pendingReservations: CalendarCheckIcon
	};

	const statsQuery = useQuery(
		api.pages.userDashboard.queries.fetchUserDashboardStats.fetchUserDashboardStats,
		() => ({})
	);

	const isLoading = $derived(statsQuery.data === undefined && !statsQuery.error);
	const hasError = $derived(Boolean(statsQuery.error));
	const stats = $derived((statsQuery.data ?? []) as UserDashboardStat[]);

	const displayStats = $derived(
		stats.map((stat): DashboardStat => ({
			...stat,
			icon: iconByKey[stat.key]
		}))
	);
</script>

{#if isLoading}
	<DashboardStatsLoading />
{:else if hasError}
	<DashboardStatsError />
{:else}
	<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
		{#each displayStats as stat (stat.key)}
			<DashboardStatsItem {stat} />
		{/each}
	</div>
{/if}
