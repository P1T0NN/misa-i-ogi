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
		<CardTitle>Venues by reservation requests</CardTitle>
		<CardDescription>Which hospitalities convert guest discovery into demand.</CardDescription>
	</CardHeader>
	<CardContent class="flex h-80 items-center justify-center px-4 text-center">
		<p class="text-sm text-muted-foreground">
			Reservation activity will appear here after guests submit requests to your venues.
		</p>
	</CardContent>
</Card>