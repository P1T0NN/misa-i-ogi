import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { BOTID_CHALLENGE_PATH, BOTID_PROXY_PREFIX } from './src/shared/config/botidProxy.ts';

export default defineConfig({
	// BotID client loads same-origin challenge/proxy scripts. Vite dev has no
	// vercel.json rewrites, so proxy them to Vercel's bot-protection API.
	server: {
		proxy: {
			[BOTID_CHALLENGE_PATH]: {
				target: 'https://api.vercel.com',
				changeOrigin: true,
				secure: true,
				rewrite: () => '/bot-protection/v1/challenge'
			},
			[BOTID_PROXY_PREFIX]: {
				target: 'https://api.vercel.com',
				changeOrigin: true,
				secure: true,
				rewrite: (path) => `/bot-protection/v1/proxy${path.slice(BOTID_PROXY_PREFIX.length)}`
			}
		}
	},
	// layerchart ΓåÆ @dagrejs/dagre ships ESM-only; if left external, Node SSR loads
	// dagre.esm.js as CJS and throws "Unexpected token 'export'".
	ssr: {
		// UI imports constants from @piton-/analytics-convex; Vite must bundle the
		// package for SSR because its dist still uses extensionless relative imports.
		noExternal: ['layerchart', '@dagrejs/dagre', '@piton-/analytics-convex']
	},
	plugins: [
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/shared/lib/paraglide',
			strategy: ['url', 'cookie', 'baseLocale'],
			routeStrategies: [
				{ match: '/admin/:path(.*)?', strategy: ['cookie', 'baseLocale'] },
				{ match: '/api/:path(.*)?', exclude: true }
			],
			urlPatterns: [
				{
					pattern: ':protocol://:domain(.*)::port?/admin/:path(.*)?',
					localized: [
						['sr', ':protocol://:domain(.*)::port?/admin/:path(.*)?'],
						['en', ':protocol://:domain(.*)::port?/admin/:path(.*)?']
					]
				},
				{
					pattern: ':protocol://:domain(.*)::port?/:path(.*)?',
					localized: [
						['sr', ':protocol://:domain(.*)::port?/sr/:path(.*)?'],
						['en', ':protocol://:domain(.*)::port?/:path(.*)?']
					]
				}
			]
		}),
		tailwindcss(),
		sveltekit()
	]
});
