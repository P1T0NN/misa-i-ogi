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

<section class="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">
	<PartnershipsHeader />

	<PartnershipsTabs />
</section>
