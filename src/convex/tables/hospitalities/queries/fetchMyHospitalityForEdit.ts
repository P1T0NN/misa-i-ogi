// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { getHospitalityForEdit } from '@/convex/tables/hospitalities/helpers/getHospitalityForEdit';
import { hospitalityForEdit } from '@/convex/tables/hospitalities/validators/hospitalityQueryValidators';

/** Owner- or admin-scoped hospitality row for the edit form. */
export const fetchMyHospitalityForEdit = query({
	args: {
		hospitalityId: v.id('hospitalities')
	},
	returns: v.union(hospitalityForEdit.validator, v.null()),
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			return null;
		}

		const doc = await getHospitalityForEdit(ctx, args.hospitalityId, userId);
		if (!doc) {
			return null;
		}

		return hospitalityForEdit.project(doc);
	}
});
