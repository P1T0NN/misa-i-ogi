// SVELTEKIT IMPORTS
import { command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

// LIBRARIES
import { checkBotId } from 'botid/server';
import { dev } from '$app/environment';
import { m } from '@/shared/lib/paraglide/messages';

// TYPES
import type { IncomingHttpHeaders } from 'node:http';
import type { GenericSchema, InferOutput } from 'valibot';

function requestHeadersToNode(headers: Headers): IncomingHttpHeaders {
	const result: IncomingHttpHeaders = {};
	headers.forEach((value, key) => {
		result[key.toLowerCase()] = value;
	});
	return result;
}

/**
 * Drop-in replacement for SvelteKit's `command(schema, handler)` that runs
 * Vercel BotID's `checkBotId()` before the handler.
 *
 * Unlike Next.js, SvelteKit must forward the incoming request headers explicitly ΓÇö
 * otherwise `checkBotId()` cannot see the `x-is-human` stamp from the client.
 *
 * @example
 * ```ts
 * export const sendContactFormEmail = safeCommand(schema, async (data) => {
 *   // BotID already enforced ΓÇö go straight to business logic.
 *   ...
 * });
 * ```
 */
export const safeCommand = <S extends GenericSchema, R>(
	schema: S,
	handler: (data: InferOutput<S>) => Promise<R>
) =>
	command(schema, async (data: InferOutput<S>) => {
		// checkBotId() needs Vercel's x-vercel-oidc-token, which only exists on
		// deployments — skip it in dev and local production builds.
		if (!dev && process.env.VERCEL) {
			const { request } = getRequestEvent();

			const verification = await checkBotId({
				advancedOptions: {
					headers: requestHeadersToNode(request.headers)
				}
			});

			if (verification.isBot) {
				throw error(403, m['GenericMessages.FORBIDDEN']());
			}
		}

		return handler(data);
	});
