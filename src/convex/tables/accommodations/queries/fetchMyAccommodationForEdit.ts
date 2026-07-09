// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { getAccommodationForEdit } from '@/convex/tables/accommodations/helpers/getAccommodationForEdit';
import { accommodationForEdit } from '@/convex/tables/accommodations/validators/accommodationQueryValidators';

/** Owner- or admin-scoped accommodation row for the edit form (includes scan token for QR preview). */
export const fetchMyAccommodationForEdit = query({
	args: {
		accommodationId: v.id('accommodations')
	},
	returns: v.union(accommodationForEdit.validator, v.null()),
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			return null;
		}

		const doc = await getAccommodationForEdit(ctx, args.accommodationId, userId);
		if (!doc) {
			return null;
		}

		return accommodationForEdit.project(doc);
	}
});
