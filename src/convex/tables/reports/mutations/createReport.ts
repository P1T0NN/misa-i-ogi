// LIBRARIES
import { v } from 'convex/values';
import { mutation } from '@/convex/_generated/server';
import { enforceRateLimit } from '@/convex/rateLimits/enforceRateLimit';
import { rateLimitKey } from '@/convex/rateLimits/keys';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';

// UTILS
import {
	normalizeOptionalEmail,
	normalizeRequiredString
} from '@/convex/utils/convexValidationUtils';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

const MAX_MESSAGE_LENGTH = 5000;

/**
 * Public report form (`/report`) — anyone, including anonymous visitors, can
 * file a bug / idea / feedback row. Reports are write-only from here; admins
 * read them via `fetchReports`.
 *
 * Rate limit: signed-in callers get a per-user bucket; all anonymous callers
 * share one global bucket — coarse, but this endpoint does one bounded insert
 * and the form is not on any hot path.
 */
export const createReport = mutation({
	args: {
		category: v.union(v.literal('bug'), v.literal('idea'), v.literal('other')),
		message: v.string(),
		email: v.optional(v.string())
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const message = normalizeRequiredString(args.message, { maxLength: MAX_MESSAGE_LENGTH });
		const email = normalizeOptionalEmail(args.email);
		if (!message || email === null) {
			return {
				success: false,
				message: { key: 'GenericMessages.YOU_NEED_TO_CORRECT_FORM_ERRORS' }
			};
		}

		const userId = await getAuthUserId(ctx);
		// Raw user id as key matches `convexGetRateLimitedUserId`'s convention.
		await enforceRateLimit(ctx, 'createReport', userId ?? rateLimitKey.anonymous);

		await ctx.db.insert('reports', {
			category: args.category,
			message,
			...(email ? { email } : {}),
			...(userId ? { userId } : {})
		});

		return { success: true, message: { key: 'GenericMessages.REPORT_CREATED' } };
	}
});
