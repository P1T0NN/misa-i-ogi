<script lang="ts">
	import { Skeleton } from '@/shared/components/ui/skeleton/index.js';
	import * as Card from '@/shared/components/ui/card/index.js';
</script>

<Card.Root class="py-0">
	<Card.Header>
		<Card.Title class="text-sm">QR scans</Card.Title>
		<Card.Description class="text-xs text-muted-foreground">
			Guest check-in scans from connected stays over time.
		</Card.Description>
	</Card.Header>
	<Card.Content class="px-2 pb-4 sm:px-4">
		<Skeleton class="h-72 w-full rounded-lg" />
	</Card.Content>
</Card.Root>
