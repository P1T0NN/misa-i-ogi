// HELPERS
import { analytics } from '@/convex/analytics';
import { COUNTER_KEYS } from '@/convex/helpers/counterKeys';

// TYPES
import type { QueryCtx } from '@/convex/_generated/server';

/**
 * O(1) exact count — reads the `guests.total` counter maintained
 * transactionally by `createGuest` instead of scanning the table (which would
 * also put every `guests` row in this reactive query's read set).
 */
export async function countGuests(ctx: QueryCtx) {
	return analytics.counters.get(ctx, COUNTER_KEYS.GUESTS_TOTAL);
}
