<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';
	import AccommodationQrDialog from '@/features/accommodations/components/accommodation-qr-dialog/accommodation-qr-dialog.svelte';
	import DeleteAccommodationDialog from '@/features/accommodations/components/delete-accommodation-dialog.svelte';

	// DATA
	import { labelAccommodationType } from '@/features/accommodations/data/accommodationsData';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';

	// LUCIDE ICONS
	import Building2Icon from '@lucide/svelte/icons/building-2';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';

	let { accommodation }: { accommodation: Doc<'accommodations'> } = $props();

	let qrDialogOpen = $state(false);

	function editHref(accommodation: Doc<'accommodations'>) {
		return PROTECTED_PAGE_ENDPOINTS.EDIT_ACCOMMODATION.replace(':id', accommodation._id);
	}
</script>

<article
	class="rounded-xl border border-border bg-card px-3 py-3 transition-colors hover:border-border/80 md:px-4"
>
	<div class="grid gap-3 md:grid-cols-[4.5rem_minmax(0,1fr)_auto] md:items-center">
		<div class="size-16 overflow-hidden rounded-lg border border-border bg-muted md:size-18">
			{#if accommodation.coverImageUrl}
				<img
					src={accommodation.coverImageUrl}
					alt=""
					class="size-full object-cover"
					loading="lazy"
					decoding="async"
				/>
			{:else}
				<div class="flex size-full items-center justify-center text-muted-foreground">
					<Building2Icon class="size-5" aria-hidden="true" />
				</div>
			{/if}
		</div>

		<div class="min-w-0">
			<div class="flex flex-wrap items-center gap-2">
				<h3 class="truncate text-base font-semibold tracking-normal">{accommodation.name}</h3>
			</div>

			<div
				class="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground md:flex-nowrap"
			>
				<span class="flex min-w-0 items-center gap-1.5">
					<Building2Icon class="size-3.5 shrink-0" aria-hidden="true" />
					<span class="truncate">{labelAccommodationType(accommodation.type)}</span>
				</span>

				<span class="hidden h-3 w-px bg-border sm:block" aria-hidden="true"></span>

				<span class="inline-flex items-center gap-1.5 whitespace-nowrap">
					<span class="text-xs font-medium">
						{m['MyAccommodationsPage.MyAccommodationsItem.status']()}
					</span>
					{#if accommodation.isActive}
						<Badge variant="success">
							{m['MyAccommodationsPage.MyAccommodationsItem.active']()}
						</Badge>
					{:else}
						<Badge variant="secondary">
							{m['MyAccommodationsPage.MyAccommodationsItem.inactive']()}
						</Badge>
					{/if}
				</span>

				<span class="inline-flex min-w-0 items-center gap-1.5">
					<MapPinIcon class="size-3.5 shrink-0" aria-hidden="true" />
					<span class="truncate">{accommodation.city}, {accommodation.country}</span>
				</span>
			</div>
		</div>

		<div class="flex flex-wrap gap-2 md:justify-end">
			<Button href={editHref(accommodation)} variant="outline" size="sm">
				<PencilIcon data-icon="inline-start" />
				{m['MyAccommodationsPage.MyAccommodationsItem.edit']()}
			</Button>

			<DeleteAccommodationDialog
				accommodationId={accommodation._id}
				accommodationName={accommodation.name}
			/>

			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label={m['MyAccommodationsPage.MyAccommodationsItem.showQrAriaLabel']()}
				onclick={() => (qrDialogOpen = true)}
			>
				<QrCodeIcon class="size-3.5" aria-hidden="true" />
			</Button>
		</div>
	</div>
</article>

<AccommodationQrDialog
	bind:open={qrDialogOpen}
	accommodationName={accommodation.name}
	scanToken={accommodation.scanToken}
/>
