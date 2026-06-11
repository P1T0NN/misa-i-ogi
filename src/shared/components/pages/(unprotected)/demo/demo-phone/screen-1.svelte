<script lang="ts">
	// CONFIG
	import { COMPANY_DATA } from '@/shared/constants';

	// LUCIDE ICONS
	import { ScanLine } from '@lucide/svelte';

	let { layerClass, onGoTo }: { layerClass: string; onGoTo: (step: number) => void } = $props();

	const initial = COMPANY_DATA.NAME.trim().charAt(0).toUpperCase() || '?';
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

	<div class="flex flex-1 flex-col justify-between px-7 pt-14 pb-10">
		<div
			class="grid size-14 place-items-center rounded-xl bg-primary font-display text-phone-title font-medium text-primary-foreground"
		>
			{initial}
		</div>

		<div class="flex flex-1 flex-col justify-center py-8">
			<p class="mb-2.5 font-mono text-xs tracking-widest text-primary uppercase">Stay #DOR-014</p>

			<h2
				class="mb-3 font-display text-phone-headline leading-tight font-medium tracking-tight text-foreground"
			>
				Welcome to Solunska 22.
			</h2>

			<p class="text-button leading-relaxed text-muted-foreground">
				You're staying at a {COMPANY_DATA.NAME} apartment. The whole neighborhood has been waiting for
				you — scan the card by the door to see what's open and waiting.
			</p>
		</div>

		<button
			type="button"
			class="flex w-full items-center justify-center gap-2.5 rounded-xl border-0 bg-primary py-4 text-base font-medium text-primary-foreground"
			onclick={() => onGoTo(2)}
		>
			<ScanLine class="size-5" stroke-width="2" />
			<span>Open camera to scan</span>
		</button>
	</div>
</div>
