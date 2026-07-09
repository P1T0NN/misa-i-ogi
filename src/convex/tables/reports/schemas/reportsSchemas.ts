// LIBRARIES
import { v } from 'convex/values';

/**
 * Field validators for `reports` — user-submitted bug reports / ideas / feedback
 * from the public `/report` page. Write-once rows: created by anyone (anonymous
 * included), read only by admins.
 */
export const reportFields = {
	category: v.union(v.literal('bug'), v.literal('idea'), v.literal('other')),
	message: v.string(),
	/** Optional contact for follow-up. Normalized (trimmed/lowercased) at write time. */
	email: v.optional(v.string()),
	/** Better-auth user id when the reporter was signed in; absent for anonymous reports. */
	userId: v.optional(v.string())
};
