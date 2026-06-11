<script lang="ts">
	// LIBRARIES
	import { appGoto } from '@/shared/utils/app-navigation';
	import { m } from '@/shared/lib/paraglide/messages';
	import UserXIcon from '@lucide/svelte/icons/user-x';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
</script>

<div
	class="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed px-6 py-16 text-center"
>
	<div class="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
		<UserXIcon class="size-6" />
	</div>

	<div class="flex flex-col gap-1">
		<h2 class="text-lg font-semibold">{m['AdminUserPage.UserPageEmpty.title']()}</h2>
		<p class="max-w-sm text-sm text-muted-foreground">
			{m['AdminUserPage.UserPageEmpty.description']()}
		</p>
	</div>

	<Button variant="outline" size="sm" onclick={() => appGoto('/admin/users')}>
		<ArrowLeftIcon class="size-4" />
		{m['AdminUserPage.UserPageEmpty.backToUsers']()}
	</Button>
</div>
