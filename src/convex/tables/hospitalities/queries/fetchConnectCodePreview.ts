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

const previewValidator = v.object({
	hospitalityName: v.string(),
	hospitalityCity: v.string(),
	isOwnHospitality: v.boolean()
});

/**
 * Resolve a connect code for the create-partnership form — ownership drives
 * whether the client collects a benefit (instant own-venue) or sends a request.
 */
export const fetchConnectCodePreview = query({
	args: { connectCode: v.string() },
	returns: v.union(previewValidator, v.null()),
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) return null;

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
