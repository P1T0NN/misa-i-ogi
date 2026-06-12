<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import HeroSection from '@/shared/components/pages/(unprotected)/root/hero-section.svelte';
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
</script>

<SvelteHead
	title={m['HomePage.SEO.title']()}
	description={m['HomePage.SEO.description']()}
/>

<HeroSection />
