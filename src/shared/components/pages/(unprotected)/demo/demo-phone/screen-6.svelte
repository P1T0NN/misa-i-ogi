<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags -- {@html} fragments are static strings from demo-data.ts, not user input. */
	import { COMPANY_DATA } from '@/shared/constants';
	import type { DemoVenue } from '@/shared/data/demoData';

	let {
		layerClass,
		venue,
		onGoTo,
		onMarkRedeemed
	}: {
		layerClass: string;
		venue: DemoVenue;
		onGoTo: (step: number) => void;
		onMarkRedeemed: () => void;
	} = $props();
</script>

<div
	class="absolute inset-0 flex flex-col bg-(--dark) text-(--ivory) transition-opacity duration-300 ease-out {layerClass}"
>
	<div class="flex items-center justify-between px-7 pt-4 pb-1.5 type-phone-status-bar text-(--ivory)">
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
				class="relative h-3 w-5 rounded border border-current p-px after:absolute after:-right-0.5 after:top-1 after:h-1.5 after:w-0.5 after:rounded-br-sm after:rounded-tr-sm after:bg-current"
			>
				<span class="block h-full w-4/5 rounded-sm bg-current"></span>
			</div>
		</div>
	</div>
	<div class="flex flex-1 flex-col justify-between gap-6 px-6 pb-8 pt-14">
		<div
			class="overflow-hidden rounded-2xl bg-(--surface-2) text-foreground shadow-phone-float"
		>
			<div class="flex items-center justify-between bg-primary px-5 py-5 text-primary-foreground">
				<span class="font-mono text-xs uppercase tracking-caps-wide opacity-90"
					>{COMPANY_DATA.NAME} perk</span
				>
				<span class="font-display text-lg font-medium">DOR-014</span>
			</div>
			<div class="px-5 pb-5 pt-6">
				<p class="mb-1 font-mono text-xs uppercase tracking-widest text-primary">{venue.vouchCat}</p>
				<h3 class="mb-1.5 font-display text-xl font-medium leading-snug">{venue.name}</h3>
				<p class="mb-4 text-xs text-muted-foreground">{venue.loc}</p>
				<div class="my-1 font-display text-voucher font-medium leading-none tracking-tight text-primary">
					{@html venue.vouchPctHtml}
				</div>
				<p class="mb-4 text-xs text-muted-foreground">{venue.vouchDesc}</p>
				<div class="relative -mx-5 my-5 border-t-2 border-dashed border-(--border-2)">
					<span class="absolute -left-2.5 -top-2.5 size-5 rounded-full bg-(--dark)" aria-hidden="true"
					></span>
					<span class="absolute -right-2.5 -top-2.5 size-5 rounded-full bg-(--dark)" aria-hidden="true"
					></span>
				</div>
				<div class="flex items-center justify-between pt-1">
					<span class="font-mono text-xs uppercase tracking-caps text-muted-foreground"
						>Valid until</span
					>
					<span class="font-mono text-xs tabular-nums text-foreground">SUN 19 MAY · 14:00</span>
				</div>
				<div class="mt-2 flex items-center justify-between">
					<span class="font-mono text-xs uppercase tracking-caps text-muted-foreground">Code</span>
					<span class="font-mono text-xs tabular-nums text-foreground">{venue.code}</span>
				</div>
			</div>
		</div>
		<div
			class="rounded-xl border surface-glass-ivory px-4 py-3.5 text-center"
		>
			<p class="m-0 text-sm leading-relaxed text-(--silver)">
				<strong class="font-medium text-(--ivory)">Show this screen to the staff on arrival.</strong>
				<br />
				They'll tap to confirm, or scan with their counter device.
			</p>
		</div>
		<div class="grid gap-2">
			<button
				type="button"
				class="w-full rounded-xl border-0 bg-(--ivory) py-3.5 text-button font-medium text-(--dark)"
				onclick={onMarkRedeemed}>I redeemed this — back to list</button>
			<button
				type="button"
				class="w-full rounded-xl border border-(--dark-2) bg-transparent py-3 text-sm text-(--silver)"
				onclick={() => onGoTo(5)}>Not yet, take me back</button>
		</div>
	</div>
</div>
