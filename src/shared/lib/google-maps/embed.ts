/**
 * Keyless Google Maps iframe URL — the same kind of embed Google Maps offers under
 * **Share → Embed a map**, without loading the Maps JavaScript API or passing an API key.
 *
 * No Dynamic Maps / Embed API billing from your project; Google serves the iframe directly.
 * Unofficial but widely used for simple read-only location display.
 */
export function buildGoogleMapsIframeSrc(options: {
	lat: number;
	lng: number;
	zoom?: number;
	/** Place name or address for the `q` param; defaults to `"lat,lng"`. */
	query?: string;
}): string {
	const q = options.query?.trim() || `${options.lat},${options.lng}`;
	const params = new URLSearchParams({
		q,
		z: String(options.zoom ?? 15),
		output: 'embed'
	});

	return `https://maps.google.com/maps?${params.toString()}`;
}
