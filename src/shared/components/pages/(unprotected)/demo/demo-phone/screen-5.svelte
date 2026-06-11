<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags -- {@html} fragments are static strings from demo-data.ts, not user input. */
	import { ChevronLeft } from '@lucide/svelte';
	import { cn } from '@/shared/utils/utils';
	import type { DemoVenue } from '@/shared/data/demoData';

	const DETAIL_KV: readonly { k: string; v: string }[] = [
		{ k: 'Open', v: '12:00 – 23:00' },
		{ k: 'Walking time', v: '4 min' },
		{ k: 'Phone', v: '+381 11 ··· ····' },
		{ k: 'Valid for', v: 'Length of stay' }
	];

	let {
		layerClass,
		venue,
		onGoTo
	}: {
		layerClass: string;
		venue: DemoVenue;
		onGoTo: (step: number) => void;
	} = $props();
</script>

<div
	class="absolute inset-0 flex flex-col bg-(--surface-2) transition-opacity duration-300 ease-out {layerClass}"
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
	<div class="flex items-center gap-3 border-b border-(--border-2) bg-(--surface-2) px-5 py-3.5">
		<button
			type="button"
			class="grid size-8 shrink-0 place-items-center rounded-lg border border-(--border-2) bg-card text-foreground"
			aria-label="Back"
			onclick={() => onGoTo(4)}
		>
			<ChevronLeft class="size-3.5" stroke-width="2" />
		</button>
		<h3
			class="m-0 font-mono text-xs font-medium tracking-caps-wide text-muted-foreground uppercase"
		>
			{venue.catCrumb}
		</h3>
	</div>
	<div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
		<div
			class="border-b border-(--border-2) bg-linear-to-br from-accent to-(--surface-2) px-6 pt-5 pb-6"
		>
			<p class="mb-2 font-mono text-xs tracking-widest text-primary uppercase">{venue.catLine}</p>
			<h2 class="mb-2 font-display text-phone-title leading-tight font-medium text-foreground">
				{venue.name}
			</h2>
			<p class="m-0 text-sm text-muted-foreground">{venue.loc}</p>
			<div
				class="mt-5 flex items-center justify-between rounded-xl border border-(--border-2) bg-(--surface-2) p-4"
			>
				<span class="font-display text-4xl leading-none font-medium tracking-tight text-primary"
					>{@html venue.pctHtml}</span
				>
				<div class="text-right font-mono text-xs tracking-caps text-muted-foreground uppercase">
					Off your bill<br />Length of stay
				</div>
			</div>
		</div>
		<div class="flex-1 px-6 py-5">
			<p class="mb-4 text-sm leading-relaxed text-muted-foreground">{venue.desc}</p>
			<div class="my-4">
				{#each DETAIL_KV as row, i (row.k)}
					<div
						class={cn(
							'flex justify-between py-2.5 text-xs',
							i > 0 && 'border-t border-(--border-2)'
						)}
					>
						<span class="text-muted-foreground">{row.k}</span>
						<span class="font-mono text-foreground">{row.v}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="border-t border-(--border-2) bg-(--surface-2) px-5 pt-4 pb-6">
		<button
			type="button"
			class="w-full rounded-xl border-0 bg-primary py-3.5 text-button font-medium text-primary-foreground"
			onclick={() => onGoTo(6)}>Use my perk now</button
		>
	</div>
</div>
