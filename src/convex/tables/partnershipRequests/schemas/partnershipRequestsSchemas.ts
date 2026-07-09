// LIBRARIES
import { v } from 'convex/values';

/**
 * Field validators for `partnershipRequests` — pending cross-owner partnership queue.
 */
export const partnershipRequestFields = {
	accommodationId: v.id('accommodations'),
	/** Denormalized — "my sent requests" query. */
	accommodationOwnerId: v.string(),
	hospitalityId: v.id('hospitalities'),
	/** Denormalized — "my received requests" query. */
	hospitalityOwnerId: v.string(),
	status: v.union(v.literal('pending'), v.literal('accepted'), v.literal('declined')),
	/** Guest-facing offer — set by the hospitality owner on accept, never by the requester. */
	benefit: v.optional(v.string()),
	respondedAt: v.optional(v.number())
};
