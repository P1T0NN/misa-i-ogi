// LIBRARIES
import { paginationOptsValidator, type PaginationOptions } from 'convex/server';
import { v } from 'convex/values';

// CONFIG
import { PAGINATION_DATA } from '@/shared/config.js';

/**
 * Server-side fallback used when a caller invokes a paginated query without supplying
 * `paginationOpts` (e.g. internal `runQuery`, tests). The `DataTable` always sends explicit
 * opts. Single source of truth lives in `shared/config.ts` so the client and server can't
 * drift.
 */
export const defaultPaginationOpts: PaginationOptions = {
	numItems: PAGINATION_DATA.DEFAULT_PAGE_SIZE,
	cursor: null
};

/**
 * Optional 1-based page index. Convex type is float64; handlers should use {@link normalizeOneBasedPage}.
 */
export const optionalOneBasedPageArg = v.optional(v.number());

/**
 * Coerces API `page` to a safe 1-based integer (handles missing, floats, negatives).
 */
export function normalizeOneBasedPage(page: number | undefined): number {
	if (page === undefined) return 1;
	return Math.max(1, Math.floor(page));
}

/**
 * Spread into `query({ args: { ...yourArgs, ...paginatedQueryArgs } })` so every
 * paginated endpoint accepts optional `paginationOpts` with the same validation.
 */
export const paginatedQueryArgs = {
	paginationOpts: v.optional(paginationOptsValidator)
} as const;

/** Use before `.paginate(...)` when `paginationOpts` is optional in args. */
export function resolvePaginationOpts(opts: PaginationOptions | undefined): PaginationOptions {
	return opts ?? defaultPaginationOpts;
}

/**
 * Offset-mode pagination accounting for an already-materialized, bounded row set:
 * 1-based page clamp → slice → `totalCount` → `isDone`. The single place this
 * arithmetic lives, so `fetchOptimized`'s offset branches can't drift from each other.
 *
 * `continueCursor` is `''` in offset mode — the `DataTable`'s own contract.
 */
export function offsetPayload<T>(
	all: T[],
	page: number | undefined,
	numItems: number
): { page: T[]; isDone: boolean; continueCursor: string; totalCount: number } {
	const offset = (normalizeOneBasedPage(page) - 1) * numItems;
	const slice = all.slice(offset, offset + numItems);

	return {
		page: slice,
		isDone: offset + slice.length >= all.length,
		continueCursor: '',
		totalCount: all.length
	};
}
