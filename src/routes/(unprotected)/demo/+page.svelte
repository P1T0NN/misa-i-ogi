<script lang="ts">
	// SVELTEKIT IMPORTS
	import { onMount } from 'svelte';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';

	// RUNES
	import { createDemoPage } from './demoPage.svelte.ts';
	import DemoPhoneSection from '@/shared/components/pages/(unprotected)/demo/demo-phone-section.svelte';

	const demo = createDemoPage();

	onMount(demo.mountKeyboard);
</script>

<SvelteHead
	title={m['DemoPage.SEO.title']()}
	description={m['DemoPage.SEO.description']()}
/>

<main id="content">
	<DemoPhoneSection {demo} />
</main>
