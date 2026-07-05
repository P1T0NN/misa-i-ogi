<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import {
	PROTECTED_PAGE_ENDPOINTS,
	UNPROTECTED_PAGE_ENDPOINTS,
} from '@/shared/page-endpoints.js';

	// COMPONENTS
	import { Badge } from '@/shared/components/ui/badge/index.js';
	import { Button } from '@/shared/components/ui/button/index.js';
	import CopyButton from '@/shared/components/ui/copy-button/copy-button.svelte';
	import DeleteHospitalityDialog from '@/features/hospitalities/components/delete-hospitality-dialog.svelte';

	// DATA
	import { labelHospitalityType } from '@/features/hospitalities/data/hospitalitiesData';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';

	// LUCIDE ICONS
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import ListChecksIcon from '@lucide/svelte/icons/list-checks';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import StoreIcon from '@lucide/svelte/icons/store';

	let { hospitality }: { hospitality: Doc<'hospitalities'> } = $props();

	function editHref(hospitality: Doc<'hospitalities'>) {
		return PROTECTED_PAGE_ENDPOINTS.EDIT_HOSPITALITY.replace(':id', hospitality._id);
	}

	function publicHref(hospitality: Doc<'hospitalities'>) {
		return UNPROTECTED_PAGE_ENDPOINTS.HOSPITALITY.replace(':id', hospitality._id);
	}

	function reservationsHref() {
		return PROTECTED_PAGE_ENDPOINTS.RESERVATIONS + '?venue=' + hospitality.name;
	}
</script>

<article
	class="rounded-xl border border-border bg-card px-3 py-3 transition-colors hover:border-border/80 md:px-4"
>
	<div class="grid gap-3 md:grid-cols-[4.5rem_minmax(0,1fr)_auto] md:items-center">
		<div class="size-16 overflow-hidden rounded-lg border border-border bg-muted md:size-18">
			{#if hospitality.coverImageUrl}
				<img
					src={hospitality.coverImageUrl}
					alt=""
					class="size-full object-cover"
					loading="lazy"
					decoding="async"
				/>
			{:else}
				<div class="flex size-full items-center justify-center text-muted-foreground">
					<StoreIcon class="size-5" aria-hidden="true" />
				</div>
			{/if}
		</div>

		<div class="min-w-0">
			<div class="flex flex-wrap items-center gap-2">
				<h3 class="truncate text-base font-semibold tracking-normal">{hospitality.name}</h3>
			</div>

			<div
				class="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground md:flex-nowrap"
			>
				<span class="flex min-w-0 items-center gap-1.5">
					<StoreIcon class="size-3.5 shrink-0" aria-hidden="true" />
					<span class="truncate">{labelHospitalityType(hospitality.type)}</span>
				</span>

				<span class="hidden h-3 w-px bg-border sm:block" aria-hidden="true"></span>

				<span class="inline-flex items-center gap-1.5 whitespace-nowrap">
					<span class="text-xs font-medium">
						{m['MyHospitalitiesPage.MyHospitalitiesItem.status']()}
					</span>
					{#if hospitality.isActive}
						<Badge variant="success">
							{m['MyHospitalitiesPage.MyHospitalitiesItem.active']()}
						</Badge>
					{:else}
						<Badge variant="secondary">
							{m['MyHospitalitiesPage.MyHospitalitiesItem.inactive']()}
						</Badge>
					{/if}
				</span>

				<span class="inline-flex items-center gap-1.5 whitespace-nowrap">
					<span class="text-xs font-medium">
						{m['MyHospitalitiesPage.MyHospitalitiesItem.reservations']()}
					</span>
					<Button href={reservationsHref()} variant="ghost" size="xs">
						<ListChecksIcon data-icon="inline-start" />
						{m['MyHospitalitiesPage.MyHospitalitiesItem.view']()}
					</Button>
				</span>

				{#if hospitality.connectCode}
					<span class="inline-flex items-center gap-1.5 whitespace-nowrap">
						<span class="text-xs font-medium">
							{m['MyHospitalitiesPage.MyHospitalitiesItem.connectCode']()}
						</span>
						<code
							class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold tracking-widest"
						>
							{hospitality.connectCode}
						</code>
						<CopyButton
							value={hospitality.connectCode}
							label={m['MyHospitalitiesPage.MyHospitalitiesItem.copyConnectCodeAriaLabel']()}
						/>
					</span>
				{/if}
			</div>
		</div>

		<div class="flex flex-wrap gap-2 md:justify-end">
			<Button href={editHref(hospitality)} variant="outline" size="sm">
				<PencilIcon data-icon="inline-start" />
				{m['MyHospitalitiesPage.MyHospitalitiesItem.edit']()}
			</Button>

			<DeleteHospitalityDialog hospitalityId={hospitality._id} hospitalityName={hospitality.name} />

			<Button
				href={publicHref(hospitality)}
				variant="ghost"
				size="icon-sm"
				aria-label={m['MyHospitalitiesPage.MyHospitalitiesItem.openPublicPageAriaLabel']()}
			>
				<ExternalLinkIcon class="size-3.5" aria-hidden="true" />
			</Button>
		</div>
	</div>
</article>
