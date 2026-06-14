<script lang="ts">
	// UTILS
	import { cn } from '@/shared/utils/utils';

	// TYPES
	import type { Snippet } from 'svelte';

	type Props = {
		class?: string;
		/** Classes on the outer stage (centering, padding). */
		stageClass?: string;
		/** Classes merged onto the inner “glass” panel (inside bezel). */
		screenClass?: string;
		/** Show soft radial glow behind the device (DESIGN --accent-soft). */
		showGlow?: boolean;
		/** Optional class on the glow layer. */
		glowClass?: string;
		/** Optional class on the physical frame / bezel shell. */
		chassisClass?: string;
		/**
		 * Content rendered inside the device display (stack “screens” with absolute positioning
		 * or any layout the caller needs).
		 */
		screens: Snippet;
	};

	let {
		class: className,
		stageClass,
		screenClass,
		showGlow = true,
		glowClass,
		chassisClass,
		screens
	}: Props = $props();
</script>

<div class={cn('relative grid place-items-center py-10', stageClass, className)}>
	{#if showGlow}
		<div
			class={cn('phone-mockup-stage-glow pointer-events-none absolute inset-0', glowClass)}
			aria-hidden="true"
		></div>
	{/if}

	<div class={cn('phone-mockup-bezel', chassisClass)}>
		<div class="phone-mockup-home-indicator" aria-hidden="true"></div>

		<div class={cn('phone-mockup-screen', screenClass)}>
			{@render screens()}
		</div>
	</div>
</div>
