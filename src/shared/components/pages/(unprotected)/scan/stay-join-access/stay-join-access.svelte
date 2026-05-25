<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import StayJoinAccessForm from '@/shared/components/pages/(unprotected)/scan/stay-join-access/stay-join-access-form.svelte';

	let {
		activeScan = false
	}: {
		/** When true, shows the "already active on another device" variant. */
		activeScan?: boolean;
	} = $props();
</script>

<div class="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
	<header class="flex flex-col gap-3">
		<h1
			class="font-serif text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-4xl"
		>
			{m['ScanPage.eyebrow']()}
		</h1>
	</header>
	
	<StayJoinAccessForm {activeScan} />
</div>
