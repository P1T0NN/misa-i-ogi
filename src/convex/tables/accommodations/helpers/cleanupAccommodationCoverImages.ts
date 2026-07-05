// UTILS
import { deleteUploadedFilesByKeys } from '@/convex/storage/r2/deleteUploadedFilesByKeys';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { Doc } from '@/convex/_generated/dataModel';

export async function cleanupAccommodationCoverImages(
	ctx: MutationCtx,
	docs: Doc<'accommodations'>[]
): Promise<void> {
	await deleteUploadedFilesByKeys(
		ctx,
		docs.map((d) => d.coverImageKey)
	);
}
