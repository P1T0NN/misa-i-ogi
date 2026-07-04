<script lang="ts">
	import { Input } from '@/shared/components/ui/input/index.js';
	import type { MutationFormFieldDef } from './types.js';

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

<!-- Chrome ignores autocomplete="off" on address/phone-like fields; "new-password"
     is the workaround google-places-autocomplete already relies on. -->
<Input
	id={inputId}
	name={field.id}
	type={field.type ?? 'text'}
	placeholder={field.placeholder}
	autocomplete={field.autocomplete ?? 'new-password'}
	disabled={field.disabled}
	required={field.required}
	value={value as string | number | undefined}
	oninput={(e) => setValue(e.currentTarget.value)}
	aria-invalid={invalid ? 'true' : undefined}
/>
