<script lang="ts">
	// LIBRARIES
	import { appGoto } from '@/shared/utils/app-navigation';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import ConvexMutationForm from '@/shared/components/ui/mutation-form/convex-mutation-form.svelte';
	import UploadFileSingle from '@/features/uploadFile/components/upload-file-single/upload-file-single.svelte';

	// SCHEMAS
	import {
		accommodationEditFormSchema,
		type AccommodationEditFormInputs
	} from '@/features/accommodations/schemas/accommodationsSchemas';

	// DATA
	import { accommodationTypeSelectOptions } from '@/features/accommodations/data/accommodationsData';

	// TYPES
	import type { FunctionReturnType } from 'convex/server';
	import type {
		MutationFormFieldSnippetProps,
		MutationFormSection
	} from '@/shared/components/ui/mutation-form/types.js';

	type AccommodationForEdit = NonNullable<
		FunctionReturnType<
			typeof api.tables.accommodations.queries.fetchMyAccommodationForEdit.fetchMyAccommodationForEdit
		>
	>;

	let { accommodation }: { accommodation: AccommodationForEdit } = $props();

	const sections: MutationFormSection[] = [
		{
			id: 'basics',
			title: m['EditAccommodationPage.sectionBasicsTitle'](),
			description: m['EditAccommodationPage.sectionBasicsDescription'](),
			fields: [
				{
					id: 'name',
					kind: 'input',
					label: m['EditAccommodationPage.fieldName'](),
					placeholder: m['EditAccommodationPage.fieldNamePlaceholder'](),
					autofocus: true,
					colSpan: 1
				},
				{
					id: 'type',
					kind: 'select',
					label: m['EditAccommodationPage.fieldType'](),
					selectPlaceholder: m['EditAccommodationPage.fieldTypePlaceholder'](),
					options: accommodationTypeSelectOptions(),
					colSpan: 1
				}
			]
		},
		{
			id: 'location',
			title: m['EditAccommodationPage.sectionLocationTitle'](),
			description: m['EditAccommodationPage.sectionLocationDescription'](),
			fields: [
				{
					id: 'address',
					kind: 'input',
					label: m['EditAccommodationPage.fieldAddress'](),
					placeholder: m['EditAccommodationPage.fieldAddressPlaceholder'](),
					autocomplete: 'street-address'
				},
				{
					id: 'city',
					kind: 'input',
					label: m['EditAccommodationPage.fieldCity'](),
					placeholder: m['EditAccommodationPage.fieldCityPlaceholder'](),
					autocomplete: 'address-level2',
					colSpan: 1
				},
				{
					id: 'country',
					kind: 'input',
					label: m['EditAccommodationPage.fieldCountry'](),
					placeholder: m['EditAccommodationPage.fieldCountryPlaceholder'](),
					autocomplete: 'country-name',
					colSpan: 1
				}
			]
		},
		{
			id: 'cover',
			title: m['EditAccommodationPage.sectionCoverTitle'](),
			description: m['EditAccommodationPage.sectionCoverDescription'](),
			columns: 1,
			fields: [
				{
					id: 'coverImageKey',
					kind: 'upload-single',
					label: m['EditAccommodationPage.fieldCoverImage'](),
					accept: 'image/*'
				}
			]
		},
		{
			id: 'details',
			title: m['EditAccommodationPage.sectionDetailsTitle'](),
			description: m['EditAccommodationPage.sectionDetailsDescription'](),
			fields: [
				{
					id: 'description',
					kind: 'textarea',
					label: m['EditAccommodationPage.fieldDescription'](),
					placeholder: m['EditAccommodationPage.fieldDescriptionPlaceholder'](),
					rows: 4
				},
				{
					id: 'isActive',
					kind: 'checkbox',
					label: m['EditAccommodationPage.fieldIsActive'](),
					description: m['EditAccommodationPage.fieldIsActiveDescription']()
				}
			]
		}
	];

	let values = $state<AccommodationEditFormInputs>({
		accommodationId: '',
		name: '',
		type: '' as AccommodationEditFormInputs['type'],
		address: '',
		city: '',
		country: '',
		description: '',
		isActive: true,
		coverImageKey: null
	});

	let hydratedForId = $state<string | null>(null);

	$effect(() => {
		void accommodation._id;
		hydratedForId = null;
	});

	$effect(() => {
		const row = accommodation;
		if (hydratedForId === row._id) return;

		values = {
			accommodationId: row._id,
			name: row.name,
			type: row.type,
			address: row.address,
			city: row.city,
			country: row.country,
			description: row.description ?? '',
			isActive: row.isActive,
			coverImageKey: null
		};
		hydratedForId = row._id;
	});
</script>

<ConvexMutationForm
	class="w-full"
	{sections}
	bind:values
	schema={accommodationEditFormSchema}
	runFunction={api.tables.accommodations.mutations.updateAccommodation.updateAccommodation}
	submitLabel={m['EditAccommodationPage.submit']()}
	resetOnSuccess={false}
	customFields={{ coverImageKey: coverField }}
	onSuccess={() => appGoto(PROTECTED_PAGE_ENDPOINTS.MY_ACCOMMODATIONS)}
/>

{#snippet coverField({
	value,
	setValue,
	inputId,
	field
}: MutationFormFieldSnippetProps<AccommodationEditFormInputs>)}
	<UploadFileSingle
		id={inputId}
		accept={field.accept}
		existingPreviewUrl={accommodation.coverImageUrl}
		existingPreviewAlt={m['EditAccommodationPage.currentCoverAlt']({ name: accommodation.name })}
		bind:file={() => (value as File | null) ?? null, (next) => setValue(next)}
	/>
{/snippet}
