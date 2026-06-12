<script lang="ts" module>
	// TYPES
	import type { Component } from 'svelte';
	import type { UserDashboardStatKey } from '@/convex/pages/userDashboard/types/userDashboardTypes.js';

	type DashboardIcon = Component<{ class?: string }>;

	export type DashboardStatKey = UserDashboardStatKey;
	export type DashboardIconByKey = Record<UserDashboardStatKey, DashboardIcon>;
	export type DashboardStat = {
		id: UserDashboardStatKey;
		label: string;
		value: string;
	};
</script>

<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { api } from '@/convex/_generated/api';
	import { useQuery } from 'convex-svelte';

	// COMPONENTS
	import DashboardStatsItem from './dashboard-stats-item.svelte';
	import DashboardStatsLoading from '../loading/dashboard-stats-loading.svelte';
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';

	// UTILS
	import { formatAnalyticsCount } from '@/features/analytics/utils/analyticsDisplayFormattersUtils';

	// TYPES
	import type { UserDashboardCounts } from '@/convex/pages/userDashboard/types/userDashboardTypes';

	// LUCIDE ICONS
	import Link2Icon from '@lucide/svelte/icons/link-2';
	import BedDoubleIcon from '@lucide/svelte/icons/bed-double';
	import StoreIcon from '@lucide/svelte/icons/store';
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';

	const iconByKey: DashboardIconByKey = {
		accommodations: BedDoubleIcon,
		hospitalities: StoreIcon,
		partnerships: Link2Icon,
		pendingReservations: CalendarCheckIcon
	};

	const statsQuery = useQuery(
		api.pages.userDashboard.queries.fetchUserDashboardStats.fetchUserDashboardStats,
		() => ({})
	);

	const isLoading = $derived(statsQuery.data === undefined && !statsQuery.error);
	const hasError = $derived(Boolean(statsQuery.error));
	const counts = $derived(statsQuery.data as UserDashboardCounts | undefined);

	const metrics = $derived<DashboardStat[]>(
		counts
			? [
					{
						id: 'accommodations',
						label: m['DashboardPage.DashboardStats.accommodations'](),
						value: formatAnalyticsCount(counts.accommodations)
					},
					{
						id: 'hospitalities',
						label: m['DashboardPage.DashboardStats.hospitalities'](),
						value: formatAnalyticsCount(counts.hospitalities)
					},
					{
						id: 'partnerships',
						label: m['DashboardPage.DashboardStats.partnerships'](),
						value: formatAnalyticsCount(counts.partnerships)
					},
					{
						id: 'pendingReservations',
						label: m['DashboardPage.DashboardStats.pendingReservations'](),
						value: formatAnalyticsCount(counts.pendingReservations)
					}
				]
			: []
	);
</script>

{#if isLoading}
	<DashboardStatsLoading />
{:else if hasError}
	<ErrorComponent
		variant="plain"
		title={m['DashboardPage.DashboardStatsError.title']()}
		description={m['DashboardPage.DashboardStatsError.description']()}
	/>
{:else}
	<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
		{#each metrics as metric (metric.id)}
			<DashboardStatsItem {metric} icon={iconByKey[metric.id as UserDashboardStatKey]} />
		{/each}
	</div>
{/if}
