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
	import ReservationModeField from '@/features/hospitalities/components/reservation-mode-field.svelte';
	import GooglePlacesAutocomplete from '@/shared/components/ui/google-places-autocomplete/google-places-autocomplete.svelte';
	import LocationMap from '@/shared/components/ui/location-map/location-map.svelte';

	// SCHEMAS
	import {
		hospitalityEditFormSchema,
		type HospitalityEditFormInputs
	} from '@/features/hospitalities/schemas/hospitalitiesSchemas';

	// DATA
	import {
		hospitalityTypeSelectOptions,
		reservationModeSelectOptions
	} from '@/features/hospitalities/data/hospitalitiesData';

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

	/** Recover just the street name from the stored full address. We append the number ourselves on
	 *  save, so stripping that exact known suffix is precise — no fuzzy address parsing. */
	function streetNameOf(address: string, number?: string): string {
		if (number && address.endsWith(number)) return address.slice(0, -number.length).trim();
		return address;
	}

	const sections: MutationFormSection[] = [
		{
			id: 'basics',
			title: m['EditHospitalityPage.EditHospitalityForm.sectionBasicsTitle'](),
			description: m['EditHospitalityPage.EditHospitalityForm.sectionBasicsDescription'](),
			fields: [
				{
					id: 'name',
					kind: 'input',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldName'](),
					placeholder: m['EditHospitalityPage.EditHospitalityForm.fieldNamePlaceholder'](),
					autofocus: true,
					colSpan: 1
				},
				{
					id: 'type',
					kind: 'select',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldType'](),
					selectPlaceholder: m['EditHospitalityPage.EditHospitalityForm.fieldTypePlaceholder'](),
					options: hospitalityTypeSelectOptions(),
					colSpan: 1
				}
			]
		},
		{
			id: 'location',
			title: m['EditHospitalityPage.EditHospitalityForm.sectionLocationTitle'](),
			description: m['EditHospitalityPage.EditHospitalityForm.sectionLocationDescription'](),
			fields: [
				{
					id: 'address',
					kind: 'input',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldAddress'](),
					placeholder: m['EditHospitalityPage.EditHospitalityForm.fieldAddressPlaceholder']()
				},
				{
					id: 'addressNumber',
					kind: 'input',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldAddressNumber'](),
					placeholder: m['EditHospitalityPage.EditHospitalityForm.fieldAddressNumberPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'city',
					kind: 'input',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldCity'](),
					placeholder: m['EditHospitalityPage.EditHospitalityForm.fieldCityPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'country',
					kind: 'input',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldCountry'](),
					placeholder: m['EditHospitalityPage.EditHospitalityForm.fieldCountryPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'latitude',
					kind: 'input',
					type: 'number',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldLatitude'](),
					placeholder: m['EditHospitalityPage.EditHospitalityForm.fieldCoordinatesPlaceholder'](),
					disabled: true,
					colSpan: 1
				},
				{
					id: 'longitude',
					kind: 'input',
					type: 'number',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldLongitude'](),
					placeholder: m['EditHospitalityPage.EditHospitalityForm.fieldCoordinatesPlaceholder'](),
					disabled: true,
					colSpan: 1
				}
			]
		},
		{
			id: 'contact',
			title: m['EditHospitalityPage.EditHospitalityForm.sectionContactTitle'](),
			description: m['EditHospitalityPage.EditHospitalityForm.sectionContactDescription'](),
			columns: 1,
			fields: [
				{
					id: 'contactPhone',
					kind: 'input',
					type: 'tel',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldContactPhone'](),
					placeholder: m['EditHospitalityPage.EditHospitalityForm.fieldContactPhonePlaceholder']()
				}
			]
		},
		{
			id: 'cover',
			title: m['EditHospitalityPage.EditHospitalityForm.sectionCoverTitle'](),
			description: m['EditHospitalityPage.EditHospitalityForm.sectionCoverDescription'](),
			columns: 1,
			fields: [
				{
					id: 'coverImageKey',
					kind: 'upload-single',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldCoverImage'](),
					accept: 'image/*'
				}
			]
		},
		{
			id: 'menu',
			title: m['EditHospitalityPage.EditHospitalityForm.sectionMenuTitle'](),
			description: m['EditHospitalityPage.EditHospitalityForm.sectionMenuDescription'](),
			columns: 1,
			fields: [
				{
					id: 'menuFileKey',
					kind: 'upload-single',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldMenuFile'](),
					description: m['EditHospitalityPage.EditHospitalityForm.fieldMenuFileHint'](),
					accept: 'image/*,application/pdf'
				},
				{
					id: 'menuLink',
					kind: 'input',
					type: 'url',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldMenuLink'](),
					placeholder: m['EditHospitalityPage.EditHospitalityForm.fieldMenuLinkPlaceholder']()
				}
			]
		},
		{
			id: 'details',
			title: m['EditHospitalityPage.EditHospitalityForm.sectionDetailsTitle'](),
			description: m['EditHospitalityPage.EditHospitalityForm.sectionDetailsDescription'](),
			fields: [
				{
					id: 'description',
					kind: 'textarea',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldDescription'](),
					placeholder: m['EditHospitalityPage.EditHospitalityForm.fieldDescriptionPlaceholder'](),
					rows: 4,
					required: true
				},
				{
					id: 'reservationMode',
					kind: 'select',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldReservationMode'](),
					options: reservationModeSelectOptions()
				},
				{
					id: 'isActive',
					kind: 'checkbox',
					label: m['EditHospitalityPage.EditHospitalityForm.fieldIsActive'](),
					description: m['EditHospitalityPage.EditHospitalityForm.fieldIsActiveDescription']()
				}
			]
		}
	];

	let values = $state<HospitalityEditFormInputs>({
		hospitalityId: '',
		name: '',
		type: '' as HospitalityEditFormInputs['type'],
		address: '',
		addressNumber: '',
		city: '',
		country: '',
		latitude: null,
		longitude: null,
		description: '',
		contactPhone: '',
		reservationMode: 'managed_request',
		isActive: true,
		coverImageKey: null,
		menuFileKey: null,
		menuLink: ''
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
			address: streetNameOf(row.address, row.addressNumber),
			addressNumber: row.addressNumber ?? '',
			city: row.city,
			country: row.country,
			latitude: row.latitude ?? null,
			longitude: row.longitude ?? null,
			description: row.description,
			contactPhone: row.contactPhone,
			reservationMode: row.reservationMode,
			isActive: row.isActive,
			coverImageKey: null,
			menuFileKey: null,
			menuLink: row.menuLink ?? ''
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
	submitLabel={m['EditHospitalityPage.EditHospitalityForm.submit']()}
	resetOnSuccess={false}
	customFields={{
		address: addressField,
		coverImageKey: coverField,
		menuFileKey: menuFileField,
		reservationMode: reservationModeField
	}}
	onSuccess={() => appGoto(PROTECTED_PAGE_ENDPOINTS.MY_HOSPITALITIES)}
/>

{#snippet addressField({
	value,
	setValue,
	error,
	inputId
}: MutationFormFieldSnippetProps<HospitalityEditFormInputs>)}
	<GooglePlacesAutocomplete
		id={inputId}
		value={value as string}
		invalid={!!error}
		onInput={(next) => {
			setValue(next);
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
}: MutationFormFieldSnippetProps<HospitalityEditFormInputs>)}
	<UploadFileSingle
		id={inputId}
		accept={field.accept}
		existingPreviewUrl={hospitality.coverImageUrl}
		existingPreviewAlt={m['EditHospitalityPage.EditHospitalityForm.currentCoverAlt']({
			name: hospitality.name
		})}
		bind:file={() => (value as File | null) ?? null, (next) => setValue(next)}
	/>
{/snippet}

{#snippet menuFileField({
	value,
	setValue,
	inputId,
	field
}: MutationFormFieldSnippetProps<HospitalityEditFormInputs>)}
	<UploadFileSingle
		id={inputId}
		accept={field.accept}
		bind:file={() => (value as File | null) ?? null, (next) => setValue(next)}
	/>
	{#if hospitality.menuFileUrl}
		<p class="mt-2 text-sm text-muted-foreground">
			{m['EditHospitalityPage.EditHospitalityForm.currentMenu']()}
			<a
				href={hospitality.menuFileUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary underline underline-offset-2"
			>
				{m['EditHospitalityPage.EditHospitalityForm.currentMenuView']()}
			</a>
		</p>
	{/if}
{/snippet}

{#snippet reservationModeField({
	field,
	value,
	setValue,
	error,
	inputId
}: MutationFormFieldSnippetProps<HospitalityEditFormInputs>)}
	<ReservationModeField {field} {inputId} {value} {setValue} invalid={!!error} />
{/snippet}
