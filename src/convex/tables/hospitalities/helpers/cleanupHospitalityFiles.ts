// UTILS
import { deleteUploadedFilesByKeys } from '@/convex/storage/r2/deleteUploadedFilesByKeys';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { Doc } from '@/convex/_generated/dataModel';

/** Remove every stored file a hospitality references: all gallery images + menu file. */
export async function cleanupHospitalityFiles(
	ctx: MutationCtx,
	docs: Doc<'hospitalities'>[]
): Promise<void> {
	await deleteUploadedFilesByKeys(
		ctx,
		docs.flatMap((d) => [...(d.images ?? []).map((image) => image.key), d.menuFileKey])
	);
}
