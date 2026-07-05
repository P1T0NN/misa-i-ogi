<script lang="ts">
	// SVELTEKIT IMPORTS
	import { page } from '$app/state';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints';

	// COMPONENTS
	import { ErrorComponent } from '@/shared/components/ui/error-component/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';

	const isNotFound = $derived(page.status === 404);
	const title = $derived(isNotFound ? m['ErrorPage.notFoundTitle']() : m['ErrorPage.errorTitle']());
	const description = $derived(
		isNotFound ? m['ErrorPage.notFoundDescription']() : m['ErrorPage.errorDescription']()
	);
</script>

<svelte:head>
	<title>{page.status} · {title}</title>
</svelte:head>

<div class="flex min-h-[60vh] items-center justify-center p-6">
	<ErrorComponent
		{title}
		{description}
		variant="plain"
		showRetry={!isNotFound}
		class="w-full max-w-md"
	>
		<Button variant={isNotFound ? 'default' : 'outline'} href={UNPROTECTED_PAGE_ENDPOINTS.ROOT}>
			{m['ErrorPage.backHome']()}
		</Button>
	</ErrorComponent>
</div>
