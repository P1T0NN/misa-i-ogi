<script lang="ts">
	// LIBRARIES
	import { appGoto } from '@/shared/utils/app-navigation';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

	// COMPONENTS
	import ConvexMutationForm from '@/shared/components/ui/mutation-form/convex-mutation-form.svelte';
	import UploadFileSingle from '@/features/uploadFile/components/upload-file-single/upload-file-single.svelte';
	import GooglePlacesAutocomplete from '@/shared/components/ui/google-places-autocomplete/google-places-autocomplete.svelte';
	import LocationMap from '@/shared/components/ui/location-map/location-map.svelte';

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

	/** Recover just the street name from the stored full address. We append the number ourselves on
	 *  save, so stripping that exact known suffix is precise — no fuzzy address parsing. */
	function streetNameOf(address: string, number?: string): string {
		if (number && address.endsWith(number)) return address.slice(0, -number.length).trim();
		return address;
	}

	const sections: MutationFormSection[] = [
		{
			id: 'basics',
			title: m['EditAccommodationPage.EditAccommodationForm.sectionBasicsTitle'](),
			description: m['EditAccommodationPage.EditAccommodationForm.sectionBasicsDescription'](),
			fields: [
				{
					id: 'name',
					kind: 'input',
					label: m['EditAccommodationPage.EditAccommodationForm.fieldName'](),
					placeholder: m['EditAccommodationPage.EditAccommodationForm.fieldNamePlaceholder'](),
					autofocus: true,
					colSpan: 1
				},
				{
					id: 'type',
					kind: 'select',
					label: m['EditAccommodationPage.EditAccommodationForm.fieldType'](),
					selectPlaceholder: m['EditAccommodationPage.EditAccommodationForm.fieldTypePlaceholder'](),
					options: accommodationTypeSelectOptions(),
					colSpan: 1
				}
			]
		},
		{
			id: 'location',
			title: m['EditAccommodationPage.EditAccommodationForm.sectionLocationTitle'](),
			description: m['EditAccommodationPage.EditAccommodationForm.sectionLocationDescription'](),
			fields: [
				{
					id: 'address',
					kind: 'input',
					label: m['EditAccommodationPage.EditAccommodationForm.fieldAddress'](),
					placeholder: m['EditAccommodationPage.EditAccommodationForm.fieldAddressPlaceholder']()
				},
				{
					id: 'addressNumber',
					kind: 'input',
					label: m['EditAccommodationPage.EditAccommodationForm.fieldAddressNumber'](),
					placeholder: m['EditAccommodationPage.EditAccommodationForm.fieldAddressNumberPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'city',
					kind: 'input',
					label: m['EditAccommodationPage.EditAccommodationForm.fieldCity'](),
					placeholder: m['EditAccommodationPage.EditAccommodationForm.fieldCityPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'country',
					kind: 'input',
					label: m['EditAccommodationPage.EditAccommodationForm.fieldCountry'](),
					placeholder: m['EditAccommodationPage.EditAccommodationForm.fieldCountryPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'latitude',
					kind: 'input',
					type: 'number',
					label: m['EditAccommodationPage.EditAccommodationForm.fieldLatitude'](),
					placeholder: m['EditAccommodationPage.EditAccommodationForm.fieldCoordinatesPlaceholder'](),
					disabled: true,
					colSpan: 1
				},
				{
					id: 'longitude',
					kind: 'input',
					type: 'number',
					label: m['EditAccommodationPage.EditAccommodationForm.fieldLongitude'](),
					placeholder: m['EditAccommodationPage.EditAccommodationForm.fieldCoordinatesPlaceholder'](),
					disabled: true,
					colSpan: 1
				}
			]
		},
		{
			id: 'cover',
			title: m['EditAccommodationPage.EditAccommodationForm.sectionCoverTitle'](),
			description: m['EditAccommodationPage.EditAccommodationForm.sectionCoverDescription'](),
			columns: 1,
			fields: [
				{
					id: 'coverImageKey',
					kind: 'upload-single',
					label: m['EditAccommodationPage.EditAccommodationForm.fieldCoverImage'](),
					accept: 'image/*'
				}
			]
		},
		{
			id: 'details',
			title: m['EditAccommodationPage.EditAccommodationForm.sectionDetailsTitle'](),
			description: m['EditAccommodationPage.EditAccommodationForm.sectionDetailsDescription'](),
			fields: [
				{
					id: 'description',
					kind: 'textarea',
					label: m['EditAccommodationPage.EditAccommodationForm.fieldDescription'](),
					placeholder: m['EditAccommodationPage.EditAccommodationForm.fieldDescriptionPlaceholder'](),
					rows: 4
				},
				{
					id: 'isActive',
					kind: 'checkbox',
					label: m['EditAccommodationPage.EditAccommodationForm.fieldIsActive'](),
					description: m['EditAccommodationPage.EditAccommodationForm.fieldIsActiveDescription']()
				}
			]
		}
	];

	let values = $state<AccommodationEditFormInputs>({
		accommodationId: '',
		name: '',
		type: '' as AccommodationEditFormInputs['type'],
		address: '',
		addressNumber: '',
		city: '',
		country: '',
		latitude: null,
		longitude: null,
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
			address: streetNameOf(row.address, row.addressNumber),
			addressNumber: row.addressNumber ?? '',
			city: row.city,
			country: row.country,
			latitude: row.latitude ?? null,
			longitude: row.longitude ?? null,
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
	submitLabel={m['EditAccommodationPage.EditAccommodationForm.submit']()}
	resetOnSuccess={false}
	customFields={{ address: addressField, coverImageKey: coverField }}
	onSuccess={() => appGoto(PROTECTED_PAGE_ENDPOINTS.MY_ACCOMMODATIONS)}
/>

{#snippet addressField({
	value,
	setValue,
	error,
	inputId
}: MutationFormFieldSnippetProps<AccommodationEditFormInputs>)}
	<GooglePlacesAutocomplete
		id={inputId}
		value={value as string}
		invalid={!!error}
		onInput={(next) => {
			setValue(next);
			// A manual edit invalidates the last picked pin — coordinates only come from a real selection.
			values.latitude = null;
			values.longitude = null;
		}}
		onSelect={(place) => {
			setValue(place.street || place.addressLine);
			values.addressNumber = place.streetNumber;
			values.city = place.city;
			values.country = place.country;
			values.latitude = place.lat;
			values.longitude = place.lng;
		}}
	/>
	<LocationMap lat={values.latitude} lng={values.longitude} class="mt-3" />
{/snippet}

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
		existingPreviewAlt={m['EditAccommodationPage.EditAccommodationForm.currentCoverAlt']({ name: accommodation.name })}
		bind:file={() => (value as File | null) ?? null, (next) => setValue(next)}
	/>
{/snippet}
