// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { getOwnedAccommodation } from '@/convex/tables/accommodations/helpers/getOwnedAccommodation';

const accommodationForEditValidator = v.object({
	_id: v.id('accommodations'),
	name: v.string(),
	type: v.union(
		v.literal('apartment'),
		v.literal('hotel'),
		v.literal('villa'),
		v.literal('hostel'),
		v.literal('other')
	),
	address: v.string(),
	city: v.string(),
	country: v.string(),
	description: v.optional(v.string()),
	isActive: v.boolean(),
	coverImageUrl: v.string(),
	scanToken: v.string()
});

/** Owner-scoped accommodation row for the edit form (includes scan token for QR preview). */
export const fetchMyAccommodationForEdit = query({
	args: {
		accommodationId: v.id('accommodations')
	},
	returns: v.union(accommodationForEditValidator, v.null()),
	handler: async (ctx, args) => {
		const ownerId = await getAuthUserId(ctx);
		if (!ownerId) {
			return null;
		}

		const doc = await getOwnedAccommodation(ctx, args.accommodationId, ownerId);
		if (!doc) {
			return null;
		}

		return {
			_id: doc._id,
			name: doc.name,
			type: doc.type,
			address: doc.address,
			city: doc.city,
			country: doc.country,
			description: doc.description,
			isActive: doc.isActive,
			coverImageUrl: doc.coverImageUrl,
			scanToken: doc.scanToken
		};
	}
});
