// SVELTEKIT IMPORTS
import { PUBLIC_CONVEX_SITE_URL } from '$env/static/public';

// UTILS
import { CLIENT_IP_HEADER, resolveClientAddress } from '@/shared/utils/clientAddress.js';

// TYPES
import type { RequestHandler } from './$types';

/**
 * Better-auth proxy from SvelteKit → Convex.
 *
 * Re-stamps trusted client IP as `x-client-ip` for Better Auth rate limits.
 */
const FORWARDED_AUTH_HEADER_NAMES = new Set([
	'accept',
	'authorization',
	'better-auth-cookie',
	'content-type',
	'cookie',
	'origin',
	'referer',
	'user-agent'
]);

const proxy: RequestHandler = async (event) => {
	const { request, getClientAddress } = event;
	const requestUrl = new URL(request.url);
	const nextUrl = `${PUBLIC_CONVEX_SITE_URL}${requestUrl.pathname}${requestUrl.search}`;
	const newRequest = new Request(nextUrl, request);

	const forwarded = new Headers();
	for (const [name, value] of request.headers.entries()) {
		if (FORWARDED_AUTH_HEADER_NAMES.has(name.toLowerCase())) forwarded.set(name, value);
	}
	forwarded.set('host', new URL(nextUrl).host);
	forwarded.set('x-forwarded-host', requestUrl.host);
	forwarded.set('x-forwarded-proto', requestUrl.protocol.replace(/:$/, ''));
	forwarded.set('x-better-auth-forwarded-host', requestUrl.host);
	forwarded.set('x-better-auth-forwarded-proto', requestUrl.protocol.replace(/:$/, ''));
	forwarded.set('accept-encoding', 'identity');

	const clientIp = resolveClientAddress({ getClientAddress });
	if (!clientIp) {
		return new Response('Could not resolve client address.', { status: 400 });
	}
	forwarded.set(CLIENT_IP_HEADER, clientIp);

	for (const name of [...newRequest.headers.keys()]) newRequest.headers.delete(name);
	for (const [name, value] of forwarded.entries()) newRequest.headers.set(name, value);

	return fetch(newRequest, { method: request.method, redirect: 'manual' });
};

export const GET = proxy;
export const POST = proxy;
