// UTILS
import { resolveStoredFileUrlAndSyncRow } from '@/convex/storage/r2/resolveStoredFileUrl.js';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { MutationResult } from '@/convex/schemas/mutationResult';

type MenuFileResolution =
	| { ok: true; menuFileKey?: string; menuFileUrl?: string }
	| { ok: false; error: MutationResult };

/**
 * Resolve an optional uploaded menu file (image or PDF) to its stored key + public
 * URL, mirroring the cover-image flow. `undefined`/empty key → no menu file (ok,
 * fields left unset). A key that has no matching upload row is treated as an error,
 * same as the cover image — the client only sends a key after a successful upload.
 */
export async function resolveMenuFile(
	ctx: MutationCtx,
	menuFileKey: string | undefined,
	uploadOwnerId?: string
): Promise<MenuFileResolution> {
	if (!menuFileKey) return { ok: true };

	const uploaded = await ctx.db
		.query('uploadedFilesR2')
		.withIndex('by_key', (q) => q.eq('key', menuFileKey))
		.unique();
	if (!uploaded) {
		return {
			ok: false,
			error: { success: false, message: { key: 'GenericMessages.STORAGE_URL_UNAVAILABLE' } }
		};
	}
	if (uploadOwnerId && uploaded.ownerId !== uploadOwnerId) {
		return { ok: false, error: { success: false, message: { key: 'GenericMessages.FORBIDDEN' } } };
	}

	const menuFileUrl = await resolveStoredFileUrlAndSyncRow(ctx, uploaded);
	return { ok: true, menuFileKey: uploaded.key, menuFileUrl };
}

/** Trim an optional menu link; empty string → `undefined` (clears it). */
export function normalizeMenuLink(menuLink: string | undefined): string | undefined {
	const trimmed = menuLink?.trim();
	return trimmed ? trimmed : undefined;
}
