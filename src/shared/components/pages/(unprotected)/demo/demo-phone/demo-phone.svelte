<script lang="ts">
	// COMPONENTS
	import PhoneMockup from '@/shared/components/ui/phone-mockup/phone-mockup.svelte';
	import Screen1 from './screen-1.svelte';
	import Screen2 from './screen-2.svelte';
	import Screen3 from './screen-3.svelte';
	import Screen4 from './screen-4.svelte';
	import Screen5 from './screen-5.svelte';
	import Screen6 from './screen-6.svelte';

	// DATA
	import { DEMO_VENUES } from '@/shared/data/demoData';

	// TYPES
	import type { DemoPageModel } from '../../../../../../routes/(unprotected)/demo/demoPage.svelte.ts';

	let { demo }: { demo: DemoPageModel } = $props();

	const v = $derived(DEMO_VENUES[demo.currentVenue]);

	function screenClass(step: number) {
		return demo.currentStep === step
			? 'z-4 opacity-100'
			: 'pointer-events-none z-0 opacity-0';
	}
</script>

<PhoneMockup>
	{#snippet screens()}
		<Screen1 layerClass={screenClass(1)} onGoTo={demo.goTo} />
		<Screen2 layerClass={screenClass(2)} scanBarPct={demo.scanBarPct} />
		<Screen3 layerClass={screenClass(3)} onGoTo={demo.goTo} />
		<Screen4
			layerClass={screenClass(4)}
			redeemed={demo.redeemed}
			onGoTo={demo.goTo}
			onOpenDetail={demo.openDetail}
		/>
		<Screen5 layerClass={screenClass(5)} venue={v} onGoTo={demo.goTo} />
		<Screen6 layerClass={screenClass(6)} venue={v} onGoTo={demo.goTo} onMarkRedeemed={demo.markRedeemed} />
	{/snippet}
</PhoneMockup>
