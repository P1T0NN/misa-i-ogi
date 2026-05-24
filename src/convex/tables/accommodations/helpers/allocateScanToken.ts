// HELPERS
import { convexGenerateScanToken } from '@/convex/tables/accommodations/utils/convexGenerateScanToken';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';

/** Allocates a unique `scanToken`, retrying on the astronomically rare collision. */
export async function allocateScanToken(ctx: MutationCtx): Promise<string | null> {
	for (let attempt = 0; attempt < 8; attempt++) {
		const scanToken = convexGenerateScanToken();
		const existing = await ctx.db
			.query('accommodations')
			.withIndex('by_scan_token', (q) => q.eq('scanToken', scanToken))
			.unique();
		if (!existing) return scanToken;
	}
	return null;
}
