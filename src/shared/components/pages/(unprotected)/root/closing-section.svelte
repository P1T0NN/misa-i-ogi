<script lang="ts">
	// CONFIG
	import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/constants';

	// COMPONENTS
	import { Button, buttonVariants } from '@/shared/components/ui/button/index.js';
	import Link from '@/shared/components/ui/link/link.svelte';
	import Section from '@/shared/components/ui/section/section.svelte';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	// LUCIDE ICONS
	import { ArrowRight, ExternalLink } from '@lucide/svelte';
</script>

<Section yPadding="xl" class="bg-background">
	<div class="mx-auto max-w-4xl text-center">
		<p class="font-mono text-xs tracking-eyebrow text-primary uppercase">
			Bring your place into the network
		</p>
		<h2 class="mt-4 font-display text-4xl leading-tight font-medium text-foreground sm:text-5xl">
			Ready to connect stays, guests, and local hospitality?
		</h2>
		<p class="lead mx-auto mt-4">
			Tell us what you run and where you operate. We will help shape the right entry point,
			whether you want to register a stay, partner a venue, or build both sides of the network.
		</p>

		<div class="mt-9 flex flex-wrap justify-center gap-3">
			<a
				href="#contact"
				class={cn(
					buttonVariants({ size: 'lg' }),
					'h-11 gap-2 bg-primary px-5 text-button text-primary-foreground no-underline hover:bg-primary/90 hover:no-underline'
				)}
			>
				Contact us
				<ArrowRight data-icon="inline-end" class="size-4" aria-hidden="true" />
			</a>

			<Button
				href={UNPROTECTED_PAGE_ENDPOINTS.SIGNUP}
				variant="outline"
				size="lg"
				class="h-11 px-5 text-button"
			>
				Register free
			</Button>

			<Button
				href={UNPROTECTED_PAGE_ENDPOINTS.DEMO}
				variant="ghost"
				size="lg"
				class="h-11 gap-2 px-4 text-button"
			>
				View guest demo
				<ExternalLink data-icon="inline-end" class="size-4" aria-hidden="true" />
			</Button>
		</div>

		<p class="mt-8 text-sm text-muted-foreground">
			Already a partner?
			<Link
				href={UNPROTECTED_PAGE_ENDPOINTS.LOGIN}
				class="font-medium text-primary underline-offset-4 hover:underline"
			>
				Sign in
			</Link>
		</p>
	</div>
</Section>
