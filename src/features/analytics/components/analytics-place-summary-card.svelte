<script lang="ts">
	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';

	// TYPES
	import type { DummyUserAnalyticsPlaceRow } from '@/shared/data/dummyAnalyticsData';

	// LUCIDE ICONS
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	function formatType(value: string) {
		return value.replaceAll('_', ' ');
	}

	let {
		title,
		description,
		rows
	}: {
		title: string;
		description: string;
		rows: DummyUserAnalyticsPlaceRow[];
	} = $props();
</script>

<Card class="py-0">
	<CardHeader>
		<CardTitle class="text-base">{title}</CardTitle>
		<CardDescription>{description}</CardDescription>
	</CardHeader>
	<CardContent>
		{#each rows as row (row.id)}
			<div class="flex items-start justify-between gap-3 border-b border-border py-3 last:border-b-0">
				<div class="min-w-0">
					<div class="flex flex-wrap items-center gap-2">
						<p class="truncate text-sm font-medium">{row.name}</p>
						{#if row.isActive}
							<Badge variant="success">Active</Badge>
						{:else}
							<Badge variant="secondary">Inactive</Badge>
						{/if}
					</div>
					<p class="mt-1 text-xs text-muted-foreground">
						{formatType(row.type)} in {row.city}
					</p>
					<p class="mt-1 text-xs text-muted-foreground">{row.primaryMetric}</p>
				</div>
				<Button href={row.href} variant="ghost" size="sm">
					Open
					<ArrowRightIcon data-icon="inline-end" />
				</Button>
			</div>
		{/each}
	</CardContent>
</Card>
