// LIBRARIES
import { v } from 'convex/values';
import { authMutation } from '@/convex/auth/middleware/authMiddleware';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// HELPERS
import { analytics } from '@/convex/analytics';
import { customPartnershipsCounterKey } from '@/convex/helpers/counterKeys';
import { ensureCustomPartnershipAccess } from '@/convex/tables/partnerships/helpers/ensureCustomPartnershipAccess';

// UTILS
import { createAnalyticsScopeId } from '@piton-/analytics-convex';
import { parsePartnershipBenefit } from '@/convex/tables/partnerships/utils/parsePartnershipBenefit';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Hospitality owner accepts a pending cross-owner partnership request. The
 * accepting owner supplies the guest-facing `benefit` — the offer is the
 * venue's call, not the requester's. The trial/plan gate runs against the
 * *accommodation* owner (the trial belongs to their side); on gate failure the
 * request stays `pending` so it can be retried after an upgrade.
 */
export const acceptPartnershipRequest = authMutation('acceptPartnershipRequest')({
	args: {
		requestId: v.id('partnershipRequests'),
		benefit: v.string()
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const request = await ctx.db.get(args.requestId);
		if (!request || request.hospitalityOwnerId !== ctx.userId) {
			return { success: false, message: { key: 'GenericMessages.PARTNERSHIP_REQUEST_NOT_FOUND' } };
		}

		if (request.status !== 'pending') {
			return {
				success: false,
				message: { key: 'GenericMessages.PARTNERSHIP_REQUEST_ALREADY_PROCESSED' }
			};
		}

		const benefit = parsePartnershipBenefit(args.benefit);
		if (!benefit) {
			return { success: false, message: { key: 'GenericMessages.PARTNERSHIP_BENEFIT_INVALID' } };
		}

		const [accommodation, hospitality] = await Promise.all([
			ctx.db.get(request.accommodationId),
			ctx.db.get(request.hospitalityId)
		]);
		if (!accommodation) {
			return { success: false, message: { key: 'GenericMessages.ACCOMMODATION_NOT_FOUND' } };
		}
		if (!hospitality) {
			return { success: false, message: { key: 'GenericMessages.HOSPITALITY_NOT_FOUND' } };
		}

		// An admin may have linked the pair while the request sat in the queue —
		// resolve the request without inserting a duplicate or consuming quota.
		const existingPartnership = await ctx.db
			.query('partnerships')
			.withIndex('by_pair', (q) =>
				q.eq('accommodationId', request.accommodationId).eq('hospitalityId', request.hospitalityId)
			)
			.unique();
		if (existingPartnership) {
			await ctx.db.patch(request._id, { status: 'accepted', respondedAt: Date.now() });
			return { success: true, message: { key: 'GenericMessages.PARTNERSHIP_REQUEST_ACCEPTED' } };
		}

		// Trial belongs to the requester (accommodation owner) — accepting is what
		// makes the link active, so this is also where their trial clock starts.
		const accessFailure = await ensureCustomPartnershipAccess(ctx, request.accommodationOwnerId);
		if (accessFailure) return accessFailure;

		await ctx.db.patch(request._id, { status: 'accepted', benefit, respondedAt: Date.now() });

		const partnershipId = await ctx.db.insert('partnerships', {
			accommodationId: request.accommodationId,
			accommodationScanToken: accommodation.scanToken,
			hospitalityId: request.hospitalityId,
			benefit,
			createType: 'custom',
			isActive: true
		});
		await analytics.counters.bump(
			ctx,
			customPartnershipsCounterKey(request.accommodationOwnerId),
			1
		);

		ctx.audit(AUDIT_ACTIONS.PARTNERSHIP_CREATE, {
			resource: { table: 'partnerships', id: partnershipId },
			after: {
				accommodationId: request.accommodationId,
				accommodationScanToken: accommodation.scanToken,
				hospitalityId: request.hospitalityId,
				benefit,
				isActive: true
			},
			metadata: { partnershipRequestId: request._id }
		});

		await analytics.track(ctx, 'partnership.created', {
			subject: { type: 'hospitality', id: hospitality._id },
			organizationId: accommodation.ownerId,
			scopes: [
				{ scopeType: 'organization', scopeId: hospitality.ownerId },
				{
					scopeType: 'organization',
					scopeId: createAnalyticsScopeId('accommodationOwner', accommodation.ownerId)
				},
				{
					scopeType: 'organization',
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
		});

		return { success: true, message: { key: 'GenericMessages.PARTNERSHIP_REQUEST_ACCEPTED' } };
	}
});
