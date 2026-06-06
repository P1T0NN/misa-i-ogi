// LIBRARIES
import { ConvexError, v } from 'convex/values';
import { getAuthUserId } from '@/convex/auth/helpers/getAuthUserId';
import { mutation } from '../_generated/server';

// HELPERS
import { convexGetRateLimitedUserId } from './convexGetRateLimitedUserId.js';
import { requireAdmin } from '../auth/middleware/authMiddleware.js';
import { logAudit } from '../tables/auditLog/helpers/logAudit';
import { analytics } from '@/convex/analytics';

// TYPES
import type { MutationCtx } from '../_generated/server';
import type { Doc, TableNames } from '../_generated/dataModel';
import type { ConvexRateLimitName } from '../rateLimits/registry.js';
import type { ConvexMutationResult, TranslatableMessage } from '../types/convexTypes.js';
import type { AuditAction } from '../tables/auditLog/auditLogConfigs';

// ΓöÇΓöÇΓöÇ Config types ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

/** Default cap on `ids.length` per request. Overridable per call site. */
const DEFAULT_MAX_BATCH_SIZE = 200;

/**
 * Phase 2 execution strategy. Controls how per-row work (`onDelete` ΓåÆ `ctx.db.delete`)
 * is scheduled across the rows in a batch.
 *
 * | value          | scheduling          | safe whenΓÇª                                                               |
 * | -------------- | ------------------- | ------------------------------------------------------------------------ |
 * | `'sequential'` | one row at a time   | `onDelete` may touch shared state (same parent row, counter) ΓÇö default   |
 * | `'optimized'`  | `Promise.all`       | rows are fully independent; `onDelete` does not cross-write between rows |
 *
 * ## Trade-offs
 * - **`'sequential'` (default)**
 *   - Deterministic: rows execute in the order they arrived. `onDelete` can safely
 *     read-then-write shared state.
 *   - No intra-batch OCC conflicts: two rows both patching the same parent in `onDelete`
 *     won't race.
 *   - Cost: O(n) sequential local writes. At n=200 that's ~200 local transactional ops in a
 *     row ΓÇö still sub-second because nothing leaves the Convex process, but it's not free.
 * - **`'optimized'`**
 *   - Parallel via `Promise.all`. Convex batches and pipelines writes within the same
 *     mutation, so wall-clock time collapses dramatically for big batches.
 *   - ΓÜá∩╕Å Any cross-row shared write inside `onDelete` (e.g. two rows each calling
 *     `ctx.db.patch(sharedParentId, {...})`) will either hit an intra-mutation conflict or
 *     produce nondeterministic final state. The whole mutation still rolls back or commits
 *     atomically ΓÇö but if you expected "each row subtracts 1 from parent", you might end up
 *     subtracting 1 total instead of N.
 *
 * Rule of thumb: start with `'sequential'`. Flip to `'optimized'` when you've profiled a big
 * batch and confirmed `onDelete` has no cross-row writes.
 */
export type DeletePhase2Strategy = 'sequential' | 'optimized';

/**
 * Shortcut per-row ownership check. Covers the ~90% case where a row has a column identifying
 * its owner (`ownerId`, `hostId`, `userId`, ΓÇª). Pair with custom {@link
 * CreateDeleteMutationOptions.authorize} for richer rules (admins, shared access, etc.) ΓÇö
 * both are ANDed when supplied.
 */
export type OwnerIdConfig<T extends TableNames> = {
	/**
	 * Pull the owner identifier off a row. Return `null`/`undefined` to fail the match ΓÇö
	 * rows without an owner cannot be deleted via the ownership path, which is the strict,
	 * safe default.
	 */
	field: (doc: Doc<T>) => string | null | undefined;
	/**
	 * Derive the caller's matching identifier. Defaults to the `Id<'users'>` returned by
	 * `@convex-dev/auth`'s `getAuthUserId(ctx)` ΓÇö which is what 99% of tables in this
	 * codebase store as `ownerId: v.id('users')`. Override when your owner column holds a
	 * different shape (e.g. external sub id, organization id). Return `null`/`undefined`
	 * for anonymous callers; they will always fail the ownership check.
	 */
	currentUser?: (
		ctx: MutationCtx
	) => Promise<string | null | undefined> | string | null | undefined;
};

type DeleteMutationAnalyticsInput = {
	name: string;
	organizationId?: string;
	scopes?: Array<{ scopeType: 'global' | 'organization' | 'resource'; scopeId: string }>;
	properties?: Record<string, string | number | boolean | null>;
};

export type DeleteMutationAnalyticsMeta<T extends TableNames> = {
	userId?: string;
	table: T;
};

export type DeleteMutationAnalyticsHandler<T extends TableNames> = (
	ctx: MutationCtx,
	doc: Doc<T>,
	meta: DeleteMutationAnalyticsMeta<T>
) =>
	| Promise<DeleteMutationAnalyticsInput | null | undefined>
	| DeleteMutationAnalyticsInput
	| null
	| undefined;

// ΓöÇΓöÇΓöÇ ConvexError payloads ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

/**
 * Payload carried by typed {@link ConvexError}s thrown from the factory. All payloads share
 * `code` + a {@link TranslatableMessage} so the client can branch on the code and/or feed
 * `data.message` straight into `translateFromBackend` without any extra plumbing.
 */
export type DeleteMutationErrorPayload =
	| {
			code: 'BATCH_TOO_LARGE';
			message: TranslatableMessage;
			limit: number;
			received: number;
			table: string;
	  }
	| {
			code: 'FORBIDDEN';
			message: TranslatableMessage;
			table: string;
	  }
	| {
			code: 'STORAGE_DELETE_FAILED';
			message: TranslatableMessage;
			requestedCount: number;
			table: string;
	  };

// ΓöÇΓöÇΓöÇ Factory options & return data ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export type CreateDeleteMutationOptions<T extends TableNames> = {
	/** Target table. `v.id(table)` is used to validate incoming ids at the args layer. */
	table: T;
	/**
	 * Custom per-row authorization. Runs after ids are fetched but before any storage/db
	 * writes. Return `true` to allow, `false` to reject. If any row returns `false`, the
	 * whole batch aborts with a `FORBIDDEN` {@link ConvexError} ΓÇö no partial success, no
	 * leaking of which specific id failed.
	 *
	 * Treated as an ADDITIONAL per-row check, NOT a replacement for `ownerId` / `adminOnly`.
	 * Supplying only `authorize` without `ownerId` still triggers the admin default ΓÇö set
	 * `adminOnly: false` explicitly when `authorize` is your sole auth mechanism (e.g. the
	 * "admin OR owner" pattern where the full rule lives inside `authorize`).
	 */
	authorize?: (ctx: MutationCtx, doc: Doc<T>) => Promise<boolean> | boolean;
	/**
	 * Declarative ownership check. Handles the common case without custom code ΓÇö see
	 * {@link OwnerIdConfig}. Different tables can use differently-named columns (`ownerId`,
	 * `hostId`, `userId`, ΓÇª). **When supplied, {@link adminOnly} defaults to `false`** ΓÇö the
	 * owner match IS the auth rule and forcing admin on top would block owner self-service.
	 */
	ownerId?: OwnerIdConfig<T>;
	/**
	 * Require the caller to be an admin (via {@link requireAdmin}). Runs before rate limit,
	 * dedupe, and fetch ΓÇö non-admins pay zero resources.
	 *
	 * **Default**: `true` when `ownerId` is NOT supplied, `false` when it is. This enforces
	 * the invariant "every delete endpoint is gated by either ownership OR admin" without
	 * needing the caller to remember it.
	 *
	 * | value                       | behaviour                                            |
	 * | --------------------------- | ---------------------------------------------------- |
	 * | `undefined` + no `ownerId`  | admin required (safe default)                        |
	 * | `undefined` + `ownerId`     | owner match is the auth ΓÇö no admin check             |
	 * | `true`                      | admin always required (AND-composes with `ownerId`)  |
	 * | `false`                     | explicit opt-out; caller owns the auth (`authorize`) |
	 */
	adminOnly?: boolean;
	/**
	 * Optional Phase 1 hook to remove blob storage referenced by the rows. Receives the full
	 * batch and is expected to delete every object the rows point at ΓÇö Convex `_storage`,
	 * Cloudflare R2, S3, anything. Backend-specific concerns (id deduping, parallelism,
	 * which client to call) live inside this callback, not in the factory.
	 *
	 * A throw aborts the txn before any db write ΓÇö Convex rolls back any sibling
	 * `ctx.storage.delete` calls that already succeeded. The factory wraps any error here
	 * into a `STORAGE_DELETE_FAILED` {@link ConvexError}.
	 *
	 * Omit entirely for tables that don't reference any blob storage.
	 */
	runStorageDelete?: (ctx: MutationCtx, docs: Doc<T>[]) => Promise<void>;
	/**
	 * Hook that runs inside Phase 2, **before** the row is removed. Use for:
	 *   - audit logging (`ctx.db.insert('auditLog', ...)`)
	 *   - cascading related-row deletes
	 *   - external side-effects that share the mutation's transactional guarantee
	 *
	 * Failures here abort the whole mutation and roll back Phase 1 storage deletes (sibling
	 * txn semantics still apply).
	 */
	onDelete?: (ctx: MutationCtx, doc: Doc<T>) => Promise<void>;
	/**
	 * Optional per-row analytics event builder. The factory handles `trackEvent`
	 * plumbing and passes the resolved caller id through `meta.userId`.
	 *
	 * Return `null`/`undefined` to skip a row. Analytics is best-effort: callback
	 * errors are logged but do not abort the delete operation.
	 */
	analytics?: false | DeleteMutationAnalyticsHandler<T>;
	/**
	 * Max ids accepted per request. Default {@link DEFAULT_MAX_BATCH_SIZE}. Enforced BEFORE
	 * the rate-limit charge, so oversized payloads get a cheap rejection.
	 */
	maxBatchSize?: number;
	/**
	 * Skip rate limiting for trusted internal callers (e.g. `runMutation` jobs).
	 * By default the function-specific bucket is charged `ids.length` tokens per request.
	 */
	skipRateLimit?: true;
	/**
	 * How Phase 2 iterates the rows in a batch. See {@link DeletePhase2Strategy} for the
	 * full trade-off matrix. Defaults to `'sequential'` ΓÇö the safe choice.
	 */
	phase2Strategy?: DeletePhase2Strategy;
	/**
	 * Audit-log policy for this endpoint.
	 *
	 * - **Default** (omit): one audit row per deleted doc with
	 *   `action = "${table}.delete"`, `resource = { table, id }`, `before = doc`,
	 *   and `userId` from the resolved caller. Off the hot path (scheduled write),
	 *   no-op when `FEATURES.AUDIT_LOGS` is disabled.
	 * - `false`: skip auditing for this endpoint (use for noisy / throwaway tables).
	 * - `{ action }`: override the action key (e.g. `AUDIT_ACTIONS.USER_DELETE`).
	 *
	 * The audit write happens INSIDE Phase 2, just before `ctx.db.delete`, so it
	 * shares the mutation's transactional guarantee ΓÇö if anything later in the
	 * batch throws, the schedule entry rolls back with everything else.
	 */
	audit?: false | { action?: AuditAction };
};

export type DeleteMutationData = {
	/** Rows actually removed from the table. */
	deletedCount: number;
	/** Unique ids the client asked us to delete (after dedupe). */
	requestedCount: number;
	/** `requestedCount - deletedCount`; rows that were already gone. */
	missingCount: number;
	/** Duplicate ids collapsed by dedupe. Surfaces client-side selection bugs. */
	duplicateCount: number;
};

// ΓöÇΓöÇΓöÇ Factory ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

/**
 * Factory that produces a hybrid bulk-delete mutation for any table. One shape, every table:
 * pass `runStorageDelete` when rows reference blob storage, pass `onDelete` when you need
 * audit/cascade work to share the same transaction.
 *
 * ## Order of operations (cheapest ΓåÆ most expensive, so hostile input is rejected early)
 *  1. Empty / oversize batch rejection
 *  2. Admin guard via {@link requireAdmin} (runs when `adminOnly` is `true`, which is the
 *     default whenever `ownerId` is not supplied ΓÇö see Authorization below)
 *  3. Rate limit + user id resolution via {@link convexGetRateLimitedUserId}
 *     (charges `ids.length` tokens against the configured bucket)
 *  4. Dedupe of requested ids
 *  5. Row fetch
 *  6. Per-row `ownerId` match AND/or {@link CreateDeleteMutationOptions.authorize}
 *  7. **Phase 1** ΓÇö `runStorageDelete(ctx, rows)` (caller-supplied; backend-agnostic)
 *  8. **Phase 2** ΓÇö per row: `onDelete` ΓåÆ `ctx.db.delete`
 *     (serial by default; set `phase2Strategy: 'optimized'` for parallel ΓÇö see
 *     {@link DeletePhase2Strategy} for the trade-offs)
 *
 * ## Atomicity
 * Convex mutations are fully transactional, including `ctx.storage.delete`. If Phase 1 throws,
 * Convex rolls back every storage delete in the batch and no db writes ever run.
 * Phase 2 is itself a single transaction ΓÇö if any row's `onDelete` or `db.delete`
 * rejects, the whole thing rolls back and nothing changes. Net result is strictly all-or-nothing.
 * See: https://docs.convex.dev/database/advanced/occ
 *
 * ## Authorization
 * **Secure by default**: every endpoint is gated by either ownership OR admin ΓÇö no silent
 * "wide-open delete" is possible. Three knobs, composable:
 *   - `ownerId` ΓÇö per-row "caller must be the owner" check via a column on the row.
 *     When supplied, `adminOnly` defaults to `false` (owner match IS the rule).
 *   - `adminOnly` ΓÇö gates the whole endpoint behind {@link requireAdmin}. **Defaults to
 *     `true` whenever `ownerId` is not supplied.** Non-admins never reach rate limit,
 *     fetch, or Phase 1/2.
 *   - `authorize` ΓÇö per-row custom predicate, ADDITIONAL to the above. Access ctx, call
 *     `getAuthUserId` + `ctx.db.get(userId)` to inspect roles, cross-table lookups, etc.
 *     Don't call `convexGetRateLimitedUserId` here ΓÇö it'd double-charge the bucket already
 *     consumed at step 3.
 *
 * All supplied checks AND (every one must pass). For OR semantics (e.g. "admin OR owner"),
 * put the full rule inside `authorize` alone AND set `adminOnly: false` to disable the
 * default admin gate ΓÇö otherwise the admin check wins before your `authorize` ever runs.
 *
 * ## Usage
 * ```ts
 * // Ownership by column ΓÇö works for `ownerId`, `hostId`, `userId`, any field name.
 * // `adminOnly` auto-defaults to false here because `ownerId` is set.
 * export const deleteApartment = createDeleteMutation('deleteApartment', {
 *   table: 'apartments',
 *   ownerId: { field: (doc) => doc.hostId },
 *   runStorageDelete: deleteApartmentImages
 * });
 *
 * // Admin-only endpoint ΓÇö no config needed beyond `table`, admin gate is the default
 * // when `ownerId` is absent.
 * export const deleteLocation = createDeleteMutation('deleteLocation', { table: 'locations' });
 *
 * // "Admin OR owner" ΓÇö custom rule in `authorize`, MUST disable the default admin gate
 * // or non-admin owners would be blocked before `authorize` ever runs.
 * // NOTE: factory already rate-limited once at step 3, so use `getAuthUserId` here (not
 * // `convexGetRateLimitedUserId`) to avoid double-charging the bucket.
 * export const deleteInvoice = createDeleteMutation('deleteInvoice', {
 *   table: 'invoices',
 *   adminOnly: false,
 *   authorize: async (ctx, doc) => {
 *     const userId = await getAuthUserId(ctx);
 *     if (!userId) return false;
 *     const user = await ctx.db.get(userId);
 *     return user?.role === 'admin' || doc.customerId === userId;
 *   }
 * });
 *
 * // Admin AND owner ΓÇö both checks must pass:
 * export const deleteAuditedDoc = createDeleteMutation('deleteAuditedDoc', {
 *   table: 'auditedDocs',
 *   adminOnly: true,
 *   ownerId: { field: (doc) => doc.ownerId }
 * });
 * ```
 */
export function createDeleteMutation<T extends TableNames>(
	name: ConvexRateLimitName,
	options: CreateDeleteMutationOptions<T>
) {
	const {
		table,
		authorize,
		ownerId: ownerIdCfg,
		adminOnly,
		runStorageDelete,
		onDelete,
		analytics: analyticsOption,
		maxBatchSize = DEFAULT_MAX_BATCH_SIZE,
		skipRateLimit,
		phase2Strategy = 'sequential',
		audit: auditOption
	} = options;

	// Resolve once, not per row. `false` ΓåÆ opt-out; otherwise default action key
	// is `${table}.delete` so every endpoint gets sensible auditing for free.
	const auditAction: AuditAction | null =
		auditOption === false ? null : (auditOption?.action ?? `${table}.delete`);
	const analyticsHandler = analyticsOption === false ? null : analyticsOption;

	return mutation({
		args: {
			ids: v.array(v.id(table))
		},
		handler: async (ctx, { ids }): Promise<ConvexMutationResult<DeleteMutationData>> => {
			// 1. Cheapest rejections first, before any async work that costs real resources.
			if (ids.length === 0) {
				return {
					success: false,
					message: { key: 'GenericMessages.NO_ITEMS_PROVIDED' },
					data: { deletedCount: 0, requestedCount: 0, missingCount: 0, duplicateCount: 0 }
				};
			}
			if (ids.length > maxBatchSize) {
				throw new ConvexError({
					code: 'BATCH_TOO_LARGE',
					message: {
						key: 'GenericMessages.BATCH_TOO_LARGE',
						params: { limit: maxBatchSize }
					},
					limit: maxBatchSize,
					received: ids.length,
					table
				} satisfies DeleteMutationErrorPayload);
			}

			// 2. Admin gate ΓÇö before any rate limit or data access so non-admins pay nothing.
			//    Secure default: if the caller didn't supply `adminOnly`, we require admin
			//    UNLESS `ownerId` was configured (owner match is then the auth rule). This
			//    enforces the invariant "every delete endpoint is gated by ownership OR admin"
			//    without the caller having to remember it. Explicit `false` opts out.
			const requireAdminEnforced = adminOnly ?? !ownerIdCfg;
			if (requireAdminEnforced) await requireAdmin(ctx);

			// 3. Rate limit + caller id resolution in one pass via the shared helper.
			//    - Rate-limit enabled  ΓåÆ `convexGetRateLimitedUserId` charges tokens, throws
			//      `NOT_AUTHENTICATED` for anon, and returns the authed user id.
			//    - Rate-limit disabled ΓåÆ fall back to bare `getAuthUserId` (may be null for
			//      trusted internal jobs); the ownerId default still has something to
			//      compare against, anon mismatches will fall out at step 6.
			//    Weighted by `ids.length` so bulk deletes pay proportional cost. A thrown
			//    limit error propagates and the client's `safeMutation` wrapper catches it
			//    via `isRateLimitError`.
			const userId = skipRateLimit
				? await getAuthUserId(ctx)
				: await convexGetRateLimitedUserId(ctx, name, ids.length);

			// 4. Dedupe ΓÇö a buggy client sending the same id twice can't bypass rate limits
			//    (already charged) but still shouldn't double-work below.
			const uniqueIds = [...new Set(ids)];
			const duplicateCount = ids.length - uniqueIds.length;

			// 5. Fetch.
			const docs = await Promise.all(uniqueIds.map((id) => ctx.db.get(id)));
			const existing = docs.filter((d): d is NonNullable<typeof d> => d !== null);

			if (existing.length === 0) {
				return {
					success: false,
					message: { key: 'GenericMessages.NO_MATCHING_ITEMS' },
					data: {
						deletedCount: 0,
						requestedCount: uniqueIds.length,
						missingCount: uniqueIds.length,
						duplicateCount
					}
				};
			}

			// 6. Per-row authorization. Resolve the caller's identifier ONCE (not per row) when
			//    ownerId is configured, then AND every supplied check (ownerId + authorize).
			//    Abort-all policy: any `false` aborts with FORBIDDEN. Silent-filtering foreign
			//    rows would leak existence of ids for other users and hide bugs.
			let ownerCurrent: string | null | undefined;
			if (ownerIdCfg) {
				ownerCurrent = ownerIdCfg.currentUser
					? await ownerIdCfg.currentUser(ctx)
					: (userId ?? undefined);
			}

			const decisions = await Promise.all(
				existing.map(async (doc) => {
					if (ownerIdCfg) {
						const owner = ownerIdCfg.field(doc as Doc<T>);
						if (owner == null || ownerCurrent == null || owner !== ownerCurrent) {
							return false;
						}
					}
					if (authorize) {
						const ok = await authorize(ctx, doc as Doc<T>);
						if (!ok) return false;
					}
					return true;
				})
			);
			if (decisions.some((ok) => !ok)) {
				throw new ConvexError({
					code: 'FORBIDDEN',
					message: { key: 'GenericMessages.FORBIDDEN' },
					table
				} satisfies DeleteMutationErrorPayload);
			}

			// 7. Phase 1 ΓÇö storage. Backend-agnostic: the caller's `runStorageDelete` decides
			//    which client to call (`ctx.storage`, R2, S3, ΓÇª) and handles backend-specific
			//    concerns like blob-id deduping. A throw aborts the txn so no db writes run;
			//    Convex rolls back any sibling storage deletes the callback already issued.
			//    The underlying error is logged server-side but NOT forwarded in the payload,
			//    which is sent verbatim to clients.
			if (runStorageDelete) {
				try {
					await runStorageDelete(ctx, existing as Doc<T>[]);
				} catch (error) {
					console.error(
						`[createDeleteMutation:${table}] runStorageDelete failed`,
						error instanceof Error ? error.message : error
					);
					throw new ConvexError({
						code: 'STORAGE_DELETE_FAILED',
						message: { key: 'GenericMessages.STORAGE_DELETE_FAILED' },
						requestedCount: uniqueIds.length,
						table
					} satisfies DeleteMutationErrorPayload);
				}
			}

			// 8. Phase 2 ΓÇö onDelete ΓåÆ db. Execution shape is chosen by
			//    `phase2Strategy`; see {@link DeletePhase2Strategy} for the trade-offs.
			//    Both branches roll back together via Convex's mutation transaction ΓÇö the
			//    choice is only about *intra-batch* ordering guarantees, never about atomicity.
			const deleteOne = async (doc: Doc<T>) => {
				if (onDelete) await onDelete(ctx, doc);
				if (analyticsHandler) {
					try {
						const analyticsInput = await analyticsHandler(ctx, doc, {
							userId: userId ?? undefined,
							table
						});
						if (analyticsInput) {
							await analytics.writeTrack(ctx, {
								name: analyticsInput.name,
								organizationId: analyticsInput.organizationId,
								scopes: analyticsInput.scopes,
								properties: analyticsInput.properties
							});
						}
					} catch (error) {
						console.error(
							`[createDeleteMutation:${table}] analytics failed`,
							error instanceof Error ? error.message : error
						);
					}
				}
				if (auditAction) {
					logAudit(ctx, auditAction, {
						userId: userId ?? undefined,
						resource: { table, id: doc._id },
						before: doc
					});
				}
				await ctx.db.delete(doc._id);
			};
			if (phase2Strategy === 'optimized') {
				await Promise.all(existing.map((doc) => deleteOne(doc as Doc<T>)));
			} else {
				for (const doc of existing) await deleteOne(doc as Doc<T>);
			}

			const deletedCount = existing.length;
			const missingCount = uniqueIds.length - deletedCount;

			return {
				success: true,
				message:
					missingCount > 0
						? {
								key: 'GenericMessages.DATA_TABLE_DELETED_WITH_MISSING',
								params: { count: deletedCount, missing: missingCount }
							}
						: {
								key: 'GenericMessages.DATA_TABLE_DELETED_ALL',
								params: { count: deletedCount }
							},
				data: {
					deletedCount,
					requestedCount: uniqueIds.length,
					missingCount,
					duplicateCount
				}
			};
		}
	});
}
