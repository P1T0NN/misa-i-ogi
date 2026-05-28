<script lang="ts">
	// LIBRARIES
	import { getConvexClient } from '@mmailaender/convex-svelte';
	import { api } from '@/convex/_generated/api';

	// COMPONENTS
	import * as Dialog from '@/shared/components/ui/dialog/index.js';
	import { buttonVariants } from '@/shared/components/ui/button/index.js';
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

	const sections: MutationFormSection[] = [
		{
			plain: true,
			columns: 1,
			fields: [
				{
					id: 'guestName',
					kind: 'input',
					label: 'Guest name',
					placeholder: 'Your full name',
					autocomplete: 'name',
					required: true,
					autofocus: true
				},
				{
					id: 'requestedTime',
					kind: 'input',
					label: 'Preferred time'
				},
				{
					id: 'phone',
					kind: 'input',
					type: 'tel',
					label: 'Phone number',
					placeholder: '+381 6X XXX XXXX',
					description:
						'If your number is not Serbian, please write the full number with your country prefix (+...) and make sure it is a WhatsApp number — the hospitality owner will reach you there directly.'
				},
				{
					id: 'email',
					kind: 'input',
					type: 'email',
					label: 'Email (optional)',
					placeholder: 'you@example.com'
				}
			]
		}
	];

	const convexClient = getConvexClient();

	let values = $state<CreateReservationInput>({
		guestName: '',
		requestedTime: '',
		phone: '',
		email: ''
	});

	function resetForm() {
		values = {
			guestName: '',
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
		Request Reservation
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="font-serif text-xl">Request Reservation</Dialog.Title>
			<Dialog.Description>
				Fill in your details{#if hospitalityName}
					and <strong>{hospitalityName}</strong> will contact you to confirm{/if}.
			</Dialog.Description>
		</Dialog.Header>

		<ConvexMutationForm
			class="w-full"
			{sections}
			bind:values
			schema={createReservationSchema}
			runFunction={api.tables.reservations.mutations.createReservation.createReservation}
			submitLabel="Send Request"
			resetOnSuccess={false}
			{convexClient}
			{prepareSubmit}
			onSuccess={handleSuccess}
			customFields={{ requestedTime: requestedTimeField }}
		>
			{#snippet extraFields()}
				<div
					class="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3"
				>
					<AlertTriangleIcon class="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
					<div class="flex flex-col gap-1 text-sm">
						<p class="font-semibold text-destructive">Important — please read carefully</p>
						<p class="text-foreground/90">
							The hospitality owner <strong>WILL contact you</strong> to confirm your reservation.
							If you <strong>do not answer back in time</strong>, your reservation
							<strong>WILL BE CANCELLED</strong>.
						</p>
					</div>
				</div>
			{/snippet}
		</ConvexMutationForm>
	</Dialog.Content>
</Dialog.Root>

{#snippet requestedTimeField({
	value,
	setValue
}: MutationFormFieldSnippetProps<CreateReservationInput>)}
	<CustomTimeInput value={String(value ?? '')} label="" class="w-full" onchange={setValue} />
{/snippet}
