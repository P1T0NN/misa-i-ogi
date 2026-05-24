<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import UploadFileEmpty from '../upload-file-empty.svelte';
	import UploadFileSingleContent from './upload-file-single-content.svelte';
	import { Button } from '@/shared/components/ui/button/index.js';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	type Props = {
		class?: string;
		file?: File | null;
		/** Kept empty in single mode; bind for API symmetry with multiple. */
		files?: File[];
		accept?: string;
		disabled?: boolean;
		id?: string;
		/** Shown in the upload slot until the user picks a replacement file (edit forms). */
		existingPreviewUrl?: string | null;
		existingPreviewAlt?: string;
	};

	let {
		class: className,
		file = $bindable<File | null>(null),
		files = $bindable<File[]>([]),
		accept,
		disabled = false,
		id: inputId,
		existingPreviewUrl = null,
		existingPreviewAlt = ''
	}: Props = $props();

	const pickerInputId = $derived(inputId ?? 'upload-file-input-single');

	let inputRef: HTMLInputElement | null = $state(null);
	let dragOver = $state(false);

	const hasExistingPreview = $derived(file === null && Boolean(existingPreviewUrl?.trim()));
	const isEmpty = $derived(file === null && !hasExistingPreview);
	const noSelection = $derived(file === null);

	function fileKey(f: File): string {
		return `${f.name}-${f.size}-${f.lastModified}`;
	}

	function previewKey(f: File, index: number): string {
		return `${fileKey(f)}#${index}`;
	}

	const displayList = $derived(file ? [file] : []);

	let previewUrls = $state<Record<string, string>>({});

	const contentRows = $derived(
		displayList.map((f, index) => ({
			file: f,
			index,
			previewUrl: previewUrls[previewKey(f, index)] ?? null
		}))
	);

	$effect(() => {
		const list = displayList;
		const next: Record<string, string> = {};
		list.forEach((f, index) => {
			if (f.type.startsWith('image/')) {
				next[previewKey(f, index)] = URL.createObjectURL(f);
			}
		});
		const revoke = next;
		previewUrls = next;
		return () => {
			for (const u of Object.values(revoke)) URL.revokeObjectURL(u);
		};
	});

	$effect(() => {
		if (noSelection && inputRef) inputRef.value = '';
	});

	function applyPickedList(list: FileList | null) {
		if (!list?.length) return;
		file = list[0];
		files = [];
		if (inputRef) inputRef.value = '';
	}

	function onInputChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		applyPickedList(input.files);
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		if (disabled) return;
		const dropped = e.dataTransfer?.files;
		if (!dropped?.length) return;
		file = dropped[0];
		files = [];
		if (inputRef) inputRef.value = '';
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		if (!disabled && e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
	}

	function replaceExisting() {
		inputRef?.click();
	}
</script>

<div
	class={cn(
		'group/upload-file-single w-full min-w-0 max-w-md',
		disabled && 'pointer-events-none opacity-50',
		className
	)}
	data-disabled={disabled ? 'true' : undefined}
>
	<input
		id={pickerInputId}
		bind:this={inputRef}
		type="file"
		class="sr-only"
		{accept}
		{disabled}
		onchange={onInputChange}
	/>

	{#if hasExistingPreview}
		<div
			class="border-input bg-card flex gap-3 rounded-xl border p-3 shadow-sm"
			role="region"
			aria-label={existingPreviewAlt || m['UploadFile.UploadFileSingle.placeholder']()}
		>
			<div class="bg-muted/40 relative aspect-4/3 w-28 shrink-0 overflow-hidden rounded-lg border">
				<img
					src={existingPreviewUrl}
					alt={existingPreviewAlt}
					class="size-full object-cover"
					draggable="false"
					loading="lazy"
					decoding="async"
				/>
			</div>

			<div class="min-w-0 flex-1 py-0.5">
				<p class="text-foreground text-sm font-medium">
					{m['UploadFile.UploadFileSingle.existingCover']()}
				</p>
				<p class="text-muted-foreground mt-0.5 text-xs">
					{m['UploadFile.UploadFileSingle.existingCoverHint']()}
				</p>
				<div class="mt-3">
					<Button type="button" variant="outline" size="sm" onclick={replaceExisting}>
						{m['UploadFile.UploadFileSingle.replace']()}
					</Button>
				</div>
			</div>
		</div>
	{:else if isEmpty}
		<UploadFileEmpty
			{pickerInputId}
			{accept}
			{disabled}
			multipleFiles={false}
			dragOver={dragOver}
			bind:fileInputRef={inputRef}
			onFileInputChange={onInputChange}
			onDragEnter={() => {
				if (!disabled) dragOver = true;
			}}
			onDragLeave={() => {
				dragOver = false;
			}}
			{onDragOver}
			{onDrop}
		/>
	{:else}
		<UploadFileSingleContent
			rows={contentRows}
			{pickerInputId}
			{accept}
			{disabled}
			bind:files
			bind:selectedFile={file}
			bind:fileInputRef={inputRef}
			onFileInputChange={onInputChange}
			{onDragOver}
			{onDrop}
		/>
	{/if}
</div>
