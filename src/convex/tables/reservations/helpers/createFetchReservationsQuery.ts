// LIBRARIES
import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';
import { query } from '@/convex/_generated/server';

// HELPERS
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { defaultPaginationOpts, normalizeOneBasedPage } from '@/convex/helpers/paginationHelpers';
import { getOwnerReservationStatusCount } from '@/convex/helpers/ownerCounterHelpers';

// VALIDATORS
import { fetchOptimizedReservationsResultValidator } from '@/convex/tables/reservations/validators/reservationQueryValidators';

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
		(reservation.email?.toLowerCase().includes(normalizedQuery) ?? false) ||
		reservation.phone.toLowerCase().includes(normalizedQuery) ||
		String(reservation.hospitalityId).toLowerCase().includes(normalizedQuery) ||
		String(reservation.guestId).toLowerCase().includes(normalizedQuery)
	);
}

function matchesHospitalityFilter(reservation: ReservationDoc, selectedHospitality: string) {
	return selectedHospitality === 'all' || reservation.hospitalityName === selectedHospitality;
}

function ownerStatusQuery(ctx: QueryCtx, ownerId: string, status: ReservationStatus) {
	return ctx.db
		.query('reservations')
		.withIndex('by_hospitality_owner_status', (q) =>
			q.eq('hospitalityOwnerId', ownerId).eq('status', status)
		)
		.order('desc');
}

async function fetchOffsetPageWithoutCollect(
	ctx: QueryCtx,
	ownerId: string,
	status: ReservationStatus,
	page: number,
	numItems: number
): Promise<ReservationDoc[]> {
	const skip = Math.max(0, (page - 1) * numItems);
	let cursor: string | null = null;
	let skipped = 0;

	while (true) {
		const result = await ownerStatusQuery(ctx, ownerId, status).paginate({
			numItems,
			cursor
		});

		if (result.page.length === 0) return [];

		if (skipped + result.page.length <= skip) {
			skipped += result.page.length;
			if (result.isDone) return [];
			cursor = result.continueCursor;
			continue;
		}

		const startInPage = Math.max(0, skip - skipped);
		return result.page.slice(startInPage, startInPage + numItems);
	}
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

	const searchQuery = args.searchQuery?.trim() ?? '';
	const selectedHospitality = args.selectedHospitality ?? 'all';
	const hasFilters = searchQuery !== '' || selectedHospitality !== 'all';
	const paginationOpts = args.paginationOpts ?? defaultPaginationOpts;
	const page = normalizeOneBasedPage(args.page);

	if (!hasFilters) {
		const [totalCount, pageItems] = await Promise.all([
			getOwnerReservationStatusCount(ctx, ownerId, args.status),
			fetchOffsetPageWithoutCollect(ctx, ownerId, args.status, page, paginationOpts.numItems)
		]);
		const start = Math.max(0, (page - 1) * paginationOpts.numItems);

		return {
			page: pageItems,
			isDone: start + pageItems.length >= totalCount,
			continueCursor: '',
			totalCount
		};
	}

	const reservations = await ownerStatusQuery(ctx, ownerId, args.status).collect();
	const filtered = reservations.filter(
		(reservation) =>
			matchesHospitalityFilter(reservation, selectedHospitality) &&
			matchesSearch(reservation, searchQuery)
	);

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
		returns: fetchOptimizedReservationsResultValidator,
		handler: async (ctx, args): Promise<FetchOptimizedResult<'reservations'>> => {
			return await _fetchReservationsByStatus(ctx, {
				...args,
				status
			});
		}
	});
}
