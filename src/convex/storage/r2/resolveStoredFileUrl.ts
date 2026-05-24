// SERVER
import type { Doc } from '@/convex/_generated/dataModel';
import type { MutationCtx } from '@/convex/_generated/server';

import { buildR2PublicObjectUrl } from './buildR2PublicObjectUrl.js';
import { r2 } from './r2.js';

/**
 * Resolves the GET URL for an R2 object. Prefer `cachedUrl` when the
 * `uploadedFilesR2` row was already patched (e.g. by `onSyncMetadata`).
 *
 * Often `cachedUrl` is still empty: `syncMetadata` schedules the R2 action with
 * `runAfter(0)`, so the client may run `createHospitality` / `createAccommodation`
 * before `onSyncMetadata` patches the row.
 */
export async function resolveStoredFileUrl(
	key: string,
	cachedUrl: string | undefined
): Promise<string> {
	const trimmed = cachedUrl?.trim();
	if (trimmed) return trimmed;

	const publicUrl = buildR2PublicObjectUrl(key);
	if (publicUrl) return publicUrl;

	return r2.getUrl(key, { expiresIn: 604800 });
}

/** Same as {@link resolveStoredFileUrl}, and backfills `uploadedFilesR2.url` when it was blank. */
export async function resolveStoredFileUrlAndSyncRow(
	ctx: MutationCtx,
	uploaded: Doc<'uploadedFilesR2'>
): Promise<string> {
	const url = await resolveStoredFileUrl(uploaded.key, uploaded.url);
	if (!uploaded.url?.trim()) {
		await ctx.db.patch(uploaded._id, { url });
	}
	return url;
}
