<script lang="ts">
	import AlertTriangleIcon from '@lucide/svelte/icons/alert-triangle';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';
</script>

<Card class="py-0">
	<CardHeader>
		<CardTitle>Could not load analytics overview</CardTitle>
		<CardDescription>Please try again or check back later.</CardDescription>
	</CardHeader>
	<CardContent class="flex flex-col items-center gap-4 py-8 text-center">
		<div class="flex size-12 items-center justify-center rounded-full bg-destructive/10">
			<AlertTriangleIcon class="size-5 text-destructive" />
		</div>
		<p class="max-w-md text-sm text-muted-foreground">
			The overview report could not be loaded right now.
		</p>
	</CardContent>
</Card>
