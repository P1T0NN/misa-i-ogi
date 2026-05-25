// SVELTEKIT IMPORTS
import { getRequestEvent } from '$app/server';

// LIBRARIES
import { isRateLimitError } from '@convex-dev/rate-limiter';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { api } from '@/convex/_generated/api';
import { m } from '@/shared/lib/paraglide/messages';

// CONFIG
import { COOKIE_NAMES } from '@/shared/config';

// UTILS
import { createCookie } from '@/shared/utils/cookieUtils';
import { resolveClientAddress } from '@/shared/utils/clientAddress';
import { rateLimitMessage } from '@/shared/utils/rateLimitMessages';
import { safeCommand } from '@/shared/utils/remoteFunctionsUtils';
import { translateFromBackend } from '@/shared/utils/translateFromBackend';

// SCHEMAS
import { joinGuestStaySchema } from '@/features/guests/schemas/guestStaySchemas';

// TYPES
import type { typesApiResult } from '@/shared/types/types';

/**
 * Grants shared stay access while keeping the signed cookie out of browser JavaScript.
 * Convex owns code verification and expiry; this boundary owns request IP and cookies.
 */
export const joinGuestStay = safeCommand(
	joinGuestStaySchema,
	async ({ sharingCode }): Promise<typesApiResult> => {
		const event = getRequestEvent();
		const client = createConvexHttpClient();

		try {
			const result = await client.mutation(
				api.tables.guests.mutations.joinGuestBySharingCode.joinGuestBySharingCode,
				{
					sharingCode,
					ip: resolveClientAddress(event, { fallback: 'unknown' }) ?? 'unknown'
				}
			);

			if (!result.success) {
				return { success: false, message: translateFromBackend(result.message) };
			}

			if (!result.data?.signedCookie) {
				return {
					success: false,
					message: m['GenericMessages.GUEST_SHARING_CODE_INVALID']()
				};
			}

			createCookie(event.cookies, {
				name: COOKIE_NAMES.GUEST_STAY,
				value: result.data.signedCookie,
				expires: result.data.expiresAt
			});

			return {
				success: true,
				message: m['GenericMessages.GUEST_SHARED_ACCESS_GRANTED']()
			};
		} catch (error) {
			if (isRateLimitError(error)) {
				return {
					success: false,
					message: rateLimitMessage(error.data.retryAfter)
				};
			}
			throw error;
		}
	}
);
