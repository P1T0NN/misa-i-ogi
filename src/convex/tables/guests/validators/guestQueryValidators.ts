// LIBRARIES
import { pick } from 'convex-helpers';
import { v } from 'convex/values';

// HELPERS
import { createProjection } from '@/convex/helpers/createProjection';

// SCHEMA
import { guestFields } from '@/convex/tables/guests/schemas/guestsSchemas';

/** Public-safe guest session row — excludes `sessionTokenHash` and `sharingCodeHash`. */
export const guestSessionSafe = createProjection({
	_id: v.id('guests'),
	...pick(guestFields, ['accommodationId', 'expiresAt', 'createdAt', 'lastSeenAt'])
});

export const currentGuestValidator = v.object({
	status: v.union(v.literal('active'), v.literal('expired'), v.literal('missing')),
	guest: v.union(guestSessionSafe.validator, v.null())
});
