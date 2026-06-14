<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags -- {@html} fragments are static strings from demo-data.ts, not user input. */
	import { Bath, ChevronLeft, Clock, Coffee, MapPin, UtensilsCrossed, Wine } from '@lucide/svelte';
	import { cn } from '@/shared/utils/utils';
	import {
		DEMO_LIST_FILTERS,
		DEMO_VENUE_ORDER,
		DEMO_VENUES,
		type DemoVenueFilter,
		type DemoVenueKey,
		demoVenueMatchesFilter
	} from '@/shared/data/demoData';

	const ICONS: Record<DemoVenueKey, typeof UtensilsCrossed> = {
		skadarlija: UtensilsCrossed,
		cetinjska: Coffee,
		kalemegdan: MapPin,
		savamala: Wine,
		bakery: Clock,
		hammam: Bath
	};

	let {
		layerClass,
		redeemed,
		onGoTo,
		onOpenDetail
	}: {
		layerClass: string;
		redeemed: Partial<Record<DemoVenueKey, boolean>>;
		onGoTo: (step: number) => void;
		onOpenDetail: (key: DemoVenueKey) => void;
	} = $props();

	let listFilter = $state<DemoVenueFilter>('all');
</script>

<div
	class="absolute inset-0 flex flex-col overflow-hidden bg-background transition-opacity duration-300 ease-out {layerClass}"
>
	<div
		class="type-phone-status-bar flex items-center justify-between px-7 pt-4 pb-1.5 text-foreground"
	>
		<span>9:41</span>
		<div class="flex items-center gap-1.5">
			<svg width="14" height="10" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true"
				><circle cx="3" cy="9" r="1.5" /><circle cx="7" cy="7" r="1.5" /><circle
					cx="11"
					cy="5"
					r="1.5"
				/><circle cx="15" cy="3" r="1.5" /></svg
			>
			<span class="text-xs">5G</span>
			<div
				class="relative h-3 w-5 rounded border border-current p-px after:absolute after:top-1 after:-right-0.5 after:h-1.5 after:w-0.5 after:rounded-tr-sm after:rounded-br-sm after:bg-current"
			>
				<span class="block h-full w-4/5 rounded-sm bg-current"></span>
			</div>
		</div>
	</div>
	<div
		class="bg-app-bar-blur relative z-2 border-b border-border-2 px-5 pt-3.5 pb-3 backdrop-blur-xl"
	>
		<div class="mb-3 flex items-center gap-3">
			<button
				type="button"
				class="grid size-8 shrink-0 place-items-center rounded-lg border border-border-2 bg-card text-foreground"
				aria-label="Back"
				onclick={() => onGoTo(3)}
			>
				<ChevronLeft class="size-3.5" stroke-width="2" />
			</button>
			<div class="min-w-0 flex-1">
				<p class="font-display text-lg font-medium text-foreground">Dorćol perks</p>
				<p class="mt-0.5 font-mono text-xs tracking-caps text-muted-foreground uppercase">
					22 venues · Sun 14:00 left
				</p>
			</div>
		</div>
		<div class="-mx-5 flex gap-1.5 overflow-x-auto px-5">
			{#each DEMO_LIST_FILTERS as f (f.id)}
				<button
					type="button"
					class={cn(
						'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
						listFilter === f.id
							? 'border-foreground bg-foreground text-ivory'
							: 'border-border-2 bg-card text-muted-foreground'
					)}
					onclick={(e) => {
						e.stopPropagation();
						listFilter = f.id;
					}}
				>
					{f.label}
				</button>
			{/each}
		</div>
	</div>
	<div class="min-h-0 flex-1 overflow-y-auto px-5 py-3 pb-8">
		{#each DEMO_VENUE_ORDER as key (key)}
			{@const venue = DEMO_VENUES[key]}
			{@const Icon = ICONS[key]}
			{#if demoVenueMatchesFilter(venue, listFilter)}
				<button
					type="button"
					class="grid-phone-list-row grid w-full items-center gap-3 border-b border-border-2 py-3 text-left last:border-b-0"
					class:opacity-50={redeemed[key]}
					onclick={() => onOpenDetail(key)}
				>
					<div class="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
						<Icon class="size-5" stroke-width="1.7" />
					</div>
					<div class="min-w-0">
						<p class="mb-0.5 font-display text-sm font-medium text-foreground">{venue.name}</p>
						<p class="font-mono text-xs tracking-caps-tight text-muted-foreground uppercase">
							{venue.listMeta}
						</p>
					</div>
					{#if redeemed[key]}
						<span class="font-mono text-sm text-success">✓</span>
					{:else}
						<span class="font-display text-lg font-medium tracking-tight text-primary"
							>{@html venue.listDiscHtml}</span
						>
					{/if}
				</button>
			{/if}
		{/each}
	</div>
</div>
