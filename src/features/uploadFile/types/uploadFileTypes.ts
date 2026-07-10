/** An already-uploaded image (edit forms): its R2 key + cached url, not re-uploaded. */
export type ExistingImage = { key: string; url: string };

/** A multi-upload entry: either a newly picked File or an already-uploaded image. */
export type UploadItem = File | ExistingImage;

export function isExistingImage(item: UploadItem): item is ExistingImage {
	return !(item instanceof File);
}

/** Single-upload preview row. */
export type UploadFileRow = {
	file: File;
	index: number;
	previewUrl: string | null;
};

/** Multi-upload preview row — the entry can be a new File or an existing image. */
export type UploadFileMultiRow = {
	item: UploadItem;
	index: number;
	previewUrl: string | null;
};
