// HELPERS
import { generateConnectCode } from './connectCode';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';

const MAX_ATTEMPTS = 10;

/**
 * Generate a connect code not already used by another hospitality. Checks the
 * `by_connect_code` index each try; within one mutation Convex reads see prior
 * writes, so a backfill patching row-by-row stays collision-free too.
 */
export async function generateUniqueConnectCode(ctx: MutationCtx): Promise<string> {
	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const code = generateConnectCode();
		const existing = await ctx.db
			.query('hospitalities')
			.withIndex('by_connect_code', (q) => q.eq('connectCode', code))
			.first();
		if (!existing) return code;
	}
	throw new Error('Failed to generate a unique hospitality connect code');
}
