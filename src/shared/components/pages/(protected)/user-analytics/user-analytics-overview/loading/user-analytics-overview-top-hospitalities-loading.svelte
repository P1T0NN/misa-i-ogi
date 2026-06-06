<script lang="ts">
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
	import * as Card from '@/shared/components/ui/card/index.js';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-sm">Top hospitalities</Card.Title>
		<Card.Description class="text-xs text-muted-foreground">
			Venues converting guest views into reservation requests.
		</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col gap-2">
		{#each { length: 3 }}
			<Skeleton class="h-12 w-full rounded-lg" />
		{/each}
	</Card.Content>
</Card.Root>
