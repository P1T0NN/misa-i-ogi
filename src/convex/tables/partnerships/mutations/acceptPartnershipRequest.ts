// LIBRARIES
import { v } from 'convex/values';
import { authMutation } from '@/convex/auth/middleware/authMiddleware';

// CONFIG
import { CUSTOM_PARTNERSHIP_ENABLED } from '@/shared/config.js';

// HELPERS
import { analytics } from '@/convex/analytics';
import { customPartnershipsCounterKey } from '@/convex/helpers/counterKeys';
import { ensureCustomPartnershipAccess } from '@/convex/tables/partnerships/helpers/ensureCustomPartnershipAccess';
import { insertPartnership } from '@/convex/tables/partnerships/helpers/insertPartnership';
import { reactivatePartnership } from '@/convex/tables/partnerships/helpers/reactivatePartnership';
import { isPlatformHospitality } from '@/convex/tables/hospitalities/utils/isPlatformHospitality';

// UTILS
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
		if (!CUSTOM_PARTNERSHIP_ENABLED) {
			return { success: false, message: { key: 'GenericMessages.FORBIDDEN' } };
		}

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
		if (isPlatformHospitality(hospitality)) {
			return {
				success: false,
				message: { key: 'GenericMessages.PARTNERSHIP_PLATFORM_HOSPITALITY_IMPLICIT' }
			};
		}

		const existingPartnership = await ctx.db
			.query('partnerships')
			.withIndex('by_pair', (q) =>
				q.eq('accommodationId', request.accommodationId).eq('hospitalityId', request.hospitalityId)
			)
			.unique();

		// An admin may have linked the pair while the request sat in the queue —
		// resolve without inserting a duplicate or consuming quota.
		if (existingPartnership?.isActive) {
			await ctx.db.patch(request._id, { status: 'accepted', respondedAt: Date.now() });
			return { success: true, message: { key: 'GenericMessages.PARTNERSHIP_REQUEST_ACCEPTED' } };
		}

		// Trial belongs to the requester (accommodation owner) — accepting is what
		// makes the link active, so this is also where their trial clock starts.
		const accessFailure = await ensureCustomPartnershipAccess(ctx, request.accommodationOwnerId);
		if (accessFailure) return accessFailure;

		await ctx.db.patch(request._id, { status: 'accepted', benefit, respondedAt: Date.now() });

		if (existingPartnership) {
			await reactivatePartnership(ctx, {
				partnershipId: existingPartnership._id,
				partnership: existingPartnership,
				accommodationOwnerId: accommodation.ownerId,
				hospitalityOwnerId: hospitality.ownerId,
				benefit,
				actorId: ctx.userId,
				auditMetadata: { partnershipRequestId: request._id }
			});
			return { success: true, message: { key: 'GenericMessages.PARTNERSHIP_REQUEST_ACCEPTED' } };
		}

		const { event } = await insertPartnership(ctx, {
			accommodation,
			hospitality,
			benefit,
			createType: 'custom',
			actorId: ctx.userId,
			auditMetadata: { partnershipRequestId: request._id }
		});
		await analytics.counters.bump(
			ctx,
			customPartnershipsCounterKey(request.accommodationOwnerId),
			1
		);
		await analytics.track(ctx, event);

		return { success: true, message: { key: 'GenericMessages.PARTNERSHIP_REQUEST_ACCEPTED' } };
	}
});
