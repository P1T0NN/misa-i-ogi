<script lang="ts">
	// COMPONENTS
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '@/shared/components/ui/card/index.js';
</script>

<Card>
	<CardHeader>
		<CardTitle>Reservation trend</CardTitle>
		<CardDescription>Daily reservation outcomes across connected places.</CardDescription>
	</CardHeader>
	<CardContent class="flex h-80 items-center justify-center px-4 text-center">
		<p class="text-sm text-muted-foreground">
			Reservation status data will appear here after guests submit requests.
		</p>
	</CardContent>
</Card>