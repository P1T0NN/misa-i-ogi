<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogTrigger
	} from '@/shared/components/ui/alert-dialog';

	// LUCIDE ICONS
	import { Loader } from '@lucide/svelte';

	interface Props {
		// Function to call when action is confirmed
		function: () => Promise<void> | void;

		// State props
		isPending?: boolean;
		/** When true the confirm action is rendered disabled. Use for typed-confirm or form-validity gates. */
		actionDisabled?: boolean;

		// Style props
		triggerClass?: string;
		actionClass?: string;
		/** When true, the dialog gets destructive styling (red-tinted title, destructive action button). */
		isDestructive?: boolean;
		/** When true, the proceed/action button is hidden — only the cancel button remains. */
		hideProceed?: boolean;

		// Children
		triggerChildren?: import('svelte').Snippet;
		/** Form fields or any extra UI rendered between the description and the footer. */
		body?: import('svelte').Snippet;

		// Open state control
		open?: boolean;
		onOpenChange?: (open: boolean) => void;

		// Custom text
		title?: string;
		description?: string;
	}

	let {
		function: actionFunction,
		isPending = false,
		actionDisabled = false,
		triggerClass = 'w-full',
		actionClass = '',
		isDestructive = false,
		hideProceed = false,
		triggerChildren,
		body,
		open = $bindable(false),
		onOpenChange,
		title,
		description
	}: Props = $props();

	// Internal pending state so the spinner/disabled markup renders even when the
	// caller doesn't drive `isPending`. Combined with the parent-supplied prop below.
	// (bits-ui's AlertDialog.Action does NOT auto-close — unlike Cancel/Close — so
	// the dialog stays open until we set `open = false` after the action settles.)
	let running = $state(false);
	const pending = $derived(isPending || running);

	async function handleAction() {
		if (pending) return;

		running = true;
		try {
			await actionFunction();
			open = false;
		} finally {
			running = false;
		}
	}
</script>

<AlertDialog bind:open {onOpenChange}>
	<AlertDialogTrigger class={triggerClass}>
		{@render triggerChildren?.()}
	</AlertDialogTrigger>

	<AlertDialogContent class={isDestructive ? 'ring-destructive/30' : ''}>
		<AlertDialogHeader>
			<AlertDialogTitle class={isDestructive ? 'text-destructive' : ''}>
				{title ?? m['AlertDialogButton.title']()}
			</AlertDialogTitle>
			<AlertDialogDescription>
				{description ?? m['AlertDialogButton.description']()}
			</AlertDialogDescription>
		</AlertDialogHeader>

		{#if body}
			<div class="py-2">
				{@render body()}
			</div>
		{/if}

		<AlertDialogFooter>
			<AlertDialogCancel
				type="button"
				onclick={() => (onOpenChange ? onOpenChange(false) : (open = false))}
				disabled={pending}
			>
				{m['AlertDialogButton.cancel']()}
			</AlertDialogCancel>

			{#if !hideProceed}
				<AlertDialogAction
					type="button"
					onclick={handleAction}
					class={actionClass}
					variant={isDestructive ? 'destructive' : 'default'}
					disabled={pending || actionDisabled}
				>
					{#if pending}
						<Loader class="h-3 w-3 animate-spin" />
					{/if}
					{m['AlertDialogButton.proceed']()}
				</AlertDialogAction>
			{/if}
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
