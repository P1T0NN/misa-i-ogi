// HELPERS
import { analytics } from '@/convex/analytics';
import { COUNTER_KEYS } from '@/convex/helpers/counterKeys';
import { bumpActivePartnershipsForOwners } from '@/convex/helpers/ownerCounterHelpers';
import { logAudit } from '@/convex/tables/auditLog/helpers/logAudit';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// UTILS
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { Doc } from '@/convex/_generated/dataModel';

type InsertPartnershipArgs = {
	accommodation: Doc<'accommodations'>;
	hospitality: Doc<'hospitalities'>;
	benefit: string;
	/** Omit for platform/admin links; `'custom'` for the self-service quota'd ones. */
	createType?: 'custom';
	/** Caller (for the audit row). Every create path uses the authenticated `ctx.userId`. */
	actorId: string;
	/** Extra audit metadata, e.g. the originating partnership request id. */
	auditMetadata?: Record<string, unknown>;
};

/**
 * Single choke point for creating a `partnerships` row — the partnership analogue
 * of `createAccommodationForOwner`. Inserts the row, keeps `partnerships.total`
 * in step (+1), and writes the create audit. Returns the built
 * `partnership.created` analytics event instead of tracking it, so single-create
 * callers can `analytics.track` it immediately while the bulk admin create can
 * collect events and fire one batched `track`.
 *
 * The per-owner custom-partnership quota counter is NOT bumped here — it only
 * applies to `custom` links, so it stays at those two call sites.
 */
export async function insertPartnership(
	ctx: MutationCtx,
	{ accommodation, hospitality, benefit, createType, actorId, auditMetadata }: InsertPartnershipArgs
) {
	const row = {
		accommodationId: accommodation._id,
		accommodationScanToken: accommodation.scanToken,
		accommodationOwnerId: accommodation.ownerId,
		hospitalityId: hospitality._id,
		hospitalityOwnerId: hospitality.ownerId,
		benefit,
		...(createType ? { createType } : {}),
		isActive: true
	};

	const partnershipId = await ctx.db.insert('partnerships', row);
	await analytics.counters.bump(ctx, COUNTER_KEYS.PARTNERSHIPS_TOTAL, 1);
	await bumpActivePartnershipsForOwners(ctx, accommodation.ownerId, hospitality.ownerId, 1);

	logAudit(ctx, AUDIT_ACTIONS.PARTNERSHIP_CREATE, {
		userId: actorId,
		resource: { table: 'partnerships', id: partnershipId },
		after: row,
		...(auditMetadata ? { metadata: auditMetadata } : {})
	});

	const event = {
		name: 'partnership.created' as const,
		subject: { type: 'hospitality' as const, id: hospitality._id },
		organizationId: accommodation.ownerId,
		scopes: [
			{ scopeType: 'organization' as const, scopeId: hospitality.ownerId },
			{
				scopeType: 'organization' as const,
				scopeId: createAnalyticsScopeId('accommodationOwner', accommodation.ownerId)
			},
			{
				scopeType: 'organization' as const,
				scopeId: createAnalyticsScopeId('hospitalityOwner', hospitality.ownerId)
			}
		],
		properties: {
			accommodationId: accommodation._id,
			accommodationName: accommodation.name,
			hospitalityId: hospitality._id,
			hospitalityName: hospitality.name,
			benefit,
			partnershipDelta: 1
		}
	};

	return { partnershipId, event };
}
