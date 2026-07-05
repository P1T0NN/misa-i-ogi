<script lang="ts">
	// LIBRARIES
	import { getConvexClient } from '@mmailaender/convex-svelte';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import Dialog from '@/shared/components/ui/dialog/dialog.svelte';
	import { buttonVariants } from '@/shared/components/ui/button/index.js';
	import { Input } from '@/shared/components/ui/input/index.js';
	import ConvexMutationForm from '@/shared/components/ui/mutation-form/convex-mutation-form.svelte';
	import CustomTimeInput from '@/shared/components/ui/time-input/custom-time-input.svelte';

	// SCHEMAS
	import {
		createReservationSchema,
		type CreateReservationInput
	} from '@/features/reservations/schemas/reservationsSchemas';

	// UTILS
	import { cn } from '@/shared/utils/utils.js';

	// TYPES
	import type { Id } from '@/convex/_generated/dataModel';
	import type {
		MutationFormFieldSnippetProps,
		MutationFormPrepareSubmit,
		MutationFormSection
	} from '@/shared/components/ui/mutation-form/types.js';

	// LUCIDE ICONS
	import AlertTriangleIcon from '@lucide/svelte/icons/alert-triangle';

	let {
		open = $bindable(false),
		hospitalityName = '',
		hospitalityId
	}: {
		open?: boolean;
		hospitalityName?: string;
		hospitalityId: Id<'hospitalities'>;
	} = $props();

	const sections = $derived<MutationFormSection[]>([
		{
			plain: true,
			columns: 1,
			fields: [
				{
					id: 'guestName',
					kind: 'input',
					label: m['RequestReservationDialog.fieldGuestName'](),
					placeholder: m['RequestReservationDialog.fieldGuestNamePlaceholder'](),
					autocomplete: 'name',
					required: true,
					autofocus: true
				},
				{
					id: 'guestCount',
					kind: 'input',
					type: 'number',
					label: m['RequestReservationDialog.fieldGuestCount'](),
					placeholder: m['RequestReservationDialog.fieldGuestCountPlaceholder'](),
					required: true,
					description: m['RequestReservationDialog.fieldGuestCountDescription']()
				},
				{
					id: 'requestedTime',
					kind: 'input',
					label: m['RequestReservationDialog.fieldRequestedTime']()
				},
				{
					id: 'phone',
					kind: 'input',
					type: 'tel',
					label: m['RequestReservationDialog.fieldPhone'](),
					placeholder: m['RequestReservationDialog.fieldPhonePlaceholder'](),
					description: m['RequestReservationDialog.fieldPhoneDescription']()
				},
				{
					id: 'email',
					kind: 'input',
					type: 'email',
					label: m['RequestReservationDialog.fieldEmail'](),
					placeholder: m['RequestReservationDialog.fieldEmailPlaceholder']()
				}
			]
		}
	]);

	const convexClient = getConvexClient();

	// Quick-pick shortcuts for the most-requested reservation slots (lunch +
	// dinner peaks). Tapping fills the time; guests can still type any value.
	const QUICK_TIMES = ['13:00', '19:00', '20:00', '21:00'] as const;

	let values = $state<CreateReservationInput>({
		guestName: '',
		guestCount: 2,
		requestedTime: '',
		phone: '',
		email: ''
	});

	function resetForm() {
		values = {
			guestName: '',
			guestCount: 2,
			requestedTime: '',
			phone: '',
			email: ''
		};
	}

	/**
	 * `hospitalityId` is contextual route/page data, not guest-entered form data.
	 * Keep it out of the validation schema and inject it only into the Convex
	 * mutation args right before submit.
	 */
	const prepareSubmit: MutationFormPrepareSubmit<CreateReservationInput> = ({ args }) => {
		args.hospitalityId = hospitalityId;
	};

	function handleSuccess() {
		open = false;
		resetForm();
	}

	$effect(() => {
		if (!open) resetForm();
	});

	const dialogTitle = $derived(m['RequestReservationDialog.title']());
</script>

<button type="button" class={cn(buttonVariants(), 'h-11 w-full')} onclick={() => (open = true)}>
	{m['RequestReservationDialog.trigger']()}
</button>

<Dialog bind:open title={dialogTitle} class="sm:max-w-md">
	<p class="text-sm leading-relaxed text-muted-foreground">
		{#if hospitalityName}
			{m['RequestReservationDialog.descriptionWithName']({
				hospitalityName
			})}
		{:else}
			{m['RequestReservationDialog.description']()}
		{/if}
	</p>

	<ConvexMutationForm
		class="w-full"
		{sections}
		bind:values
		schema={createReservationSchema}
		runFunction={api.tables.reservations.mutations.createReservation.createReservation}
		submitLabel={m['RequestReservationDialog.submitLabel']()}
		resetOnSuccess={false}
		{convexClient}
		{prepareSubmit}
		onSuccess={handleSuccess}
		customFields={{ requestedTime: requestedTimeField, guestCount: guestCountField }}
	>
		{#snippet extraFields()}
			<div
				class="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3"
			>
				<AlertTriangleIcon class="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
				<div class="flex flex-col gap-1 text-sm">
					<p class="font-semibold text-destructive">
						{m['RequestReservationDialog.warningTitle']()}
					</p>
					<p class="text-foreground/90">
						{m['RequestReservationDialog.warningBody']()}
					</p>
				</div>
			</div>
		{/snippet}
	</ConvexMutationForm>
</Dialog>

{#snippet guestCountField({
	value,
	setValue,
	inputId,
	error
}: MutationFormFieldSnippetProps<CreateReservationInput>)}
	<Input
		id={inputId}
		name="guestCount"
		type="number"
		min={1}
		max={50}
		step={1}
		inputmode="numeric"
		placeholder={m['RequestReservationDialog.fieldGuestCountPlaceholder']()}
		required
		value={value === undefined || value === null ? '' : String(value)}
		oninput={(event) => setValue(event.currentTarget.value)}
		aria-invalid={error ? 'true' : undefined}
	/>
{/snippet}

{#snippet requestedTimeField({
	value,
	setValue
}: MutationFormFieldSnippetProps<CreateReservationInput>)}
	{@const current = String(value ?? '')}
	<div class="flex flex-col gap-2">
		<div class="flex flex-wrap gap-2" role="group" aria-label={m['RequestReservationDialog.quickTimesLabel']()}>
			{#each QUICK_TIMES as time (time)}
				{@const active = current === time}
				<button
					type="button"
					aria-pressed={active}
					onclick={() => setValue(time)}
					class={cn(
						'rounded-lg border px-3 py-1.5 font-mono text-sm transition-colors',
						active
							? 'border-primary bg-primary text-primary-foreground'
							: 'border-input bg-card text-foreground hover:border-primary'
					)}
				>
					{time}
				</button>
			{/each}
		</div>
		<CustomTimeInput value={current} label="" class="w-full" onchange={setValue} />
	</div>
{/snippet}
