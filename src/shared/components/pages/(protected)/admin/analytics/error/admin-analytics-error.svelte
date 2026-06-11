<script lang="ts">
	// COMPONENTS
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';
	import { TryAgainErrorButton } from '@/shared/components/ui/try-again-error-button/index.js';

	// LUCIDE ICONS
	import AlertTriangleIcon from '@lucide/svelte/icons/triangle-alert';
</script>

<Card class="overflow-hidden py-0">
	<CardHeader class="border-b border-border/60 bg-muted/20">
		<CardTitle>Could not load platform analytics</CardTitle>
		<CardDescription>
			The analytics snapshot could not be loaded right now. Your other admin tools are still
			available.
		</CardDescription>
	</CardHeader>

	<CardContent class="flex flex-col items-center gap-5 px-6 py-10 text-center sm:py-12">
		<div
			class="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive"
			aria-hidden="true"
		>
			<AlertTriangleIcon class="size-6" />
		</div>

		<div class="flex max-w-md flex-col gap-2">
			<p class="text-sm font-medium text-foreground">
				Something went wrong while loading analytics
			</p>
			<p class="text-sm text-muted-foreground">
				This is usually temporary. Retry to refresh metrics, trends, and top entity rankings.
			</p>
		</div>

		<TryAgainErrorButton />
	</CardContent>
</Card>
