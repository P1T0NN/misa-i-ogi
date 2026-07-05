<script lang="ts">
	// ICONS
	import ClockIcon from '@lucide/svelte/icons/clock';

	let {
		value = $bindable(''),
		label = 'Time',
		disabled = false,
		onchange,
		class: className = ''
	}: {
		value?: string;
		label?: string;
		disabled?: boolean;
		onchange?: (value: string) => void;
		class?: string;
	} = $props();

	let inputEl = $state<HTMLInputElement | null>(null);
	let focused = $state(false);

	// Reflect programmatic `value` changes (e.g. quick-pick buttons) into the
	// display — but only while unfocused, so it never fights mid-typing input.
	$effect(() => {
		if (!focused && inputEl && inputEl.value !== value) {
			inputEl.value = value;
		}
	});

	function handleInput(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		let raw = input.value.replace(/\D/g, '').slice(0, 4);

		if (raw.length >= 2) {
			raw = raw.slice(0, 2) + ':' + raw.slice(2);
		}

		input.value = raw;

		// Only emit when we have a full "HH:MM"
		if (raw.length === 5) {
			const [h, m] = raw.split(':');
			const hh = parseInt(h, 10);
			const mm = parseInt(m, 10);
			if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
				value = raw;
				onchange?.(raw);
			}
		} else {
			value = '';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		// Allow: backspace, delete, tab, escape, enter, arrows
		const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];
		if (allowed.includes(e.key)) return;

		// Block non-digits
		if (!/^\d$/.test(e.key)) {
			e.preventDefault();
		}
	}

	function handleBlur() {
		focused = false;
		// If partial input (e.g. "12:"), clear it
		const input = inputEl;
		if (!input) return;
		const raw = input.value;
		if (raw.length < 5) {
			input.value = '';
			value = '';
		}
	}
</script>

<div class="relative inline-flex flex-col gap-1.5 {className}">
	{#if label}
		<span class="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
			{label}
		</span>
	{/if}

	<div class="relative">
		<ClockIcon
			class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			aria-hidden="true"
		/>
		<input
			bind:this={inputEl}
			type="text"
			inputmode="numeric"
			placeholder="HH:MM"
			maxlength="5"
			{disabled}
			oninput={handleInput}
			onkeydown={handleKeydown}
			onfocus={() => (focused = true)}
			onblur={handleBlur}
			class="h-10 w-full rounded-xl border border-input bg-card pr-3 pl-9 font-mono text-sm text-foreground transition-colors placeholder:text-muted-foreground hover:border-primary focus:border-primary focus:ring-2 focus:ring-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-45"
			aria-label={label || 'Time'}
		/>
	</div>
</div>
