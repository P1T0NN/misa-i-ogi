<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
	import AccommodationQrDialog from '@/features/accommodations/components/accommodation-qr-dialog/accommodation-qr-dialog.svelte';

	// TYPES
	import type { FunctionReturnType } from 'convex/server';
	import { api } from '@/convex/_generated/api';

	// LUCIDE ICONS
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';

	type AccommodationForEdit = NonNullable<
		FunctionReturnType<
			typeof api.tables.accommodations.queries.fetchMyAccommodationForEdit.fetchMyAccommodationForEdit
		>
	>;

	let {
		accommodation
	}: {
		accommodation: AccommodationForEdit;
	} = $props();

	let qrDialogOpen = $state(false);
</script>

<div class="rounded-xl border border-border bg-card p-4 md:p-6">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-base font-semibold">
				{m['EditAccommodationPage.sectionGuestAccessTitle']()}
			</h2>
			<p class="text-muted-foreground text-sm">
				{m['EditAccommodationPage.sectionGuestAccessDescription']()}
			</p>
		</div>
		<Button type="button" variant="outline" onclick={() => (qrDialogOpen = true)}>
			<QrCodeIcon data-icon="inline-start" />
			{m['EditAccommodationPage.showQr']()}
		</Button>
	</div>
</div>

<AccommodationQrDialog
	bind:open={qrDialogOpen}
	accommodationName={accommodation.name}
	scanToken={accommodation.scanToken}
/>
