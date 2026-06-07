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
import { analytics } from '@/convex/analytics';

// UTILS
import {
	generateGuestCredential,
	hashGuestCredential
} from '@/convex/tables/guests/utils/guestSessionToken';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';
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

		const accommodationDoc = await ctx.db.get(accommodation._id);
		if (!accommodationDoc) {
			return {
				success: false,
				message: { key: 'GenericMessages.ACCOMMODATION_NOT_FOUND' }
			};
		}

		const now = Date.now();

		const existingGuests = await getGuestSessionsByAccommodationId(ctx, accommodation._id);

		const writeQrScan = async (actorId: string) => {
			await analytics.writeTrack(ctx, {
				name: 'qr.scanned',
				actorId,
				organizationId: accommodationDoc.ownerId,
				scopes: [
					{
						scopeType: 'organization',
						scopeId: createAnalyticsScopeId('accommodationOwner', accommodationDoc.ownerId)
					}
				],
				properties: {
					accommodationId: accommodation._id,
					accommodationName: accommodation.name,
					scanType: 'check-in'
				}
			});
		};

		for (const guest of existingGuests) {
			if (guest.expiresAt < now) {
				await ctx.db.delete(guest._id);
			}
		}

		const activeGuest = existingGuests.find((guest) => guest.expiresAt >= now);
		if (activeGuest) {
			await writeQrScan(activeGuest._id);
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

		const guestId = await ctx.db.insert('guests', {
			sessionTokenHash: hashGuestCredential('sessionToken', sessionToken),
			sharingCodeHash,
			accommodationId: accommodation._id,
			expiresAt,
			createdAt: now,
			lastSeenAt: now
		});

		await writeQrScan(guestId);

		await analytics.writeTrack(ctx, {
			name: 'guest.activated',
			actorId: guestId,
			organizationId: accommodationDoc.ownerId,
			scopes: [
				{
					scopeType: 'organization',
					scopeId: createAnalyticsScopeId('accommodationOwner', accommodationDoc.ownerId)
				}
			],
			properties: {
				accommodationId: accommodation._id,
				accommodationName: accommodation.name,
				accommodationType: accommodation.type
			}
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
