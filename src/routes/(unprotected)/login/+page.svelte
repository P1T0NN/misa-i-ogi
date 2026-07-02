<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import LoginFormNoImage from '@/features/auth/components/login-form/login-form-no-image.svelte';
	import LoginFormWithImage from '@/features/auth/components/login-form/login-form-with-image.svelte';
	import Logo from '@/shared/components/ui/logo/logo.svelte';
</script>

<SvelteHead title={m['LoginPage.SEO.title']()} description={m['LoginPage.SEO.description']()} />

<div class="flex h-screen w-full items-center justify-center px-4 lg:hidden">
	<LoginFormNoImage />
</div>

<div class="hidden min-h-svh lg:grid lg:grid-cols-2">
	<div class="flex flex-col gap-4 p-6 md:p-10">
		<div class="flex justify-center gap-2 md:justify-start">
			<Logo href={UNPROTECTED_PAGE_ENDPOINTS.ROOT} size="sm" withText />
		</div>

		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-xs">
				<LoginFormWithImage />
			</div>
		</div>
	</div>

	<div class="relative hidden bg-muted lg:block">
		<img
			src="/images/login/login-signup-image.png"
			alt="placeholder"
			class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</div>
</div>
