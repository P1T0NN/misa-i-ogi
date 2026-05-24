// SVELTEKIT IMPORTS
import { browser } from '$app/environment';

// LIBRARIES
import QRCode from 'qrcode';

/** Browser-only — uses `qrcode` canvas APIs. */
export async function generateQrDataUrl(url: string, width: number): Promise<string> {
	if (!browser) {
		throw new Error('generateQrDataUrl must run in the browser');
	}

	return QRCode.toDataURL(url, {
		errorCorrectionLevel: 'M',
		margin: 2,
		width
	});
}
