// LIBRARIES
import { v } from 'convex/values';
import { mutation } from '@/convex/_generated/server';
import { enforceRateLimit } from '@/convex/rateLimits/enforceRateLimit';
import { rateLimitKey } from '@/convex/rateLimits/keys';

// CONFIG
import { GUEST_STAY_DURATION_MS } from '@/convex/projectSettings';

// HELPERS
import { getGuestSessionsByAccommodationId } from '@/convex/tables/guests/helpers/getGuestSessionsByAccommodationId';
import { getAccommodationByScanTokenSafe } from '@/convex/tables/accommodations/helpers/getAccommodationByScanTokenSafe';

// UTILS
import {
	generateGuestCredential,
	hashGuestCredential
} from '@/convex/tables/guests/utils/guestSessionToken';
import { signGuestStayCookie } from '@/convex/tables/guests/utils/guestStayCookieCrypto';

// SCHEMAS
import { mutationResultValidator } from '@/convex/schemas/mutationResult';

// TYPES
import type { ConvexMutationResult } from '@/convex/types/convexTypes';

/**
 * Rate-limited QR scan — one active guest session per accommodation.
 * Expired rows for that accommodation are removed before inserting a new session.
 */
export const createGuest = mutation({
	args: {
		scanToken: v.string(),
		ip: v.string()
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<ConvexMutationResult<{ signedCookie: string }>> => {
		await enforceRateLimit(ctx, 'createGuest', rateLimitKey.ip(args.ip));

		const accommodation = await getAccommodationByScanTokenSafe(ctx, args.scanToken);
		if (!accommodation) {
			return {
				success: false,
				message: { key: 'GenericMessages.ACCOMMODATION_NOT_FOUND' }
			};
		}

		const now = Date.now();
		const existingGuests = await getGuestSessionsByAccommodationId(ctx, accommodation._id);

		for (const guest of existingGuests) {
			if (guest.expiresAt < now) {
				await ctx.db.delete(guest._id);
			}
		}

		const hasActiveGuest = existingGuests.some((guest) => guest.expiresAt >= now);
		if (hasActiveGuest) {
			return {
				success: false,
				message: { key: 'GenericMessages.GUEST_ALREADY_ACTIVE' }
			};
		}

		const sessionToken = generateGuestCredential('sessionToken');
		const expiresAt = now + GUEST_STAY_DURATION_MS;
		let sharingCode = generateGuestCredential('sharingCode');
		let sharingCodeHash = hashGuestCredential('sharingCode', sharingCode);

		while (
			await ctx.db
				.query('guests')
				.withIndex('by_sharing_code_hash', (q) => q.eq('sharingCodeHash', sharingCodeHash))
				.first()
		) {
			sharingCode = generateGuestCredential('sharingCode');
			sharingCodeHash = hashGuestCredential('sharingCode', sharingCode);
		}

		await ctx.db.insert('guests', {
			sessionTokenHash: hashGuestCredential('sessionToken', sessionToken),
			sharingCodeHash,
			accommodationId: accommodation._id,
			expiresAt,
			createdAt: now,
			lastSeenAt: now
		});

		return {
			success: true,
			message: { key: 'GenericMessages.GUEST_CREATED' },
			data: {
				signedCookie: await signGuestStayCookie({ sessionToken, expiresAt, sharingCode })
			}
		};
	}
});
