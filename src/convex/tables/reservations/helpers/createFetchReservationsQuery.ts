// LIBRARIES
import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { defaultPaginationOpts, normalizeOneBasedPage } from '@/convex/helpers/paginationHelpers';

// TYPES
import type { QueryCtx } from '@/convex/_generated/server';
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';
import type { FetchOptimizedResult } from '@/convex/helpers/fetchOptimized';
import type {
	ReservationDoc,
	ReservationStatus
} from '@/convex/tables/reservations/types/reservationsTypes';

type FetchReservationsQueryArgs = {
	paginationOpts?: { numItems: number; cursor: string | null };
	page?: number;
	status: ReservationStatus;
	searchQuery?: string;
	selectedHospitality?: string;
};

function matchesSearch(reservation: ReservationDoc, query: string) {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return true;

	return (
		reservation.guestName.toLowerCase().includes(normalizedQuery) ||
		reservation.hospitalityName.toLowerCase().includes(normalizedQuery) ||
		reservation.email.toLowerCase().includes(normalizedQuery) ||
		reservation.phone.toLowerCase().includes(normalizedQuery) ||
		String(reservation.hospitalityId).toLowerCase().includes(normalizedQuery) ||
		String(reservation.guestId).toLowerCase().includes(normalizedQuery)
	);
}

async function _fetchReservationsByStatus(
	ctx: QueryCtx,
	args: FetchReservationsQueryArgs
): Promise<FetchOptimizedResult<'reservations'>> {
	const ownerId = await getAuthUserId(ctx);
	if (!ownerId) {
		throw new ConvexError({
			code: 'NOT_AUTHENTICATED',
			message: { key: 'GenericMessages.NOT_AUTHENTICATED' }
		} satisfies ConvexErrorPayload);
	}

	const reservations = await ctx.db
		.query('reservations')
		.withIndex('by_hospitality_owner_status', (q) =>
			q.eq('hospitalityOwnerId', ownerId).eq('status', args.status)
		)
		.order('desc')
		.collect();

	const selectedHospitality = args.selectedHospitality ?? 'all';
	const searchQuery = args.searchQuery ?? '';
	const filtered = reservations.filter((reservation) => {
		if (selectedHospitality !== 'all' && reservation.hospitalityName !== selectedHospitality) {
			return false;
		}

		return matchesSearch(reservation, searchQuery);
	});

	const paginationOpts = args.paginationOpts ?? defaultPaginationOpts;
	const page = normalizeOneBasedPage(args.page);
	const start = Math.max(0, (page - 1) * paginationOpts.numItems);
	const pageItems = filtered.slice(start, start + paginationOpts.numItems);

	return {
		page: pageItems,
		isDone: start + pageItems.length >= filtered.length,
		continueCursor: '',
		totalCount: filtered.length
	};
}

export function createFetchReservationsQuery(status: ReservationStatus) {
	return query({
		args: {
			paginationOpts: v.optional(paginationOptsValidator),
			page: v.optional(v.number()),
			searchQuery: v.optional(v.string()),
			selectedHospitality: v.optional(v.string())
		},
		handler: async (ctx, args): Promise<FetchOptimizedResult<'reservations'>> => {
			return await _fetchReservationsByStatus(ctx, {
				...args,
				status
			});
		}
	});
}
