// LIBRARIES
import { v } from 'convex/values';

/**
 * Field validators for `guests` — anonymous guest sessions after QR activation.
 */
export const guestFields = {
	sessionTokenHash: v.string(),
	sharingCodeHash: v.string(),
	accommodationId: v.id('accommodations'),
	expiresAt: v.number(),
	createdAt: v.number(),
	lastSeenAt: v.number()
};
