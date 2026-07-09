// LIBRARIES
import { v } from 'convex/values';

/**
 * Field validators for `proTrials` — one account-level free trial row per user.
 */
export const proTrialFields = {
	/** better-auth user id. */
	userId: v.string(),
	/** Scheduled end of the trial — creation time + the trial duration. */
	endsAt: v.number(),
	/** When the expiry cron swept this trial; unset = not yet handled. */
	expiredAt: v.optional(v.number())
};
