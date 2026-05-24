// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			token: string | undefined;
		}
		interface PageData {
			/** Shown in app shells (e.g. `SiteHeader`) when set by a route `load`. */
			pageTitle?: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '$app/paths' {
	/**
	 * Public Paraglide URLs include `/{locale}` before SvelteKit's canonical
	 * path. The generated `Pathname` union only contains canonical paths, but
	 * runtime `resolve` still correctly applies the configured base path.
	 */
	export function resolve(path: string): string;
}

export {};
