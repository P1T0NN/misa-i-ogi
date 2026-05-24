// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { getOwnedHospitality } from '@/convex/tables/hospitalities/helpers/getOwnedHospitality';

const hospitalityForEditValidator = v.object({
	_id: v.id('hospitalities'),
	name: v.string(),
	type: v.union(
		v.literal('restaurant'),
		v.literal('cafe'),
		v.literal('bar'),
		v.literal('night_club'),
		v.literal('horse_ride'),
		v.literal('spa'),
		v.literal('tour'),
		v.literal('other')
	),
	address: v.string(),
	city: v.string(),
	country: v.string(),
	description: v.string(),
	contactPhone: v.string(),
	contactEmail: v.optional(v.string()),
	website: v.optional(v.string()),
	reservationRequestsEnabled: v.optional(v.boolean()),
	isActive: v.boolean(),
	coverImageUrl: v.optional(v.string())
});

/** Owner-scoped hospitality row for the edit form. */
export const fetchMyHospitalityForEdit = query({
	args: {
		hospitalityId: v.id('hospitalities')
	},
	returns: v.union(hospitalityForEditValidator, v.null()),
	handler: async (ctx, args) => {
		const ownerId = await getAuthUserId(ctx);
		if (!ownerId) {
			return null;
		}

		const doc = await getOwnedHospitality(ctx, args.hospitalityId, ownerId);
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
			contactPhone: doc.contactPhone,
			contactEmail: doc.contactEmail,
			website: doc.website,
			reservationRequestsEnabled: doc.reservationRequestsEnabled,
			isActive: doc.isActive,
			coverImageUrl: doc.coverImageUrl
		};
	}
});
