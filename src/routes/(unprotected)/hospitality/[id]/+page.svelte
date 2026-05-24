<script lang="ts">
	// LIBRARIES
	import { page } from '$app/state';
	import { useQuery } from 'convex-svelte';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import { buttonVariants } from '@/shared/components/ui/button/index.js';
	import * as Card from '@/shared/components/ui/card/index.js';
	import HospitalityEmpty from '@/shared/components/pages/(unprotected)/hospitality/empty/hospitality-empty.svelte';
	import HospitalityError from '@/shared/components/pages/(unprotected)/hospitality/error/hospitality-error.svelte';
	import HospitalityLoading from '@/shared/components/pages/(unprotected)/hospitality/loading/hospitality-loading.svelte';

	// DATA
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';
	import type { HospitalityDetailsSafe } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	// ICONS
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import MailIcon from '@lucide/svelte/icons/mail';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';

	const rawHospitalityId = $derived(page.params.id);

	const detailQuery = useQuery(
		api.tables.hospitalities.queries.fetchHospitalityDetails.fetchHospitalityDetails,
		() => (rawHospitalityId ? { hospitalityId: rawHospitalityId as Id<'hospitalities'> } : 'skip')
	);

	const hospitality = $derived(detailQuery.data as HospitalityDetailsSafe | null | undefined);
	const isLoading = $derived(hospitality === undefined && !detailQuery.error);

	const websiteHref = $derived.by(() => {
		const raw = hospitality?.website?.trim();
		if (!raw) return null;
		return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
	});

	const telHref = $derived.by(() => {
		const raw = hospitality?.contactPhone?.trim();
		if (!raw) return null;
		return `tel:${raw.replace(/\s+/g, '')}`;
	});

	const mailHref = $derived.by(() => {
		const raw = hospitality?.contactEmail?.trim();
		if (!raw) return null;
		return `mailto:${raw}`;
	});

	const hasReserveChannels = $derived(!!(websiteHref || telHref || mailHref));
</script>

<SvelteHead />

<div class="bg-background text-foreground">
	{#if detailQuery.error}
		<HospitalityError />
	{:else if isLoading}
		<HospitalityLoading />
	{:else if hospitality === null}
		<HospitalityEmpty />
	{:else if hospitality}
		{@const h = hospitality}

		<div class="lg:px-8 lg:pt-6">
			<div class="relative w-full overflow-hidden bg-muted lg:mx-auto lg:max-w-7xl lg:rounded-2xl">
				<div
					class="relative aspect-16/10 max-h-[min(70vh,32rem)] w-full max-lg:max-h-[min(52vh,24rem)]"
				>
					<img
						src={h.coverImageUrl}
						alt=""
						class="absolute inset-0 size-full object-cover"
						decoding="async"
						fetchpriority="high"
					/>
					<div
						class="from-background/95 via-background/40 absolute inset-0 bg-linear-to-t to-transparent"
						aria-hidden="true"
					></div>
					<div class="absolute inset-x-0 bottom-0 px-4 pt-24 pb-8 sm:px-8 sm:pb-10">
						<p class="text-primary mb-2 font-mono text-[11px] tracking-[0.14em] uppercase">
							{labelHospitalityType(h.type)}
						</p>
						<h1
							class="font-serif text-3xl leading-[1.1] font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl"
						>
							{h.name}
						</h1>
						<p class="text-muted-foreground mt-3 flex items-start gap-2 text-sm sm:text-base">
							<MapPinIcon class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
							<span>
								{m['HospitalityPage.addressLineMeta']({
									address: h.address,
									city: h.city,
									country: h.country
								})}
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>

		<div
			class="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-12 lg:px-8 lg:pb-16 xl:grid-cols-[minmax(0,1fr)_20rem]"
		>
			<div class="flex min-w-0 flex-col gap-12 lg:gap-14">
				<section class="scroll-mt-28" aria-labelledby="about-heading">
					<p class="text-primary mb-2 font-mono text-[11px] tracking-[0.14em] uppercase">
						{m['HospitalityPage.aboutEyebrow']()}
					</p>

					<h2
						id="about-heading"
						class="font-serif text-2xl font-medium tracking-tight sm:text-3xl"
					>
						{m['HospitalityPage.aboutTitle']()}
					</h2>

					<p class="text-muted-foreground mt-1 text-sm">
						{m['HospitalityPage.aboutSideNote']()}
					</p>

					<p
						class="text-foreground/95 mt-6 max-w-prose text-base leading-relaxed whitespace-pre-wrap"
					>
						{h.description}
					</p>
				</section>
			</div>

			<aside class="space-y-6 lg:sticky lg:top-28">
				<Card.Root class="border-border/80">
					<Card.Header class="pb-2">
						<p class="text-primary font-mono text-[11px] tracking-[0.14em] uppercase">
							{m['HospitalityPage.practicalEyebrow']()}
						</p>
						<Card.Title class="font-serif text-lg"
							>{m['HospitalityPage.practicalTitle']()}</Card.Title
						>
					</Card.Header>
					<Card.Content class="flex flex-col gap-3">
						{#if hasReserveChannels}
							{#if websiteHref}
								<a
									href={websiteHref}
									class={cn(buttonVariants({ size: 'lg' }), 'h-11 w-full gap-2')}
									target="_blank"
									rel="noopener noreferrer external"
								>
									<GlobeIcon class="size-4 shrink-0" aria-hidden="true" />
									{m['HospitalityPage.reserveWebsiteCta']()}
								</a>
							{/if}
							{#if telHref}
								<a
									href={telHref}
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'h-11 w-full justify-start gap-2'
									)}
									rel="external"
								>
									<PhoneIcon class="size-4 shrink-0" aria-hidden="true" />
									{m['HospitalityPage.contactCall']()}
								</a>
							{/if}
							{#if mailHref}
								<a
									href={mailHref}
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'h-11 w-full justify-start gap-2'
									)}
									rel="external"
								>
									<MailIcon class="size-4 shrink-0" aria-hidden="true" />
									{m['HospitalityPage.contactEmail']()}
								</a>
							{/if}
						{:else}
							<p class="text-muted-foreground text-sm">
								{m['HospitalityPage.reserveNoChannels']()}
							</p>
						{/if}
					</Card.Content>
				</Card.Root>

				<Card.Root class="border-border/80">
					<Card.Header class="pb-2">
						<Card.Title class="font-serif text-lg"
							>{m['HospitalityPage.venueDetailsTitle']()}</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<dl class="space-y-4 text-sm">
							<div>
								<dt class="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
									{m['HospitalityPage.dlType']()}
								</dt>
								<dd class="mt-1">{labelHospitalityType(h.type)}</dd>
							</div>
							<div>
								<dt class="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
									{m['HospitalityPage.factArea']()}
								</dt>
								<dd class="mt-1">{h.city}, {h.country}</dd>
							</div>
						</dl>
					</Card.Content>
				</Card.Root>
			</aside>
		</div>
	{/if}
</div>
