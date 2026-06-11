<script lang="ts">
	// COMPONENTS
	import * as Card from '@/shared/components/ui/card/index.js';
	import AdminDashboardRecentReservationsEmpty from '../empty/admin-dashboard-recent-reservations-empty.svelte';
	import AdminDashboardRecentReservationsItem from './admin-dashboard-recent-reservations-item.svelte';

	// TYPES
	import type { Doc } from '@/convex/_generated/dataModel';

	let { reservations }: { reservations: Doc<'reservations'>[] } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Recent reservations</Card.Title>
		<Card.Description>Newest guest requests across all hospitality owners.</Card.Description>
	</Card.Header>

	<Card.Content class="space-y-3">
		{#each reservations as reservation (reservation._id)}
			<AdminDashboardRecentReservationsItem {reservation} />
		{:else}
			<AdminDashboardRecentReservationsEmpty />
		{/each}
	</Card.Content>
</Card.Root>
