// LIBRARIES
import { query } from '../../_generated/server';
import { authComponent } from '../auth';
import { isGuestStayIdentity } from '@/convex/tables/guests/utils/isGuestStayIdentity';

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (isGuestStayIdentity(identity)) {
			return null;
		}

		const user = await authComponent.safeGetAuthUser(ctx);
		return user ?? null;
	}
});
