// LIBRARIES
import { v } from 'convex/values';
import { mutation } from '@/convex/_generated/server';

// HELPERS
import { getActiveGuestSession } from '@/convex/tables/guests/helpers/getActiveGuestSession';

// UTILS
import {
	generateGuestCredential,
	hashGuestCredential
} from '@/convex/tables/guests/utils/guestSessionToken';
import {
	signGuestStayCookie,
	verifyGuestSessionCookie
} from '@/convex/tables/guests/utils/guestStayCookieCrypto';

const createGuestSharingCodeResult = v.union(
	v.object({
		sharingCode: v.string(),
		signedCookie: v.string(),
		expiresAt: v.number()
	}),
	v.object({
		status: v.literal('missing')
	})
);

/**
 * Backfills a sharing code for legacy guest rows missing `sharingCodeHash`.
 * Only a signed cookie containing the original activation token can bootstrap a code.
 */
export const createGuestSharingCode = mutation({
	args: {
		guestStayCookie: v.string()
	},
	returns: createGuestSharingCodeResult,
	handler: async (ctx, args) => {
		const guest = await getActiveGuestSession(ctx, args.guestStayCookie);
		const payload = await verifyGuestSessionCookie(args.guestStayCookie);

		if (!guest || !payload?.sessionToken) {
			return { status: 'missing' as const };
		}
		if (guest.sharingCodeHash) {
			return { status: 'missing' as const };
		}

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

		await ctx.db.patch(guest._id, { sharingCodeHash });

		const signedCookie = await signGuestStayCookie({
			sessionToken: payload.sessionToken,
			expiresAt: guest.expiresAt,
			sharingCode
		});

		return {
			sharingCode,
			signedCookie,
			expiresAt: guest.expiresAt
		};
	}
});
