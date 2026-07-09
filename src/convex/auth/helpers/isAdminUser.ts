// UTILS
import { authComponent } from '@/convex/auth/auth';

// TYPES
import type { ActionCtx, MutationCtx, QueryCtx } from '@/convex/_generated/server';

/** Whether the signed-in caller has `role: 'admin'`. */
export async function isAdminUser(ctx: QueryCtx | MutationCtx | ActionCtx): Promise<boolean> {
	const user = await authComponent.safeGetAuthUser(ctx);
	return user?.role === 'admin';
}
