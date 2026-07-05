<script lang="ts">
	// AUTH
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

	// COMPONENTS
	import LogoutButton from '@/features/auth/components/logout-button/logout-button.svelte';
	import * as Avatar from '@/shared/components/ui/avatar/index.js';
	import * as DropdownMenu from '@/shared/components/ui/dropdown-menu/index.js';
	import Spinner from '@/shared/components/ui/spinner/spinner.svelte';

	// UTILS
	import { appGoto } from '@/shared/utils/app-navigation';
	import { initialsFromName } from '@/shared/utils/stringUtils';
	import { cn } from '@/shared/utils/utils.js';

	// LUCIDE ICONS
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';

	// TYPES
	import type { ClassValue } from 'clsx';

	type Props = {
		class?: string;
		align?: 'start' | 'center' | 'end';
		side?: 'top' | 'right' | 'bottom' | 'left';
	};

	let { class: className, align = 'end', side = 'bottom' }: Props = $props();

	const user = $derived(authClass.currentUser);
	const userLoading = $derived(authClass.userLoading || user === undefined);

	let isLoggingOut = $state(false);

	const displayName = $derived(String(user?.name || user?.email || 'Account'));
	const initials = $derived(initialsFromName(displayName));

	const goToDashboard = () => {
		appGoto(PROTECTED_PAGE_ENDPOINTS.DASHBOARD);
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger disabled={userLoading || isLoggingOut}>
		{#snippet child({ props })}
			<button
				{...props}
				type="button"
				class={cn(
					'group flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60',
					className,
					props.class as ClassValue
				)}
				aria-label="Open account menu"
			>
				<Avatar.Root class="size-8">
					{#if user?.image}
						<Avatar.Image src={user.image} alt={displayName} />
					{/if}
					<Avatar.Fallback>
						{#if !userLoading}{initials}{/if}
					</Avatar.Fallback>
				</Avatar.Root>
				{#if userLoading}
					<span class="absolute" aria-hidden="true">
						<Spinner class="size-3.5 text-muted-foreground" />
					</span>
				{/if}
			</button>
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content
		class="w-64 rounded-lg border-border bg-popover p-1.5 shadow-lg"
		{align}
		{side}
		sideOffset={8}
	>
		<DropdownMenu.Label class="p-2 font-normal">
			<div class="flex min-w-0 items-center gap-2.5">
				<Avatar.Root class="size-9">
					{#if user?.image}
						<Avatar.Image src={user.image} alt={displayName} />
					{/if}
					<Avatar.Fallback>{initials}</Avatar.Fallback>
				</Avatar.Root>

				<div class="grid min-w-0 flex-1 text-start leading-tight">
					<span class="truncate text-sm font-medium text-foreground">{displayName}</span>
					{#if user?.email}
						<span class="truncate text-xs text-muted-foreground">{user.email}</span>
					{/if}
				</div>
			</div>
		</DropdownMenu.Label>

		<DropdownMenu.Separator />

		<DropdownMenu.Item onclick={goToDashboard}>
			<LayoutDashboardIcon />
			<span>Dashboard</span>
		</DropdownMenu.Item>

		<DropdownMenu.Separator />

		<LogoutButton bind:isLoggingOut />
	</DropdownMenu.Content>
</DropdownMenu.Root>
