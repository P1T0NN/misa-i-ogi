<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import PartnershipsHeader from '@/shared/components/pages/(protected)/partnerships/partnerships-header.svelte';
	import PartnershipsTabs from '@/shared/components/pages/(protected)/partnerships/partnerships-tabs/partnerships-tabs.svelte';
</script>

<SvelteHead
	title={m['PartnershipsPage.SEO.title']()}
	description={m['PartnershipsPage.SEO.description']()}
/>

<section class="flex w-full flex-col gap-6 py-4 md:py-6 lg:gap-8">
	<PartnershipsHeader />

	<PartnershipsTabs />
</section>
