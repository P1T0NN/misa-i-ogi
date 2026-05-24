import { isRateLimitError } from '@convex-dev/rate-limiter';
import { APIError } from 'better-auth/api';
import type { GenericCtx } from '@convex-dev/better-auth';
import { internal } from '@/convex/_generated/api';
import type { DataModel } from '@/convex/_generated/dataModel';
import type { TranslatableMessage } from '@/convex/types/convexTypes';
import type { ConvexRateLimitName } from '@/convex/rateLimits/registry';

type ConvexRateLimitRunnerCtx = GenericCtx<DataModel> & {
	runMutation: (
		mutation: typeof internal.rateLimits.convexCreateRateLimitInternal.convexCreateRateLimitInternal,
		args: { name: string; key: string }
	) => Promise<unknown>;
};

function convexRateLimitWireMessage(retryAfterMs: number | undefined): string {
	let message: TranslatableMessage;

	if (typeof retryAfterMs !== 'number' || retryAfterMs <= 0) {
		message = { key: 'GenericMessages.TOO_MANY_REQUESTS' };
	} else if (retryAfterMs < 60_000) {
		message = {
			key: 'GenericMessages.TOO_MANY_REQUESTS_SECONDS',
			params: { seconds: Math.ceil(retryAfterMs / 1000) }
		};
	} else {
		message = {
			key: 'GenericMessages.TOO_MANY_REQUESTS_MINUTES',
			params: { minutes: Math.ceil(retryAfterMs / 60_000) }
		};
	}

	return JSON.stringify(message);
}

/** Charge a named bucket and map rate-limiter failures to a Better Auth 429. */
export async function convexCreateRateLimit(
	ctx: GenericCtx<DataModel>,
	name: ConvexRateLimitName,
	key: string
): Promise<void> {
	if (!('runMutation' in ctx)) {
		throw new Error(
			'[convexCreateRateLimit] Context lacks runMutation — auth rate limits require a mutation-capable Convex ctx.'
		);
	}

	try {
		await (ctx as ConvexRateLimitRunnerCtx).runMutation(
			internal.rateLimits.convexCreateRateLimitInternal.convexCreateRateLimitInternal,
			{ name, key }
		);
	} catch (error) {
		if (isRateLimitError(error)) {
			const retryAfterMs = error.data.retryAfter;
			const ms =
				typeof retryAfterMs === 'number' && retryAfterMs > 0 ? retryAfterMs : undefined;

			throw new APIError('TOO_MANY_REQUESTS', {
				message: convexRateLimitWireMessage(ms)
			});
		}
		throw error;
	}
}
