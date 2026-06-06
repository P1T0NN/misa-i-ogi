// LIBRARIES
import { v } from 'convex/values';
import { mutation } from '@/convex/_generated/server';
import { enforceRateLimit } from '@/convex/rateLimits/enforceRateLimit';
import { rateLimitKey } from '@/convex/rateLimits/keys';

// HELPERS
import { analytics } from '@/convex/analytics';

// UTILS
import {
	hashGuestCredential,
	isValidGuestSharingCode,
	normalizeGuestSharingCode
} from '@/convex/tables/guests/utils/guestSessionToken';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';
import { signGuestStayCookie } from '@/convex/tables/guests/utils/guestStayCookieCrypto';

// SCHEMAS
import { mutationResultValidator } from '@/convex/schemas/mutationResult';

// TYPES
import type { JoinGuestBySharingCodeResult } from '@/convex/tables/guests/types/guestsTypes';

/** Grants another device access to the existing guest session without inserting a guest row. */
export const joinGuestBySharingCode = mutation({
	args: {
		sharingCode: v.string(),
		ip: v.string()
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<JoinGuestBySharingCodeResult> => {
		await enforceRateLimit(ctx, 'joinGuestBySharingCode', rateLimitKey.ip(args.ip));

		if (!isValidGuestSharingCode(args.sharingCode)) {
			return {
				success: false,
				message: { key: 'GenericMessages.GUEST_SHARING_CODE_INVALID' }
			};
		}

		const sharingCode = normalizeGuestSharingCode(args.sharingCode);
		const guest = await ctx.db
			.query('guests')
			.withIndex('by_sharing_code_hash', (q) =>
				q.eq('sharingCodeHash', hashGuestCredential('sharingCode', sharingCode))
			)
			.first();

		if (!guest || guest.expiresAt < Date.now()) {
			return {
				success: false,
				message: { key: 'GenericMessages.GUEST_SHARING_CODE_INVALID' }
			};
		}

		const accommodation = await ctx.db.get(guest.accommodationId);
		if (accommodation) {
			await analytics.writeTrack(ctx, {
				name: 'guest.returned',
				organizationId: accommodation.ownerId,
				scopes: [
					{
						scopeType: 'organization',
						scopeId: createAnalyticsScopeId('accommodationOwner', accommodation.ownerId)
					}
				],
				properties: {
					accommodationId: accommodation._id,
					accommodationName: accommodation.name
				}
			});
		}

		return {
			success: true,
			message: { key: 'GenericMessages.GUEST_SHARED_ACCESS_GRANTED' },
			data: {
				signedCookie: await signGuestStayCookie({
					sharingCode,
					expiresAt: guest.expiresAt
				}),
				expiresAt: guest.expiresAt
			}
		};
	}
});
