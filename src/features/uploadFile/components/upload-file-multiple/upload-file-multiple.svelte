<script lang="ts">
	// COMPONENTS
	import UploadFileEmpty from '../upload-file-empty.svelte';
	import UploadFileMultipleList from './upload-file-multiple-list.svelte';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';
	import { useFileUpload } from '../../utils/useFileUpload.svelte';

	// TYPES
	import type { UploadItem } from '../../types/uploadFileTypes';

	type Props = {
		class?: string;
		/** Ordered mix of existing images ({key,url}) and newly picked Files; items[0] is the cover. */
		items?: UploadItem[];
		accept?: string;
		disabled?: boolean;
		id?: string;
		/** Show a star control on each preview; the starred entry becomes `items[0]` (the cover). */
		hasCoverImage?: boolean;
	};

	let {
		class: className,
		items = $bindable<UploadItem[]>([]),
		accept,
		disabled = false,
		id: inputId,
		hasCoverImage = false
	}: Props = $props();

	const pickerInputId = $derived(inputId ?? 'upload-file-input-multiple');

	const upload = useFileUpload({
		getItems: () => items,
		setItems: (v) => {
			items = v;
		},
		getDisabled: () => disabled
	});
</script>

<div
	class={cn(
		'group/upload-file-multiple w-full max-w-2xl min-w-0',
		disabled && 'pointer-events-none opacity-50',
		className
	)}
	data-disabled={disabled ? 'true' : undefined}
>
	<div class="flex flex-col gap-4">
		<UploadFileEmpty
			{pickerInputId}
			{accept}
			{disabled}
			multipleFiles={true}
			dragOver={upload.dragOver}
			bind:fileInputRef={upload.inputRef}
			onFileInputChange={upload.handleInputChange}
			onDragEnter={() => {
				if (!disabled) upload.dragOver = true;
			}}
			onDragLeave={() => {
				upload.dragOver = false;
			}}
			onDragOver={upload.handleDragOver}
			onDrop={upload.handleDrop}
		/>

		{#if items.length > 0}
			<UploadFileMultipleList
				rows={upload.contentRows}
				bind:items
				onDragOver={upload.handleDragOver}
				onDrop={upload.handleDrop}
				{hasCoverImage}
			/>
		{/if}
	</div>
</div>
