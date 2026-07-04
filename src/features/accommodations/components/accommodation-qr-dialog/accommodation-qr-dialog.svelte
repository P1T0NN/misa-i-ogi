<script lang="ts">
	// SVELTEKIT IMPORTS
	import { PUBLIC_SITE_URL } from '$env/static/public';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import Dialog from '@/shared/components/ui/dialog/dialog.svelte';
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
		`qr-${
			accommodationName
				.trim()
				.replace(/\s+/g, '-')
				.replace(/[^\w-]/g, '') || scanToken
		}.png`
	);

	const previewQrPromise = $derived.by(() => {
		if (!open || !scanToken) return null;
		return generateQrDataUrl(activateUrl, QR_PREVIEW_WIDTH);
	});
</script>

<Dialog
	bind:open
	title={m['AccommodationQrDialog.title']({ name: accommodationName })}
	class="max-w-md"
>
	<p class="text-sm leading-relaxed text-muted-foreground">
		{m['AccommodationQrDialog.description']()}
	</p>

	<div class="flex flex-col items-center gap-4 py-2">
		<div
			class="flex size-64 items-center justify-center rounded-xl border border-border bg-card p-3"
			aria-busy={previewQrPromise !== null}
		>
			{#if previewQrPromise}
				{#await previewQrPromise}
					<p class="text-sm text-muted-foreground">
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
					<p class="text-sm text-muted-foreground">
						{m['AccommodationQrDialog.generating']()}
					</p>
				{/await}
			{/if}
		</div>

		{#if isLocalhostOrigin}
			<p
				class="w-full rounded-lg bg-muted/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground"
			>
				{m['AccommodationQrDialog.localhostWarning']()}
			</p>
		{/if}

		<div class="flex w-full flex-col gap-1.5">
			<p class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
				{m['AccommodationQrDialog.activateUrl']()}
			</p>
			<div class="flex items-start gap-1 rounded-lg border border-border px-2 py-1.5">
				<p class="min-w-0 flex-1 font-mono text-xs leading-relaxed break-all">{activateUrl}</p>
				<CopyButton
					value={activateUrl}
					label={m['AccommodationQrDialog.copyUrl']()}
					class="shrink-0"
				/>
			</div>
		</div>
	</div>

	<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
		<Button type="button" variant="outline" onclick={() => (open = false)}>
			{m['AccommodationQrDialog.close']()}
		</Button>

		<DownloadQrCodeButton {activateUrl} {downloadFileName} disabled={previewQrPromise === null} />
	</div>
</Dialog>
