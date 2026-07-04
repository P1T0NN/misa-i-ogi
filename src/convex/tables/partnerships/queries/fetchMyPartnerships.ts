// LIBRARIES
import { ConvexError } from 'convex/values';
import { query } from '@/convex/_generated/server';

// UTILS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';

// TYPES
import type { typesPartnershipMyItem } from '@/features/partnerships/types/partnershipsTypes';
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type { Doc, Id } from '@/convex/_generated/dataModel';

/**
 * All active partnerships involving the caller — as accommodation owner AND as
 * hospitality owner (cross-owner links show up for both sides). Deduped, name
 * enriched, newest first. Per-user N is quota-bounded, so plain collects are fine.
 */
export const fetchMyPartnerships = query({
	args: {},
	handler: async (ctx): Promise<typesPartnershipMyItem[]> => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new ConvexError({
				code: 'NOT_AUTHENTICATED',
				message: { key: 'GenericMessages.NOT_AUTHENTICATED' }
			} satisfies ConvexErrorPayload);
		}

		const [accommodations, hospitalities] = await Promise.all([
			ctx.db
				.query('accommodations')
				.withIndex('by_owner', (q) => q.eq('ownerId', userId))
				.collect(),
			ctx.db
				.query('hospitalities')
				.withIndex('by_owner', (q) => q.eq('ownerId', userId))
				.collect()
		]);

		const partnershipLists = await Promise.all([
			...accommodations.map((accommodation) =>
				ctx.db
					.query('partnerships')
					.withIndex('by_accommodation_active', (q) =>
						q.eq('accommodationId', accommodation._id).eq('isActive', true)
					)
					.collect()
			),
			...hospitalities.map((hospitality) =>
				ctx.db
					.query('partnerships')
					.withIndex('by_hospitality_active', (q) =>
						q.eq('hospitalityId', hospitality._id).eq('isActive', true)
					)
					.collect()
			)
		]);

		// Own-venue links appear from both sides — dedupe by partnership id.
		const partnerships = new Map<Id<'partnerships'>, Doc<'partnerships'>>();
		for (const partnership of partnershipLists.flat()) {
			partnerships.set(partnership._id, partnership);
		}

		const rows = await Promise.all(
			[...partnerships.values()].map(async (partnership): Promise<typesPartnershipMyItem | null> => {
				const [accommodation, hospitality] = await Promise.all([
					ctx.db.get(partnership.accommodationId),
					ctx.db.get(partnership.hospitalityId)
				]);
				if (!accommodation || !hospitality) return null;

				return {
					partnershipId: partnership._id,
					accommodationName: accommodation.name,
					hospitalityName: hospitality.name,
					hospitalityType: hospitality.type,
					hospitalityCity: hospitality.city,
					benefit: partnership.benefit ?? null,
					isOwnHospitality: hospitality.ownerId === userId,
					createdAt: partnership._creationTime
				};
			})
		);

		return rows
			.filter((row): row is typesPartnershipMyItem => row !== null)
			.sort((a, b) => b.createdAt - a.createdAt);
	}
});
