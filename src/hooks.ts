import type { Reroute } from '@sveltejs/kit';
import { deLocalizeUrl } from '@/shared/lib/paraglide/runtime';

/** Map locale-prefixed URLs to SvelteKit route paths. Must live in hooks.ts (not hooks.server.ts). */
export const reroute: Reroute = ({ url }) => deLocalizeUrl(url).pathname;
