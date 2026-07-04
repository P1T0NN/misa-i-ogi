// LIBRARIES
import { v } from 'convex/values';
import { adminMutation } from '@/convex/auth/middleware/authMiddleware';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Admin-only visibility toggle — the ONLY write path for
 * `hospitalities.visibility`. Owners deliberately get no lever: a
 * user-created hospitality stays `private` (invisible in other users'
 * connect flows) until an admin publishes it here.
 */
export const setHospitalityVisibility = adminMutation('setHospitalityVisibility')({
	args: {
		hospitalityId: v.id('hospitalities'),
		visibility: v.union(v.literal('private'), v.literal('public'))
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const hospitality = await ctx.db.get(args.hospitalityId);
		if (!hospitality) {
			return { success: false, message: { key: 'GenericMessages.HOSPITALITY_NOT_FOUND' } };
		}

		await ctx.db.patch(args.hospitalityId, { visibility: args.visibility });

		ctx.audit(AUDIT_ACTIONS.HOSPITALITY_VISIBILITY_UPDATE, {
			resource: { table: 'hospitalities', id: args.hospitalityId },
			before: { visibility: hospitality.visibility ?? 'public' },
			after: { visibility: args.visibility }
		});

		return { success: true, message: { key: 'GenericMessages.HOSPITALITY_VISIBILITY_UPDATED' } };
	}
});
