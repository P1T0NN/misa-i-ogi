// LIBRARIES
import { v } from 'convex/values';
import { authMutation } from '@/convex/auth/middleware/authMiddleware';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// CONFIG
import { CUSTOM_PARTNERSHIP_ENABLED } from '@/shared/config.js';

// HELPERS
import { analytics } from '@/convex/analytics';
import { customPartnershipsCounterKey } from '@/convex/helpers/counterKeys';
import { ensureCustomPartnershipAccess } from '@/convex/tables/partnerships/helpers/ensureCustomPartnershipAccess';
import { normalizeConnectCode } from '@/convex/tables/hospitalities/helpers/connectCode';
import { parsePartnershipBenefit } from '@/convex/tables/partnerships/utils/parsePartnershipBenefit';

// UTILS
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Self-service partnership creation, keyed by the target venue's connect code
 * (no venue pool to browse). Branches server-side on ownership:
 *
 * - Caller owns the coded hospitality → instant: trial/plan gate
 *   ({@link ensureCustomPartnershipAccess} — may START the 1-month trial),
 *   insert into `partnerships`, bump the analytics counter.
 * - Someone else owns it → a `partnershipRequests` row instead; the
 *   hospitality owner accepts/declines via {@link acceptPartnershipRequest}.
 *   Requests are free — the trial clock only ever starts on activation.
 *
 * Knowing the connect code IS the authorization to request — no visibility gate,
 * since the code is exactly how an owner shares a private venue.
 */
export const createCustomPartnership = authMutation('createCustomPartnership')({
	args: {
		accommodationId: v.id('accommodations'),
		connectCode: v.string(),
		benefit: v.optional(v.string())
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		if (!CUSTOM_PARTNERSHIP_ENABLED) {
			return { success: false, message: { key: 'GenericMessages.FORBIDDEN' } };
		}

		const accommodation = await ctx.db.get(args.accommodationId);
		if (!accommodation || accommodation.ownerId !== ctx.userId) {
			return { success: false, message: { key: 'GenericMessages.ACCOMMODATION_NOT_FOUND' } };
		}

		const hospitality = await ctx.db
			.query('hospitalities')
			.withIndex('by_connect_code', (q) =>
				q.eq('connectCode', normalizeConnectCode(args.connectCode))
			)
			.first();
		if (!hospitality || !hospitality.isActive) {
			return { success: false, message: { key: 'GenericMessages.HOSPITALITY_NOT_FOUND' } };
		}

		const isOwnHospitality = hospitality.ownerId === ctx.userId;

		const existingPartnership = await ctx.db
			.query('partnerships')
			.withIndex('by_pair', (q) =>
				q.eq('accommodationId', args.accommodationId).eq('hospitalityId', hospitality._id)
			)
			.unique();
		if (existingPartnership) {
			return { success: false, message: { key: 'GenericMessages.PARTNERSHIP_PAIR_EXISTS' } };
		}

		const existingRequests = await ctx.db
			.query('partnershipRequests')
			.withIndex('by_pair', (q) =>
				q.eq('accommodationId', args.accommodationId).eq('hospitalityId', hospitality._id)
			)
			.collect();
		if (existingRequests.some((request) => request.status === 'pending')) {
			return {
				success: false,
				message: { key: 'GenericMessages.PARTNERSHIP_REQUEST_ALREADY_PENDING' }
			};
		}

		if (!isOwnHospitality) {
			const requestId = await ctx.db.insert('partnershipRequests', {
				accommodationId: args.accommodationId,
				accommodationOwnerId: ctx.userId,
				hospitalityId: hospitality._id,
				hospitalityOwnerId: hospitality.ownerId,
				status: 'pending'
			});

			ctx.audit(AUDIT_ACTIONS.PARTNERSHIP_REQUEST_CREATE, {
				resource: { table: 'partnershipRequests', id: requestId },
				after: {
					accommodationId: args.accommodationId,
					hospitalityId: hospitality._id,
					hospitalityOwnerId: hospitality.ownerId,
					status: 'pending'
				}
			});

			await analytics.track(ctx, 'partnership.request.created', {
				subject: { type: 'hospitality', id: hospitality._id },
				organizationId: ctx.userId,
				scopes: [
					{
						scopeType: 'organization',
						scopeId: createAnalyticsScopeId('accommodationOwner', ctx.userId)
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
					hospitalityName: hospitality.name
				}
			});

			return { success: true, message: { key: 'GenericMessages.PARTNERSHIP_REQUEST_SENT' } };
		}

		const accessFailure = await ensureCustomPartnershipAccess(ctx, ctx.userId);
		if (accessFailure) return accessFailure;

		const benefit = parsePartnershipBenefit(args.benefit ?? '');
		if (!benefit) {
			return { success: false, message: { key: 'GenericMessages.PARTNERSHIP_BENEFIT_INVALID' } };
		}

		const partnershipId = await ctx.db.insert('partnerships', {
			accommodationId: args.accommodationId,
			accommodationScanToken: accommodation.scanToken,
			hospitalityId: hospitality._id,
			benefit,
			createType: 'custom',
			isActive: true
		});
		await analytics.counters.bump(ctx, customPartnershipsCounterKey(ctx.userId), 1);

		ctx.audit(AUDIT_ACTIONS.PARTNERSHIP_CREATE, {
			resource: { table: 'partnerships', id: partnershipId },
			after: {
				accommodationId: args.accommodationId,
				accommodationScanToken: accommodation.scanToken,
				hospitalityId: hospitality._id,
				benefit,
				createType: 'custom',
				isActive: true
			}
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

		return { success: true, message: { key: 'GenericMessages.PARTNERSHIP_CREATED' } };
	}
});
