<script lang="ts">
	import SelectField from '@/shared/components/ui/mutation-form/select-field.svelte';
	import ManagedReservationsAlert from './managed-reservations-alert.svelte';
	import type { MutationFormFieldDef } from '@/shared/components/ui/mutation-form/types.js';

	let {
		field,
		inputId,
		value,
		setValue,
		invalid
	}: {
		field: MutationFormFieldDef;
		inputId: string;
		value: unknown;
		setValue: (next: unknown) => void;
		invalid: boolean;
	} = $props();
</script>

<div class="flex flex-col gap-3">
	<SelectField {field} {inputId} {value} {setValue} {invalid} />
	<ManagedReservationsAlert />
</div>
