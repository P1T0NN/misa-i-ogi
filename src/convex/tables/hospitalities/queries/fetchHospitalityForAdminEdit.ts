// LIBRARIES
import { v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { requireAdmin } from '@/convex/auth/middleware/authMiddleware';
import { hospitalityForAdminEdit } from '@/convex/tables/hospitalities/validators/hospitalityQueryValidators';

/**
 * Admin-only hospitality row for the admin edit form. Unlike `fetchMyHospitalityForEdit`,
 * this requires an admin caller and returns the admin-only levers (`benefit`,
 * `createType`) needed to prefill the admin form.
 */
export const fetchHospitalityForAdminEdit = query({
	args: {
		hospitalityId: v.id('hospitalities')
	},
	returns: v.union(hospitalityForAdminEdit.validator, v.null()),
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const doc = await ctx.db.get(args.hospitalityId);
		if (!doc) {
			return null;
		}

		return hospitalityForAdminEdit.project(doc);
	}
});
