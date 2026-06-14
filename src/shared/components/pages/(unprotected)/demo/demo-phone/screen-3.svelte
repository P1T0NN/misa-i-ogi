<script lang="ts">
	let { layerClass, onGoTo }: { layerClass: string; onGoTo: (step: number) => void } = $props();
</script>

<div
	class="absolute inset-0 flex flex-col bg-surface-2 transition-opacity duration-300 ease-out {layerClass}"
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
	<div class="flex flex-1 flex-col px-7 pt-14 pb-8">
		<div
			class="border-accent-muted mb-6 flex items-center gap-3 rounded-xl border bg-accent px-4 py-3.5"
		>
			<div
				class="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-4"
					aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg
				>
			</div>
			<div class="min-w-0 text-sm leading-snug">
				<strong class="mb-0.5 block font-medium text-foreground">Card scanned.</strong>
				<span class="text-xs text-muted-foreground">DOR-014 · Solunska 22, Apt 3</span>
			</div>
		</div>
		<p class="mb-2 font-mono text-xs tracking-widest text-primary uppercase">Your stay · Dorćol</p>
		<h2 class="mb-1.5 font-display text-phone-title leading-tight font-medium text-foreground">
			Belgrade's been expecting you.
		</h2>
		<p class="mb-5 text-sm text-muted-foreground">Active until Sunday, 19 May at 14:00.</p>
		<div class="mb-6 grid grid-cols-3 gap-2">
			<div class="rounded-lg border border-border-2 bg-card p-3 text-center">
				<div class="font-display text-phone-stat font-medium text-primary">22</div>
				<div class="mt-1.5 font-mono text-xs tracking-caps text-muted-foreground uppercase">
					Venues
				</div>
			</div>
			<div class="rounded-lg border border-border-2 bg-card p-3 text-center">
				<div class="font-display text-phone-stat font-medium text-primary">9</div>
				<div class="mt-1.5 font-mono text-xs tracking-caps text-muted-foreground uppercase">
					Categories
				</div>
			</div>
			<div class="rounded-lg border border-border-2 bg-card p-3 text-center">
				<div class="font-display text-phone-stat font-medium text-primary">7m</div>
				<div class="mt-1.5 font-mono text-xs tracking-caps text-muted-foreground uppercase">
					Median walk
				</div>
			</div>
		</div>
		<div class="mt-auto flex flex-col gap-1.5">
			<button
				type="button"
				class="w-full rounded-xl border-0 bg-primary py-3.5 text-button font-medium text-primary-foreground"
				onclick={() => onGoTo(4)}>Show me the list</button
			>
			<button
				type="button"
				class="w-full border-0 bg-transparent py-3 text-sm text-muted-foreground"
				onclick={() => onGoTo(1)}>Start over</button
			>
		</div>
	</div>
</div>
