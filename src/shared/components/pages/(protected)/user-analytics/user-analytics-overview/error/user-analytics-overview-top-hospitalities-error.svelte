<script lang="ts">
	import * as Card from '@/shared/components/ui/card/index.js';
	import AlertTriangleIcon from '@lucide/svelte/icons/alert-triangle';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-sm">Top hospitalities</Card.Title>
		<Card.Description class="text-xs text-muted-foreground">
			Venues converting guest views into reservation requests.
		</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col items-center gap-4 py-8 text-center">
		<div class="flex size-12 items-center justify-center rounded-full bg-destructive/10">
			<AlertTriangleIcon class="size-5 text-destructive" />
		</div>
		<div>
			<p class="text-sm font-medium">Could not load top hospitalities</p>
			<p class="mt-1 text-xs text-muted-foreground">
				Please try again or check back later.
			</p>
		</div>
	</Card.Content>
</Card.Root>
