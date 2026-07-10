<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import UploadFileItemMultiple from './upload-file-item-multiple.svelte';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';
	import { isExistingImage } from '../../types/uploadFileTypes';

	// TYPES
	import type { UploadItem, UploadFileMultiRow } from '../../types/uploadFileTypes';

	type Props = {
		rows: UploadFileMultiRow[];
		items?: UploadItem[];
		onDragOver?: (e: DragEvent) => void;
		onDrop?: (e: DragEvent) => void;
		hasCoverImage?: boolean;
		class?: string;
	};

	let {
		rows,
		items = $bindable<UploadItem[]>([]),
		onDragOver,
		onDrop,
		hasCoverImage = false,
		class: className
	}: Props = $props();

	function rowKey(row: UploadFileMultiRow): string {
		return isExistingImage(row.item)
			? `existing-${row.item.key}`
			: `file-${row.item.name}-${row.item.size}-${row.item.lastModified}-${row.index}`;
	}
</script>

<!-- Input lives on `UploadFileEmpty`; this region only lists previews + accepts drops. -->
<div
	class={cn('grid grid-cols-2 gap-3 sm:grid-cols-3', className)}
	role="region"
	aria-label={m['UploadFile.UploadFileMultiple.placeholder']()}
	aria-live="polite"
	ondragover={onDragOver}
	ondrop={onDrop}
>
	{#each rows as row (rowKey(row))}
		<UploadFileItemMultiple
			item={row.item}
			index={row.index}
			bind:items
			previewUrl={row.previewUrl}
			{hasCoverImage}
		/>
	{/each}
</div>
