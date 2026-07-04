<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import CreateCustomPartnershipHeader from '@/shared/components/pages/(protected)/create-custom-partnership/create-custom-partnership-header.svelte';
	import CreateCustomPartnershipForm from '@/shared/components/pages/(protected)/create-custom-partnership/create-custom-partnership-form.svelte';
</script>

<SvelteHead
	title={m['CreateCustomPartnershipPage.SEO.title']()}
	description={m['CreateCustomPartnershipPage.SEO.description']()}
/>

<section class="flex w-full justify-center px-4 py-6 md:px-6 md:py-8">
	<div class="flex w-full max-w-3xl flex-col gap-6">
		<CreateCustomPartnershipHeader />

		<CreateCustomPartnershipForm />
	</div>
</section>
