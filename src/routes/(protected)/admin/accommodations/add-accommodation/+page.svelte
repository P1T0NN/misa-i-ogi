<script lang="ts">
	// LIBRARIES
	import { appGoto } from '@/shared/utils/app-navigation';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { ADMIN_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ConvexMutationForm from '@/shared/components/ui/mutation-form/convex-mutation-form.svelte';
	import { Button } from '@/shared/components/ui/button/index.js';
	import AdminOwnerField from '@/features/users/components/admin-owner-field.svelte';

	// SCHEMAS
	import {
		accommodationAddFormSchema,
		type AccommodationAddFormInputs
	} from '@/features/accommodations/schemas/accommodationsSchemas';

	// DATA
	import { accommodationTypeSelectOptions } from '@/features/accommodations/data/accommodationsData';

	// TYPES
	import type {
		MutationFormFieldSnippetProps,
		MutationFormSection
	} from '@/shared/components/ui/mutation-form/types.js';

	// LUCIDE ICONS
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';

	const sections: MutationFormSection[] = [
		{
			id: 'basics',
			title: m['AdminAccommodationAddPage.sectionBasicsTitle'](),
			description: m['AdminAccommodationAddPage.sectionBasicsDescription'](),
			fields: [
				{
					id: 'name',
					kind: 'input',
					label: m['AdminAccommodationAddPage.fieldName'](),
					placeholder: m['AdminAccommodationAddPage.fieldNamePlaceholder'](),
					autofocus: true,
					colSpan: 1
				},
				{
					id: 'type',
					kind: 'select',
					label: m['AdminAccommodationAddPage.fieldType'](),
					selectPlaceholder: m['AdminAccommodationAddPage.fieldTypePlaceholder'](),
					options: accommodationTypeSelectOptions(),
					colSpan: 1
				},
				{
					id: 'ownerId',
					kind: 'input',
					label: m['AdminAccommodationAddPage.fieldOwner'](),
					colSpan: 2
				}
			]
		},
		{
			id: 'location',
			title: m['AdminAccommodationAddPage.sectionLocationTitle'](),
			description: m['AdminAccommodationAddPage.sectionLocationDescription'](),
			fields: [
				{
					id: 'address',
					kind: 'input',
					label: m['AdminAccommodationAddPage.fieldAddress'](),
					placeholder: m['AdminAccommodationAddPage.fieldAddressPlaceholder'](),
					autocomplete: 'street-address'
				},
				{
					id: 'city',
					kind: 'input',
					label: m['AdminAccommodationAddPage.fieldCity'](),
					placeholder: m['AdminAccommodationAddPage.fieldCityPlaceholder'](),
					autocomplete: 'address-level2',
					colSpan: 1
				},
				{
					id: 'country',
					kind: 'input',
					label: m['AdminAccommodationAddPage.fieldCountry'](),
					placeholder: m['AdminAccommodationAddPage.fieldCountryPlaceholder'](),
					autocomplete: 'country-name',
					colSpan: 1
				}
			]
		},
		{
			id: 'cover',
			title: m['AdminAccommodationAddPage.sectionCoverTitle'](),
			description: m['AdminAccommodationAddPage.sectionCoverDescription'](),
			columns: 1,
			fields: [
				{
					id: 'coverImageKey',
					kind: 'upload-single',
					label: m['AdminAccommodationAddPage.fieldCoverImage'](),
					accept: 'image/*'
				}
			]
		},
		{
			id: 'details',
			title: m['AdminAccommodationAddPage.sectionDetailsTitle'](),
			description: m['AdminAccommodationAddPage.sectionDetailsDescription'](),
			fields: [
				{
					id: 'description',
					kind: 'textarea',
					label: m['AdminAccommodationAddPage.fieldDescription'](),
					placeholder: m['AdminAccommodationAddPage.fieldDescriptionPlaceholder'](),
					rows: 4
				},
				{
					id: 'isActive',
					kind: 'checkbox',
					label: m['AdminAccommodationAddPage.fieldIsActive'](),
					description: m['AdminAccommodationAddPage.fieldIsActiveDescription']()
				}
			]
		}
	];

	let values = $state<AccommodationAddFormInputs>({
		name: '',
		type: '' as AccommodationAddFormInputs['type'],
		address: '',
		city: '',
		country: '',
		description: '',
		ownerId: '',
		isActive: true,
		coverImageKey: null
	});
</script>

<SvelteHead
	title={m['AdminAccommodationAddPage.SEO.title']()}
	description={m['AdminAccommodationAddPage.SEO.description']()}
/>

<section class="flex w-full justify-center px-4 py-6 md:px-6 md:py-8">
	<div class="flex w-full max-w-3xl flex-col gap-6">
		<header
			class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
		>
			<div class="flex min-w-0 flex-col gap-1 sm:flex-1">
				<h1 class="text-2xl font-semibold tracking-tight">
					{m['AdminAccommodationAddPage.title']()}
				</h1>
				<p class="text-sm leading-relaxed text-muted-foreground">
					{m['AdminAccommodationAddPage.description']()}
				</p>
			</div>
			<Button
				variant="outline"
				href={ADMIN_PAGE_ENDPOINTS.ACCOMMODATIONS}
				class="w-full shrink-0 sm:w-auto sm:self-center"
			>
				<ArrowLeftIcon data-icon="inline-start" />
				{m['AdminAccommodationAddPage.back']()}
			</Button>
		</header>

		<ConvexMutationForm
			class="w-full"
			{sections}
			bind:values
			schema={accommodationAddFormSchema}
			runFunction={api.tables.accommodations.mutations.createAccommodation.createAccommodation}
			submitLabel={m['AdminAccommodationAddPage.submit']()}
			customFields={{ ownerId: ownerField }}
			resetOnSuccess={false}
			onSuccess={() => appGoto(ADMIN_PAGE_ENDPOINTS.ACCOMMODATIONS)}
		/>
	</div>
</section>

{#snippet ownerField({
	value,
	setValue,
	inputId
}: MutationFormFieldSnippetProps<AccommodationAddFormInputs>)}
	<AdminOwnerField value={String(value ?? '')} {inputId} onValueChange={setValue} />
{/snippet}
