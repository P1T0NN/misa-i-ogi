// TYPES
import { isExistingImage, type UploadItem, type UploadFileMultiRow } from '../types/uploadFileTypes';

export type UseFileUploadOptions = {
	getItems: () => UploadItem[];
	setItems: (value: UploadItem[]) => void;
	getDisabled: () => boolean;
};

function itemKey(item: UploadItem, index: number): string {
	return isExistingImage(item)
		? `existing-${item.key}#${index}`
		: `file-${item.name}-${item.size}-${item.lastModified}#${index}`;
}

/**
 * Shared state for the multi-image picker: object-URL previews for new Files
 * (revoked on change), existing images shown from their cached url, drag state,
 * and the input ref. Picks/drops APPEND to the ordered array so `items[0]` stays
 * the cover. The component owns the `items` state; this hook reads/writes it via
 * the getters so previews and ordering stay reactive.
 */
class FileUpload {
	dragOver = $state(false);
	inputRef = $state<HTMLInputElement | null>(null);
	#previewUrls = $state<Record<string, string>>({});
	#options: UseFileUploadOptions;

	contentRows = $derived.by<UploadFileMultiRow[]>(() =>
		this.#options.getItems().map((item, index) => ({
			item,
			index,
			previewUrl: isExistingImage(item)
				? item.url
				: (this.#previewUrls[itemKey(item, index)] ?? null)
		}))
	);

	constructor(options: UseFileUploadOptions) {
		this.#options = options;

		// Object URLs only for new Files; existing images already carry a permanent url.
		$effect(() => {
			const next: Record<string, string> = {};
			this.#options.getItems().forEach((item, index) => {
				if (!isExistingImage(item) && item.type.startsWith('image/')) {
					next[itemKey(item, index)] = URL.createObjectURL(item);
				}
			});
			this.#previewUrls = next;
			return () => {
				for (const url of Object.values(next)) URL.revokeObjectURL(url);
			};
		});
	}

	#addFiles(list: FileList | null | undefined) {
		if (!list?.length || this.#options.getDisabled()) return;
		this.#options.setItems([...this.#options.getItems(), ...Array.from(list)]);
		if (this.inputRef) this.inputRef.value = '';
	}

	handleInputChange = (event: Event) => {
		this.#addFiles((event.currentTarget as HTMLInputElement).files);
	};

	handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		if (!this.#options.getDisabled() && event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
	};

	handleDrop = (event: DragEvent) => {
		event.preventDefault();
		this.dragOver = false;
		this.#addFiles(event.dataTransfer?.files);
	};
}

export function useFileUpload(options: UseFileUploadOptions): FileUpload {
	return new FileUpload(options);
}
