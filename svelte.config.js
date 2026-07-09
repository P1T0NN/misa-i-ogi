import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Pinned to the Vercel adapter (the deploy target) for deterministic builds
		// and access to runtime/region/function config. See
		// https://svelte.dev/docs/kit/adapter-vercel.
		adapter: adapter(),
		alias: {
			'@/*': './src/*'
		},
		// SvelteKit's CSRF origin check is on by default. Add extra allowed
		// origins here only if needed (e.g. multi-domain setups). An empty list
		// (or omitting `csrf` entirely) keeps the default same-origin policy.
		csrf: {
			trustedOrigins: []
		},
		experimental: {
			remoteFunctions: true
		},
		// CSP: SvelteKit emits hashes for its own inline scripts/styles in 'auto'
		// mode, so we don't need 'unsafe-inline' / 'unsafe-eval' for script-src.
		// 'unsafe-inline' stays on style-src for Tailwind/inline styles.
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': [
					'self',
					'blob:',
					'https://va.vercel-scripts.com',
					'https://umami-sable-iota.vercel.app',
					// Google Maps JS API bootstrap + lazily-imported libraries
					'https://maps.googleapis.com'
				],
				'worker-src': ['self', 'blob:'],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https:', 'blob:'],
				'font-src': ['self', 'data:'],
				'connect-src': [
					'self',
					'https://accounts.google.com',
					'https://oauth2.googleapis.com',
					'https://www.googleapis.com',
					'https://*.convex.cloud',
					'wss://*.convex.cloud',
					// Vercel Analytics + Speed Insights telemetry endpoint
					'https://va.vercel-scripts.com',
					// Cloudflare R2 — direct browser PUT to signed upload URLs and GET on public objects
					'https://*.r2.cloudflarestorage.com',
					'https://*.r2.dev',
					'https://umami-sable-iota.vercel.app',
					// Google Maps/Places (New) fetch calls + Maps vector tiles
					'https://maps.googleapis.com',
					'https://places.googleapis.com',
					'https://maps.gstatic.com'
				],
				'frame-src': [
					'self',
					'https://accounts.google.com',
					'https://www.google.com',
					'https://maps.google.com'
				],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self'],
				'frame-ancestors': ['none'],
				'upgrade-insecure-requests': true
			}
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
