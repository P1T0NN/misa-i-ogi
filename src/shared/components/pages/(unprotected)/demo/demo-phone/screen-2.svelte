<script lang="ts">
	let { layerClass, scanBarPct }: { layerClass: string; scanBarPct: number } = $props();
</script>

<div
	class="absolute inset-0 flex flex-col bg-(--dark) text-(--ivory) transition-opacity duration-300 ease-out {layerClass}"
>
	<div
		class="type-phone-status-bar flex items-center justify-between px-7 pt-4 pb-1.5 text-(--ivory)"
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
	<div class="flex flex-1 flex-col pt-14">
		<div
			class="flex items-center justify-between px-6 py-4 font-mono text-xs tracking-caps-wide text-(--silver) uppercase"
		>
			<span>Camera</span>
			<span>QR · Mode</span>
		</div>
		<div class="relative flex flex-1 place-items-center p-6">
			<div class="relative z-1 size-52 rounded-2xl border-2 border-primary">
				<span
					class="absolute -top-1 -left-1 size-7 rounded-tl-xl border-t-4 border-l-4 border-primary"
				></span>
				<span
					class="absolute -top-1 -right-1 size-7 rounded-tr-xl border-t-4 border-r-4 border-primary"
				></span>
				<span
					class="absolute -bottom-1 -left-1 size-7 rounded-bl-xl border-b-4 border-l-4 border-primary"
				></span>
				<span
					class="absolute -right-1 -bottom-1 size-7 rounded-br-xl border-r-4 border-b-4 border-primary"
				></span>
			</div>
			<div
				class="demo-scan-line shadow-accent-glow absolute inset-x-4 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent"
			></div>
		</div>
		<p class="px-6 pb-6 text-center text-sm text-(--silver)">Hold the camera steady on the card.</p>
		<div class="mx-6 mb-6 h-1 overflow-hidden rounded-sm bg-white/10">
			<div
				class="linear h-full rounded-sm bg-primary transition-all duration-300"
				style="width: {scanBarPct}%"
			></div>
		</div>
	</div>
</div>

<style>
	@keyframes demo-scan-line {
		0%,
		100% {
			top: 20%;
			opacity: 0.4;
		}
		50% {
			top: 75%;
			opacity: 1;
		}
	}
	.demo-scan-line {
		animation: demo-scan-line 1.6s ease-in-out infinite;
	}
</style>
