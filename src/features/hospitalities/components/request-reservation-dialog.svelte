<script lang="ts">
	// LIBRARIES
	import { getConvexClient } from '@mmailaender/convex-svelte';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// COMPONENTS
	import * as Dialog from '@/shared/components/ui/dialog/index.js';
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
					label: m['HospitalityPage.RequestReservationDialog.fieldGuestName'](),
					placeholder: m['HospitalityPage.RequestReservationDialog.fieldGuestNamePlaceholder'](),
					autocomplete: 'name',
					required: true,
					autofocus: true
				},
				{
					id: 'guestCount',
					kind: 'input',
					type: 'number',
					label: m['HospitalityPage.RequestReservationDialog.fieldGuestCount'](),
					placeholder: m['HospitalityPage.RequestReservationDialog.fieldGuestCountPlaceholder'](),
					required: true,
					description: m['HospitalityPage.RequestReservationDialog.fieldGuestCountDescription']()
				},
				{
					id: 'requestedTime',
					kind: 'input',
					label: m['HospitalityPage.RequestReservationDialog.fieldRequestedTime']()
				},
				{
					id: 'phone',
					kind: 'input',
					type: 'tel',
					label: m['HospitalityPage.RequestReservationDialog.fieldPhone'](),
					placeholder: m['HospitalityPage.RequestReservationDialog.fieldPhonePlaceholder'](),
					description: m['HospitalityPage.RequestReservationDialog.fieldPhoneDescription']()
				},
				{
					id: 'email',
					kind: 'input',
					type: 'email',
					label: m['HospitalityPage.RequestReservationDialog.fieldEmail'](),
					placeholder: m['HospitalityPage.RequestReservationDialog.fieldEmailPlaceholder']()
				}
			]
		}
	]);

	const convexClient = getConvexClient();

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
</script>

<Dialog.Root
	bind:open
	onOpenChange={(o) => {
		if (!o) resetForm();
	}}
>
	<Dialog.Trigger type="button" class={cn(buttonVariants(), 'h-11 w-full')}>
		{m['HospitalityPage.RequestReservationDialog.trigger']()}
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="font-serif text-xl">
				{m['HospitalityPage.RequestReservationDialog.title']()}
			</Dialog.Title>
			<Dialog.Description>
				{#if hospitalityName}
					{m['HospitalityPage.RequestReservationDialog.descriptionWithName']({
						hospitalityName
					})}
				{:else}
					{m['HospitalityPage.RequestReservationDialog.description']()}
				{/if}
			</Dialog.Description>
		</Dialog.Header>

		<ConvexMutationForm
			class="w-full"
			{sections}
			bind:values
			schema={createReservationSchema}
			runFunction={api.tables.reservations.mutations.createReservation.createReservation}
			submitLabel={m['HospitalityPage.RequestReservationDialog.submitLabel']()}
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
							{m['HospitalityPage.RequestReservationDialog.warningTitle']()}
						</p>
						<p class="text-foreground/90">
							{m['HospitalityPage.RequestReservationDialog.warningBody']()}
						</p>
					</div>
				</div>
			{/snippet}
		</ConvexMutationForm>
	</Dialog.Content>
</Dialog.Root>

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
		placeholder={m['HospitalityPage.RequestReservationDialog.fieldGuestCountPlaceholder']()}
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
	<CustomTimeInput value={String(value ?? '')} label="" class="w-full" onchange={setValue} />
{/snippet}
