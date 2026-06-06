<script lang="ts">
	// COMPONENTS
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '@/shared/components/ui/table/index.js';

	// TYPES
	import type { DummyUserAnalyticsPerformanceRow } from '@/shared/data/dummyAnalyticsData';

	let {
		rows,
		nameColumnLabel
	}: {
		rows: DummyUserAnalyticsPerformanceRow[];
		nameColumnLabel: string;
	} = $props();

	function formatType(value: string) {
		return value.replaceAll('_', ' ');
	}
</script>

<Table>
	<TableHeader>
		<TableRow>
			<TableHead>{nameColumnLabel}</TableHead>
			<TableHead>Views</TableHead>
			<TableHead>Requests</TableHead>
			<TableHead>Confirmed</TableHead>
			<TableHead>Conversion</TableHead>
		</TableRow>
	</TableHeader>
	<TableBody>
		{#each rows as row (row.id)}
			<TableRow>
				<TableCell>
					<div class="min-w-52">
						<p class="font-medium">{row.name}</p>
						<p class="mt-1 text-xs text-muted-foreground">
							{formatType(row.type)} in {row.city}
						</p>
					</div>
				</TableCell>
				<TableCell>{row.views}</TableCell>
				<TableCell>{row.requests}</TableCell>
				<TableCell>{row.confirmed}</TableCell>
				<TableCell>{row.conversionRate}</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
