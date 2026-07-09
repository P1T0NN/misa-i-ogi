// HELPERS
import { analytics } from '@/convex/analytics';
import { customPartnershipsCounterKey } from '@/convex/helpers/counterKeys';
import { bumpActivePartnershipsForOwners } from '@/convex/helpers/ownerCounterHelpers';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { Doc } from '@/convex/_generated/dataModel';

/**
 * Reverse the per-owner counters a single ACTIVE partnership contributed to:
 * `activePartnerships` for both owners and, for custom links, `customPartnerships`
 * for the accommodation owner. No-op for inactive rows (they never incremented
 * those counters). Mirrors the increments in `createCustomPartnership` /
 * `acceptPartnershipRequest` so every delete path — admin bulk delete and
 * venue-cascade deletes — stays counter-consistent with `revokePartnership`.
 *
 * Reads the denormalized owner ids and falls back to a parent lookup only for
 * legacy rows written before `backfillPartnershipOwnerIds`.
 */
export async function decrementActivePartnershipCounters(
	ctx: MutationCtx,
	partnership: Doc<'partnerships'>
): Promise<void> {
	if (!partnership.isActive) return;

	const accOwner =
		partnership.accommodationOwnerId ?? (await ctx.db.get(partnership.accommodationId))?.ownerId;
	const hospOwner =
		partnership.hospitalityOwnerId ?? (await ctx.db.get(partnership.hospitalityId))?.ownerId;

	if (accOwner && hospOwner) {
		await bumpActivePartnershipsForOwners(ctx, accOwner, hospOwner, -1);
	}
	if (partnership.createType === 'custom' && accOwner) {
		await analytics.counters.bump(ctx, customPartnershipsCounterKey(accOwner), -1);
	}
}
