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
		hospitalityEditFormSchema,
		type HospitalityEditFormInputs
	} from '@/features/hospitalities/schemas/hospitalitiesSchemas';

	// DATA
	import { hospitalityTypeSelectOptions } from '@/features/hospitalities/data/hospitalitiesData';

	// TYPES
	import type { FunctionReturnType } from 'convex/server';
	import type {
		MutationFormFieldSnippetProps,
		MutationFormSection
	} from '@/shared/components/ui/mutation-form/types.js';

	type HospitalityForEdit = NonNullable<
		FunctionReturnType<
			typeof api.tables.hospitalities.queries.fetchMyHospitalityForEdit.fetchMyHospitalityForEdit
		>
	>;

	let { hospitality }: { hospitality: HospitalityForEdit } = $props();

	const sections: MutationFormSection[] = [
		{
			id: 'basics',
			title: m['EditHospitalityPage.sectionBasicsTitle'](),
			description: m['EditHospitalityPage.sectionBasicsDescription'](),
			fields: [
				{
					id: 'name',
					kind: 'input',
					label: m['EditHospitalityPage.fieldName'](),
					placeholder: m['EditHospitalityPage.fieldNamePlaceholder'](),
					autofocus: true,
					colSpan: 1
				},
				{
					id: 'type',
					kind: 'select',
					label: m['EditHospitalityPage.fieldType'](),
					selectPlaceholder: m['EditHospitalityPage.fieldTypePlaceholder'](),
					options: hospitalityTypeSelectOptions(),
					colSpan: 1
				}
			]
		},
		{
			id: 'location',
			title: m['EditHospitalityPage.sectionLocationTitle'](),
			description: m['EditHospitalityPage.sectionLocationDescription'](),
			fields: [
				{
					id: 'address',
					kind: 'input',
					label: m['EditHospitalityPage.fieldAddress'](),
					placeholder: m['EditHospitalityPage.fieldAddressPlaceholder'](),
					autocomplete: 'street-address'
				},
				{
					id: 'city',
					kind: 'input',
					label: m['EditHospitalityPage.fieldCity'](),
					placeholder: m['EditHospitalityPage.fieldCityPlaceholder'](),
					autocomplete: 'address-level2',
					colSpan: 1
				},
				{
					id: 'country',
					kind: 'input',
					label: m['EditHospitalityPage.fieldCountry'](),
					placeholder: m['EditHospitalityPage.fieldCountryPlaceholder'](),
					autocomplete: 'country-name',
					colSpan: 1
				}
			]
		},
		{
			id: 'contact',
			title: m['EditHospitalityPage.sectionContactTitle'](),
			description: m['EditHospitalityPage.sectionContactDescription'](),
			fields: [
				{
					id: 'contactPhone',
					kind: 'input',
					type: 'tel',
					label: m['EditHospitalityPage.fieldContactPhone'](),
					placeholder: m['EditHospitalityPage.fieldContactPhonePlaceholder'](),
					autocomplete: 'tel',
					colSpan: 1
				},
				{
					id: 'contactEmail',
					kind: 'input',
					type: 'email',
					label: m['EditHospitalityPage.fieldContactEmail'](),
					placeholder: m['EditHospitalityPage.fieldContactEmailPlaceholder'](),
					autocomplete: 'email',
					colSpan: 1
				},
				{
					id: 'website',
					kind: 'input',
					type: 'url',
					label: m['EditHospitalityPage.fieldWebsite'](),
					placeholder: m['EditHospitalityPage.fieldWebsitePlaceholder'](),
					autocomplete: 'url'
				}
			]
		},
		{
			id: 'cover',
			title: m['EditHospitalityPage.sectionCoverTitle'](),
			description: m['EditHospitalityPage.sectionCoverDescription'](),
			columns: 1,
			fields: [
				{
					id: 'coverImageKey',
					kind: 'upload-single',
					label: m['EditHospitalityPage.fieldCoverImage'](),
					accept: 'image/*'
				}
			]
		},
		{
			id: 'details',
			title: m['EditHospitalityPage.sectionDetailsTitle'](),
			description: m['EditHospitalityPage.sectionDetailsDescription'](),
			fields: [
				{
					id: 'description',
					kind: 'textarea',
					label: m['EditHospitalityPage.fieldDescription'](),
					placeholder: m['EditHospitalityPage.fieldDescriptionPlaceholder'](),
					rows: 4
				},
				{
					id: 'reservationRequestsEnabled',
					kind: 'checkbox',
					label: m['EditHospitalityPage.fieldReservationRequestsEnabled'](),
					description: m['EditHospitalityPage.fieldReservationRequestsEnabledDescription']()
				},
				{
					id: 'isActive',
					kind: 'checkbox',
					label: m['EditHospitalityPage.fieldIsActive'](),
					description: m['EditHospitalityPage.fieldIsActiveDescription']()
				}
			]
		}
	];

	let values = $state<HospitalityEditFormInputs>({
		hospitalityId: '',
		name: '',
		type: '' as HospitalityEditFormInputs['type'],
		address: '',
		city: '',
		country: '',
		description: '',
		contactPhone: '',
		contactEmail: '',
		website: '',
		reservationRequestsEnabled: false,
		isActive: true,
		coverImageKey: null
	});

	let hydratedForId = $state<string | null>(null);

	$effect(() => {
		void hospitality._id;
		hydratedForId = null;
	});

	$effect(() => {
		const row = hospitality;
		if (hydratedForId === row._id) return;

		values = {
			hospitalityId: row._id,
			name: row.name,
			type: row.type,
			address: row.address,
			city: row.city,
			country: row.country,
			description: row.description,
			contactPhone: row.contactPhone,
			contactEmail: row.contactEmail ?? '',
			website: row.website ?? '',
			reservationRequestsEnabled: row.reservationRequestsEnabled ?? false,
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
	schema={hospitalityEditFormSchema}
	runFunction={api.tables.hospitalities.mutations.updateHospitality.updateHospitality}
	submitLabel={m['EditHospitalityPage.submit']()}
	resetOnSuccess={false}
	customFields={{ coverImageKey: coverField }}
	onSuccess={() => appGoto(PROTECTED_PAGE_ENDPOINTS.MY_HOSPITALITIES)}
/>

{#snippet coverField({ value, setValue, inputId, field }: MutationFormFieldSnippetProps<HospitalityEditFormInputs>)}
	<UploadFileSingle
		id={inputId}
		accept={field.accept}
		existingPreviewUrl={hospitality.coverImageUrl}
		existingPreviewAlt={m['EditHospitalityPage.currentCoverAlt']({ name: hospitality.name })}
		bind:file={() => (value as File | null) ?? null, (next) => setValue(next)}
	/>
{/snippet}
