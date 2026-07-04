<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	// TYPES
	import type { Snippet } from 'svelte';

	// LUCIDE ICONS
	import XIcon from '@lucide/svelte/icons/x';

	type Props = {
		/** Two-way bound open state. */
		open?: boolean;
		/** Optional heading rendered in the dialog header. */
		title?: string;
		/** When true, children supply the full layout (title row, close, etc.). */
		hideHeader?: boolean;
		class?: string;
		contentClass?: string;
		children: Snippet;
	};

	let {
		open = $bindable(false),
		title,
		hideHeader = false,
		class: className,
		contentClass,
		children
	}: Props = $props();

	let dialog = $state<HTMLDialogElement>();

	// Native <dialog> with showModal() covers the viewport — keep the element
	// transparent and full-screen; the visible panel is the inner wrapper.
	$effect(() => {
		if (!dialog) return;
		if (open) dialog.showModal();
		else if (dialog.open) dialog.close();
	});
</script>

<dialog
	bind:this={dialog}
	onclose={() => (open = false)}
	onclick={(e) => {
		// A click whose target is the dialog itself is a backdrop click.
		if (e.target === dialog) open = false;
	}}
	class={cn(
		'fixed inset-0 m-0 size-full max-h-none max-w-none border-0 bg-transparent p-0 shadow-none',
		'backdrop:bg-black/65 backdrop:backdrop-blur-sm',
		open && 'flex items-center justify-center p-4 sm:p-6'
	)}
>
	{#if open}
		<div
			class={cn(
				'relative flex w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-2xl',
				className
			)}
		>
			<div class={cn('relative max-h-[85vh] overflow-y-auto p-6 sm:p-8', contentClass)}>
				{#if hideHeader}
					<button
						type="button"
						onclick={() => (open = false)}
						aria-label={m['GenericMessages.DIALOG_CLOSE']()}
						class="absolute top-4 right-4 z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					>
						<XIcon class="size-5" strokeWidth={1.6} />
					</button>
				{:else}
					<div class="flex items-start justify-between gap-4">
						{#if title}
							<h2 class="font-serif text-2xl leading-tight text-foreground">{title}</h2>
						{/if}

						<button
							type="button"
							onclick={() => (open = false)}
							aria-label={m['GenericMessages.DIALOG_CLOSE']()}
							class="-mt-2 -mr-2 ml-auto inline-flex size-9 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
						>
							<XIcon class="size-5" strokeWidth={1.6} />
						</button>
					</div>
				{/if}

				<div class={hideHeader ? undefined : 'mt-4'}>
					{@render children()}
				</div>
			</div>
		</div>
	{/if}
</dialog>
