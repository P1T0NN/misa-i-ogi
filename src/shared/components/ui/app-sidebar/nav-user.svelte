<script lang="ts">
	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';

	// COMPONENT
	import LogoutButton from '@/features/auth/components/logout-button/logout-button.svelte';
	import NavUserPlan from './nav-user-plan.svelte';
	import * as Avatar from '@/shared/components/ui/avatar/index.js';
	import * as DropdownMenu from '@/shared/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '@/shared/components/ui/sidebar/index.js';
	import { Spinner } from '@/shared/components/ui/spinner/index.js';

	// LUCIDE ICONS
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';

	const sidebar = Sidebar.useSidebar();

	const auth = useAuth();
	const user = $derived(authClass.currentUser);
	const userLoading = $derived(authClass.userLoading);

	/** Avoid “Account” flash before auth + Convex have settled. */
	const showUserLoading = $derived(
		auth.isLoading || userLoading || (auth.isAuthenticated && user === undefined)
	);

	// Plan state — single source of truth for both the trigger pill and the dropdown
	// section. `plan` (paid tier) and `proTrialEndsAt` are independent: a trial never
	// sets `plan: 'pro'`, and Pro always wins over any trial.
	const DAY_MS = 86_400_000;
	const now = Date.now();
	const isPro = $derived(user?.plan === 'pro');
	const trialEndsAt = $derived(user?.proTrialEndsAt ?? null);
	const trialActive = $derived(!isPro && trialEndsAt !== null && trialEndsAt > now);
	const trialEnded = $derived(!isPro && trialEndsAt !== null && trialEndsAt <= now);
	const trialDaysLeft = $derived(
		trialEndsAt !== null ? Math.max(1, Math.ceil((trialEndsAt - now) / DAY_MS)) : 0
	);

	let isLoggingOut = $state(false);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger disabled={showUserLoading || isLoggingOut}>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						{#if showUserLoading}
							<div
								class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent/30"
								aria-hidden="true"
							>
								<Spinner class="size-4 text-sidebar-foreground" />
							</div>
						{:else}
							<Avatar.Root class="size-8 rounded-lg">
								<Avatar.Image src={user?.image} alt={user?.name ?? ''} />

								<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
							</Avatar.Root>

							<div class="grid flex-1 text-start text-sm leading-tight">
								<span class="flex items-center gap-1.5">
									<span class="truncate font-medium">{user?.name ?? 'Account'}</span>

									{#if isPro}
										<span
											class="shrink-0 rounded bg-primary/10 px-1 text-[10px] font-semibold tracking-wide text-primary uppercase"
										>
											{m['NavUserPlan.pro']()}
										</span>
									{:else if trialActive}
										<span
											class="shrink-0 rounded bg-muted px-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase"
										>
											{m['NavUserPlan.trialShort']()}
										</span>
									{/if}
								</span>

								<span class="truncate text-xs text-muted-foreground">{user?.email ?? ''}</span>
							</div>
						{/if}

						<ChevronsUpDownIcon class="ms-auto size-4 shrink-0" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>

			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user?.image} alt={user?.name ?? ''} />

							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>

						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">{user?.name ?? 'Account'}</span>

							<span class="truncate text-xs text-muted-foreground">{user?.email ?? ''}</span>
						</div>
					</div>
				</DropdownMenu.Label>

				{#if user}
					<DropdownMenu.Separator />

					<DropdownMenu.Group>
						<NavUserPlan {isPro} {trialActive} {trialEnded} daysLeft={trialDaysLeft} />
					</DropdownMenu.Group>
				{/if}

				<DropdownMenu.Separator />

				<LogoutButton bind:isLoggingOut />
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
