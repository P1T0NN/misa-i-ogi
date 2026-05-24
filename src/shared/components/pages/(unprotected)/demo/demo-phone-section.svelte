<script lang="ts">
    // COMPONENTS
	import Section from '@/shared/components/ui/section/section.svelte';
	import DemoPhone from './demo-phone/demo-phone.svelte';
	import DemoPhoneSidePanel from './demo-phone-side-panel.svelte';

    // RUNES
	import { demoShell } from '../../../../../routes/(unprotected)/demo/demoPage.svelte.ts';

    // TYPES
	import type { DemoPageModel } from '../../../../../routes/(unprotected)/demo/demoPage.svelte.ts';

	let { demo }: { demo: DemoPageModel } = $props();
</script>

<Section
	contain={false}
	yPadding="none"
	class="border-t border-border pt-0 pb-12 sm:pb-16 lg:pb-(--gap-2xl)"
	containerClass={demoShell}
>
	<div
		class="grid grid-cols-1 items-center gap-12 py-12 lg:grid-cols-2 lg:gap-(--gap-2xl) lg:py-16"
	>
		<DemoPhone {demo} />

		<div>
			<DemoPhoneSidePanel {demo} />
		</div>
	</div>
</Section>
