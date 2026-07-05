/**
 * Backstop for subscriptions that can pause indefinitely (e.g. a Convex query
 * waiting on auth that never resolves): `timedOut` flips to true after `ms` of
 * continuous loading so the UI can show an error instead of an infinite
 * skeleton. Resets automatically when loading stops, so a late recovery
 * (re-auth, reconnect) swaps the error back for real content.
 *
 * Must be called during component init (uses `$effect`).
 */
export function loadingTimeout(getLoading: () => boolean, ms = 10_000) {
	let timedOut = $state(false);

	$effect(() => {
		if (!getLoading()) {
			timedOut = false;
			return;
		}

		const timer = setTimeout(() => {
			timedOut = true;
		}, ms);
		return () => clearTimeout(timer);
	});

	return {
		get timedOut() {
			return timedOut;
		}
	};
}
