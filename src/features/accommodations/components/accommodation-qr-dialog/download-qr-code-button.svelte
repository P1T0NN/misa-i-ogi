<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';

	// UTILS
	import { generateQrDataUrl } from '@/features/guests/utils/generateQrDataUrl.client';

	// LUCIDE ICONS
	import DownloadIcon from '@lucide/svelte/icons/download';

	let {
		activateUrl,
		downloadFileName,
		disabled = false
	}: {
		activateUrl: string;
		downloadFileName: string;
		disabled?: boolean;
	} = $props();

	let isDownloading = $state(false);

	const QR_DOWNLOAD_WIDTH = 1024;

	async function handleDownload() {
		isDownloading = true;

		try {
			const dataUrl = await generateQrDataUrl(activateUrl, QR_DOWNLOAD_WIDTH);
			const anchor = document.createElement('a');
			anchor.href = dataUrl;
			anchor.download = downloadFileName;
			anchor.click();
		} finally {
			isDownloading = false;
		}
	}
</script>

<Button type="button" disabled={disabled || isDownloading} onclick={handleDownload}>
	<DownloadIcon data-icon="inline-start" />
	{m['AccommodationQrDialog.download']()}
</Button>
