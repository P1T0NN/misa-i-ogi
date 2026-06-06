<script lang="ts" module>
	// TYPES
	import type { Component } from 'svelte';
	import type { UserDashboardStatKey } from '@/convex/pages/userDashboard/types/userDashboardTypes.js';

	type DashboardIcon = Component<{ class?: string }>;
</script>

<script lang="ts">
	// COMPONENTS
	import Card from '@/shared/components/ui/card/card.svelte';
	import CardContent from '@/shared/components/ui/card/card-content.svelte';

	// LUCIDE ICONS
	import Link2Icon from '@lucide/svelte/icons/link-2';
	import BedDoubleIcon from '@lucide/svelte/icons/bed-double';
	import StoreIcon from '@lucide/svelte/icons/store';
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';

	const fallbackStats = [
		{ key: 'stays' as const, label: 'Stays', value: '0', detail: '0 active accommodations' },
		{ key: 'venues' as const, label: 'Venues', value: '0', detail: '0 active venues' },
		{
			key: 'activeLinks' as const,
			label: 'Active links',
			value: '0',
			detail: 'Current stay to venue partnerships'
		},
		{
			key: 'pendingReservations' as const,
			label: 'Pending',
			value: '0',
			detail: 'Reservation requests to review'
		}
	];

	const iconByKey: Record<UserDashboardStatKey, DashboardIcon> = {
		stays: BedDoubleIcon,
		venues: StoreIcon,
		activeLinks: Link2Icon,
		pendingReservations: CalendarCheckIcon
	};
</script>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
	{#each fallbackStats as stat (stat.key)}
		{@const Icon = iconByKey[stat.key]}
		<Card class="py-0">
			<CardContent class="flex items-start justify-between gap-4 p-4">
				<div class="min-w-0">
					<p class="text-xs font-medium text-muted-foreground">{stat.label}</p>
					<p class="mt-2 text-2xl font-semibold">{stat.value}</p>
					<p class="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.detail}</p>
				</div>
				<span class="rounded-md border border-border bg-muted p-2 text-muted-foreground">
					<Icon class="size-4" />
				</span>
			</CardContent>
		</Card>
	{/each}
</div>
