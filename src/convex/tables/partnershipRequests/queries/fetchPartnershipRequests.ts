// LIBRARIES
import { ConvexError } from 'convex/values';
import { query } from '@/convex/_generated/server';

// UTILS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';

// TYPES
import type {
	typesPartnershipRequestItem,
	typesPartnershipRequestsResult
} from '@/features/partnerships/types/partnershipsTypes';
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type { Doc } from '@/convex/_generated/dataModel';
import type { QueryCtx } from '@/convex/_generated/server';

async function enrich(
	ctx: QueryCtx,
	requests: Doc<'partnershipRequests'>[]
): Promise<typesPartnershipRequestItem[]> {
	return Promise.all(
		requests.map(async (request) => {
			const [accommodation, hospitality] = await Promise.all([
				ctx.db.get(request.accommodationId),
				ctx.db.get(request.hospitalityId)
			]);
			return {
				requestId: request._id,
				status: request.status,
				requestedAt: request._creationTime,
				respondedAt: request.respondedAt ?? null,
				accommodationName: accommodation?.name ?? null,
				hospitalityName: hospitality?.name ?? null
			};
		})
	);
}

/**
 * Everything the partnerships hub's Sent/Received tabs need in one
 * subscription: both directions in a single call, split server-side.
 *
 * Not `fetchOptimized` on purpose — that helper paginates ONE index and
 * returns raw docs; this needs two indexes (sent + received) plus name
 * enrichment. The table is per-user tiny, so two indexed `.collect()`s are
 * fine.
 */
export const fetchPartnershipRequests = query({
	args: {},
	handler: async (ctx): Promise<typesPartnershipRequestsResult> => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new ConvexError({
				code: 'NOT_AUTHENTICATED',
				message: { key: 'GenericMessages.NOT_AUTHENTICATED' }
			} satisfies ConvexErrorPayload);
		}

		const [sentDocs, receivedDocs] = await Promise.all([
			ctx.db
				.query('partnershipRequests')
				.withIndex('by_accommodation_owner_status', (q) => q.eq('accommodationOwnerId', userId))
				.order('desc')
				.collect(),
			ctx.db
				.query('partnershipRequests')
				.withIndex('by_hospitality_owner_status', (q) =>
					q.eq('hospitalityOwnerId', userId).eq('status', 'pending')
				)
				.order('desc')
				.collect()
		]);

		const [sent, received] = await Promise.all([enrich(ctx, sentDocs), enrich(ctx, receivedDocs)]);
		return { sent, received };
	}
});
