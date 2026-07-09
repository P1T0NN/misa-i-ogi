// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import {
	CONNECT_CODE_LENGTH,
	normalizeConnectCode
} from '@/convex/tables/hospitalities/helpers/connectCode';

// UTILS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { checkRateLimit } from '@/convex/rateLimits/enforceRateLimit';
import { CUSTOM_PARTNERSHIP_ENABLED } from '@/shared/config.js';

const customPartnershipFormVenueLookupValidator = v.object({
	hospitalityName: v.string(),
	hospitalityCity: v.string(),
	isOwnHospitality: v.boolean()
});

/**
 * Read-only lookup for the **create-custom-partnership form** only.
 *
 * When the user finishes typing a connect code, the client calls this to:
 * - show the matched venue name + city (preview card),
 * - decide whether the benefit field is required (caller owns the venue),
 * - pick the correct submit label (instant connect vs send request).
 *
 * This does **not** create or change anything — {@link createCustomPartnership}
 * is the sole write path.
 */
export const lookupCustomPartnershipFormVenueByConnectCode = query({
	args: { connectCode: v.string() },
	returns: v.union(customPartnershipFormVenueLookupValidator, v.null()),
	handler: async (ctx, args) => {
		if (!CUSTOM_PARTNERSHIP_ENABLED) return null;

		const userId = await getAuthUserId(ctx);
		if (!userId) return null;

		await checkRateLimit(ctx, 'lookupCustomPartnershipFormVenueByConnectCode', userId);

		const code = normalizeConnectCode(args.connectCode);
		if (code.length !== CONNECT_CODE_LENGTH) return null;

		const hospitality = await ctx.db
			.query('hospitalities')
			.withIndex('by_connect_code', (q) => q.eq('connectCode', code))
			.first();
		if (!hospitality?.isActive) return null;

		return {
			hospitalityName: hospitality.name,
			hospitalityCity: hospitality.city,
			isOwnHospitality: hospitality.ownerId === userId
		};
	}
});
