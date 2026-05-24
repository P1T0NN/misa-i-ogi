<script lang="ts">
	// SVELTEKIT IMPORTS
	import { PUBLIC_SITE_URL } from '$env/static/public';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import * as Dialog from '@/shared/components/ui/dialog/index.js';
	import CopyButton from '@/shared/components/ui/copy-button/copy-button.svelte';
	import { Button } from '@/shared/components/ui/button/index.js';
	import DownloadQrCodeButton from './download-qr-code-button.svelte';

	// UTILS
	import { buildActivateUrl } from '@/features/guests/utils/buildActivateUrl';
	import { generateQrDataUrl } from '@/features/guests/utils/generateQrDataUrl.client';

	let {
		open = $bindable(false),
		accommodationName,
		scanToken
	}: {
		open?: boolean;
		accommodationName: string;
		scanToken: string;
	} = $props();

	const QR_PREVIEW_WIDTH = 512;

	const activateUrl = $derived(buildActivateUrl(scanToken, PUBLIC_SITE_URL));
	const isLocalhostOrigin = $derived(/localhost|127\.0\.0\.1/i.test(PUBLIC_SITE_URL));
	const downloadFileName = $derived(
		`qr-${accommodationName.trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || scanToken}.png`
	);

	const previewQrPromise = $derived.by(() => {
		if (!open || !scanToken) return null;
		return generateQrDataUrl(activateUrl, QR_PREVIEW_WIDTH);
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>{m['AccommodationQrDialog.title']({ name: accommodationName })}</Dialog.Title>
			<Dialog.Description>
				{m['AccommodationQrDialog.description']()}
			</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col items-center gap-4 py-2">
			<div
				class="border-border bg-card flex size-64 items-center justify-center rounded-xl border p-3"
				aria-busy={previewQrPromise !== null}
			>
				{#if previewQrPromise}
					{#await previewQrPromise}
						<p class="text-muted-foreground text-sm">
							{m['AccommodationQrDialog.generating']()}
						</p>
					{:then previewDataUrl}
						<img
							src={previewDataUrl}
							alt={m['AccommodationQrDialog.imageAlt']({ name: accommodationName })}
							class="size-full object-contain"
							width={QR_PREVIEW_WIDTH}
							height={QR_PREVIEW_WIDTH}
						/>
					{:catch}
						<p class="text-muted-foreground text-sm">
							{m['AccommodationQrDialog.generating']()}
						</p>
					{/await}
				{/if}
			</div>

			{#if isLocalhostOrigin}
				<p class="text-muted-foreground bg-muted/60 w-full rounded-lg px-3 py-2 text-xs leading-relaxed">
					{m['AccommodationQrDialog.localhostWarning']()}
				</p>
			{/if}

			<div class="flex w-full flex-col gap-1.5">
				<p class="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
					{m['AccommodationQrDialog.activateUrl']()}
				</p>
				<div class="border-border flex items-start gap-1 rounded-lg border px-2 py-1.5">
					<p class="min-w-0 flex-1 break-all font-mono text-xs leading-relaxed">{activateUrl}</p>
					<CopyButton
						value={activateUrl}
						label={m['AccommodationQrDialog.copyUrl']()}
						class="shrink-0"
					/>
				</div>
			</div>
		</div>

		<Dialog.Footer>
			<Button type="button" variant="outline" onclick={() => (open = false)}>
				{m['AccommodationQrDialog.close']()}
			</Button>

			<DownloadQrCodeButton
				{activateUrl}
				{downloadFileName}
				disabled={previewQrPromise === null}
			/>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
