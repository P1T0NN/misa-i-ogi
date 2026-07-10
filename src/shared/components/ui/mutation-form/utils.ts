// COMPONENTS
import { toast } from 'svelte-sonner';

// UTILS
import { optimizeImages } from '@/features/uploadFile/utils/optimizeImages';
import { isExistingImage, type UploadItem } from '@/features/uploadFile/types/uploadFileTypes';

// TYPES
import type { MutationFormProgress, MutationFormSection } from './types.js';

export type MutationFormUploadOne = (file: File) => Promise<string | null>;

/**
 * Walks `sections`, finds upload-single / upload-multiple fields, optimizes and uploads
 * their Files, and replaces each entry in `args` with the resulting storage id(s).
 * Returns `false` if the submission should abort (errors are toasted internally).
 */
export async function processUploadFields(params: {
	sections: MutationFormSection[];
	args: Record<string, unknown>;
	progress: MutationFormProgress;
	uploadOne: MutationFormUploadOne;
}): Promise<boolean> {
	const { sections, args, progress, uploadOne } = params;

	for (const section of sections) {
		for (const f of section.fields) {
			if (f.kind !== 'upload-single' && f.kind !== 'upload-multiple') continue;

			const isSingle = f.kind === 'upload-single';
			const raw = args[f.id];
			// Single carries a lone File; multiple carries an ordered mix of existing
			// images (already-uploaded {key,url}) and newly picked Files.
			const items: UploadItem[] = isSingle
				? raw
					? [raw as File]
					: []
				: ((raw as UploadItem[] | undefined) ?? []);

			if (!items.length) {
				if (isSingle) {
					delete args[f.id];
				} else {
					args[f.id] = [];
				}
				continue;
			}

			try {
				// Only new Files are optimized + uploaded; existing images pass their key
				// straight through, and order is preserved so items[0] stays the cover.
				const files = items.filter((i): i is File => !isExistingImage(i));
				const optimized = files.length
					? await optimizeImages(files, undefined, progress.setOptimizeProgress)
					: [];

				const total = optimized.length;
				let fileIndex = 0;
				const refs: string[] = [];
				for (const item of items) {
					if (isExistingImage(item)) {
						refs.push(item.key);
						continue;
					}
					progress.beforeUploadFile(fileIndex + 1, total);
					const key = await uploadOne(optimized[fileIndex]);
					progress.afterUploadFile(fileIndex + 1, total);
					fileIndex++;
					if (!key) return false;
					refs.push(key);
				}

				args[f.id] = isSingle ? (refs[0] ?? null) : refs;
			} catch (err) {
				toast.error(err instanceof Error ? err.message : String(err));
				return false;
			}
		}
	}

	return true;
}

export function hasUploadFields(sections: MutationFormSection[]): boolean {
	return sections.some((s) =>
		s.fields.some((f) => f.kind === 'upload-single' || f.kind === 'upload-multiple')
	);
}
