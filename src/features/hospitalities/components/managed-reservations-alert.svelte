<script lang="ts">
	import { m } from '@/shared/lib/paraglide/messages';
	import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert/index.js';
	import InfoIcon from '@lucide/svelte/icons/info';
</script>

<Alert>
	<InfoIcon aria-hidden="true" />
	<AlertTitle>{m['ManagedReservationsAlert.title']()}</AlertTitle>
	<AlertDescription>{m['ManagedReservationsAlert.description']()}</AlertDescription>
</Alert>
