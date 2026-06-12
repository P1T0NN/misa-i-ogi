<script lang="ts">
	// SVELTEKIT IMPORTS
	import { enhance } from '$app/forms';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import { Button } from '@/shared/components/ui/button/index.js';
	import { Spinner } from '@/shared/components/ui/spinner/index.js';

	let formElement = $state<HTMLFormElement>();
	let isSubmitting = $state(false);

	// Auto-activate on a real visit. Bots and prefetches only GET this page, so the
	// guest session is created exclusively by this POST (see +page.server.ts).
	$effect(() => {
		formElement?.requestSubmit();
	});
</script>

<SvelteHead
	title={m['ActivatePage.SEO.title']()}
	description={m['ActivatePage.SEO.description']()}
	noindex
/>

<div class="flex min-h-svh flex-col items-center justify-center gap-5 px-4 text-center">
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold tracking-tight">{m['ActivatePage.title']()}</h1>
		<p class="max-w-sm text-sm text-muted-foreground">{m['ActivatePage.description']()}</p>
	</div>

	<form
		method="POST"
		bind:this={formElement}
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}}
	>
		{#if isSubmitting}
			<p
				class="flex items-center justify-center gap-2 text-sm text-muted-foreground"
				aria-live="polite"
			>
				<Spinner />
				{m['ActivatePage.activating']()}
			</p>
		{:else}
			<Button type="submit" size="lg">{m['ActivatePage.start']()}</Button>
		{/if}
	</form>
</div>
