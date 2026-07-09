<script lang="ts">
	// SVELTEKIT IMPORTS
	import { browser } from '$app/environment';

	// COMPONENTS
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';

	// TYPES
	import type { ComponentProps } from 'svelte';
	import type AreaChartInteractive from '@/shared/components/ui/custom-charts/area-chart-interactive.svelte';

	type Props = ComponentProps<typeof AreaChartInteractive>;

	let props: Props = $props();

	const chartImport = browser
		? import('@/shared/components/ui/custom-charts/area-chart-interactive.svelte')
		: null;
</script>

{#if chartImport}
	{#await chartImport then { default: Chart }}
		<Chart {...props} />
	{:catch}
		<div class={props.cardClass ?? 'overflow-hidden rounded-2xl border border-border bg-card py-0'}>
			<div class={props.cardHeaderClass ?? 'border-b border-border px-4 py-4'}>
				<Skeleton class="h-5 w-40" />
				<Skeleton class="mt-2 h-4 w-56 max-w-full" />
			</div>
			<div class={props.cardContentClass ?? 'px-4 py-4'}>
				<Skeleton class={props.containerClass ?? 'aspect-auto h-60 w-full'} />
			</div>
		</div>
	{/await}
{:else}
	<div class={props.cardClass ?? 'overflow-hidden rounded-2xl border border-border bg-card py-0'}>
		<div class={props.cardHeaderClass ?? 'border-b border-border px-4 py-4'}>
			<Skeleton class="h-5 w-40" />
			<Skeleton class="mt-2 h-4 w-56 max-w-full" />
		</div>
		<div class={props.cardContentClass ?? 'px-4 py-4'}>
			<Skeleton class={props.containerClass ?? 'aspect-auto h-60 w-full'} />
		</div>
	</div>
{/if}
