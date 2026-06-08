<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import * as DropdownMenu from '@/shared/components/ui/dropdown-menu/index.js';
	import Spinner from '@/shared/components/ui/spinner/spinner.svelte';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';
	import { useLogout } from './logout-button.svelte.js';

	// TYPES
	import type { ClassValue } from 'clsx';

	// LUCIDE ICONS
	import LogOutIcon from '@lucide/svelte/icons/log-out';

	let {
		variant = 'destructive',
		class: className,
		disabled = false,
		isLoggingOut = $bindable(false)
	}: {
		variant?: 'default' | 'destructive';
		class?: ClassValue;
		disabled?: boolean;
		isLoggingOut?: boolean;
	} = $props();

	const { isLoggingOut: loggingOut, logout } = useLogout();

	$effect(() => {
		isLoggingOut = loggingOut;
	});
</script>

<DropdownMenu.Item
	{variant}
	disabled={disabled || loggingOut}
	onclick={logout}
	class={cn(className)}
>
	{#if loggingOut}
		<Spinner />
	{:else}
		<LogOutIcon />
	{/if}
	<span>{m['LogoutButton.logout']()}</span>
</DropdownMenu.Item>
