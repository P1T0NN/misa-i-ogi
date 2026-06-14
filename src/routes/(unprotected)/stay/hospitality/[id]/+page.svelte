<script lang="ts">
	// LIBRARIES
	import { page } from '$app/state';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import * as Card from '@/shared/components/ui/card/index.js';
	import RequestReservationDialog from '@/features/hospitalities/components/request-reservation-dialog.svelte';
	import GuestReservationCard from '@/features/hospitalities/components/guest-reservation-card.svelte';
	import HospitalityEmpty from '@/shared/components/pages/(unprotected)/hospitality/empty/hospitality-empty.svelte';
	import HospitalityError from '@/shared/components/pages/(unprotected)/hospitality/error/hospitality-error.svelte';
	import HospitalityLoading from '@/shared/components/pages/(unprotected)/hospitality/loading/hospitality-loading.svelte';

	// DATA
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';
	import type { HospitalityDetailsResult } from '@/convex/tables/hospitalities/types/hospitalitiesTypes';

	// ICONS
	import MapPinIcon from '@lucide/svelte/icons/map-pin';

	const rawHospitalityId = $derived(page.params.id);

	const detailQuery = useQuery(
		api.tables.hospitalities.queries.fetchHospitalityDetails.fetchHospitalityDetails,
		() => (rawHospitalityId ? { hospitalityId: rawHospitalityId as Id<'hospitalities'> } : 'skip')
	);

	const hospitalityResult = $derived(detailQuery.data as HospitalityDetailsResult | undefined);
	const hospitality = $derived(
		hospitalityResult?.status === 'available' ? hospitalityResult.hospitality : null
	);
	const guestReservation = $derived(
		hospitalityResult?.status === 'available' ? hospitalityResult.guestReservation : null
	);
	const partnership = $derived(
		hospitalityResult?.status === 'available' ? hospitalityResult.partnership : null
	);
	const isLoading = $derived(hospitalityResult === undefined && !detailQuery.error);
	const isNotFound = $derived(hospitalityResult?.status === 'not_found');
	const isNotPartnered = $derived(hospitalityResult?.status === 'not_partnered');
</script>

<SvelteHead
	title={hospitality?.name}
	description={m['HospitalityPage.SEO.description']()}
/>

<div class="bg-background text-foreground">
	{#if detailQuery.error}
		<HospitalityError />
	{:else if isLoading}
		<HospitalityLoading />
	{:else if isNotPartnered}
		<HospitalityEmpty reason="notPartnered" />
	{:else if isNotFound}
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
						class="absolute inset-0 bg-linear-to-t from-background/95 via-background/40 to-transparent"
						aria-hidden="true"
					></div>
					<div class="absolute inset-x-0 bottom-0 px-4 pt-24 pb-8 sm:px-8 sm:pb-10">
						<p class="mb-2 font-mono text-[11px] tracking-[0.14em] text-primary uppercase">
							{labelHospitalityType(h.type)}
						</p>
						<h1
							class="font-serif text-3xl leading-[1.1] font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl"
						>
							{h.name}
						</h1>
						<p class="mt-3 flex items-start gap-2 text-sm text-muted-foreground sm:text-base">
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
					<h2 id="about-heading" class="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
						{m['HospitalityPage.aboutTitle']()}
					</h2>

					<p class="mt-1 text-sm text-muted-foreground">
						{m['HospitalityPage.aboutSideNote']()}
					</p>

					<p
						class="mt-6 max-w-prose text-base leading-relaxed whitespace-pre-wrap text-foreground/95"
					>
						{h.description}
					</p>
				</section>
			</div>

			<aside class="space-y-6 lg:sticky lg:top-28">
				{#if partnership}
					<Card.Root class="overflow-hidden border-primary/20 bg-accent/40">
						<Card.Header class="pb-3">
							<p class="mb-2 font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
								{m['HospitalityPage.benefitEyebrow']()}
							</p>

							{#if partnership.discountPercentage != null}
								<Card.Title class="font-serif text-3xl leading-none">
									{m['HospitalityPage.benefitDiscountTitle']({
										percent: partnership.discountPercentage
									})}
								</Card.Title>
							{:else}
								<Card.Title class="font-serif text-2xl leading-tight">
									{m['HospitalityPage.benefitGenericTitle']()}
								</Card.Title>
							{/if}
						</Card.Header>
						<Card.Content class="space-y-3">
							{#if partnership.discountPercentage != null}
								<p class="text-sm leading-relaxed text-muted-foreground">
									{m['HospitalityPage.benefitDiscountBody']({ hospitalityName: h.name })}
								</p>
							{:else}
								<p class="text-sm leading-relaxed text-muted-foreground">
									{m['HospitalityPage.benefitGenericBody']({ hospitalityName: h.name })}
								</p>
							{/if}

							<p class="border-t border-primary/15 pt-3 text-xs leading-relaxed text-muted-foreground">
								{m['HospitalityPage.benefitSourceNote']()}
							</p>
						</Card.Content>
					</Card.Root>
				{/if}

				{#if guestReservation}
					<GuestReservationCard reservation={guestReservation} hospitalityName={h.name} />
				{:else}
					<RequestReservationDialog hospitalityName={h.name} hospitalityId={h._id} />
				{/if}

				<Card.Root class="border-border/80">
					<Card.Header class="pb-2">
						<Card.Title class="font-serif text-lg"
							>{m['HospitalityPage.hospitalityDetailsTitle']()}</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<dl class="space-y-4 text-sm">
							<div>
								<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
									{m['HospitalityPage.dlType']()}
								</dt>
								<dd class="mt-1">{labelHospitalityType(h.type)}</dd>
							</div>
							<div>
								<dt class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
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
