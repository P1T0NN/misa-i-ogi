<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import AddHospitalityHeader from '@/shared/components/pages/(protected)/add-hospitality/add-hospitality-header.svelte';
	import AddHospitalityAccessNotice from '@/shared/components/pages/(protected)/add-hospitality/add-hospitality-access-notice.svelte';
	import AddHospitalityVisibilityNotice from '@/shared/components/pages/(protected)/add-hospitality/add-hospitality-visibility-notice.svelte';
	import AddHospitalityForm from '@/shared/components/pages/(protected)/add-hospitality/add-hospitality-form.svelte';

	// UTILS
	import { hasProAccess } from '@/features/auth/utils/hasProAccess';

	// No access yet (or trial over) → the gate card replaces the form entirely;
	// starting the trial flips `access` reactively and the form appears in place.
	const access = $derived(hasProAccess(authClass.currentUser));
</script>

<SvelteHead
	title={m['AddHospitalityPage.SEO.title']()}
	description={m['AddHospitalityPage.SEO.description']()}
/>

<section class="flex w-full justify-center px-4 py-6 md:px-6 md:py-8">
	<div class="flex w-full max-w-3xl flex-col gap-6">
		<AddHospitalityHeader />

		{#if access === 'trial-available' || access === 'trial-expired'}
			<AddHospitalityAccessNotice {access} />
		{:else if access}
			<AddHospitalityVisibilityNotice />

			<AddHospitalityForm />
		{/if}
	</div>
</section>
