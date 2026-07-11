<script lang="ts">
	// LIBRARIES
	import { appGoto } from '@/shared/utils/app-navigation';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { ADMIN_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

	// COMPONENTS
	import ConvexMutationForm from '@/shared/components/ui/mutation-form/convex-mutation-form.svelte';
	import UploadFileSingle from '@/features/uploadFile/components/upload-file-single/upload-file-single.svelte';
	import ReservationModeField from '@/features/hospitalities/components/reservation-mode-field.svelte';
	import GooglePlacesAutocomplete from '@/shared/components/ui/google-places-autocomplete/google-places-autocomplete.svelte';
	import LocationMap from '@/shared/components/ui/location-map/location-map.svelte';

	// SCHEMAS
	import {
		hospitalityAdminEditFormSchema,
		type HospitalityAdminEditFormInputs
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

	type HospitalityForAdminEdit = NonNullable<
		FunctionReturnType<
			typeof api.tables.hospitalities.queries.fetchHospitalityForAdminEdit.fetchHospitalityForAdminEdit
		>
	>;

	let { hospitality }: { hospitality: HospitalityForAdminEdit } = $props();

	/** Recover just the street name from the stored full address. We append the number ourselves on
	 *  save, so stripping that exact known suffix is precise — no fuzzy address parsing. */
	function streetNameOf(address: string, number?: string): string {
		if (number && address.endsWith(number)) return address.slice(0, -number.length).trim();
		return address;
	}

	const sections: MutationFormSection[] = [
		{
			id: 'basics',
			title: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionBasicsTitle'](),
			description: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionBasicsDescription'](),
			fields: [
				{
					id: 'name',
					kind: 'input',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldName'](),
					placeholder: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldNamePlaceholder'](),
					autofocus: true,
					colSpan: 1
				},
				{
					id: 'type',
					kind: 'select',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldType'](),
					selectPlaceholder: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldTypePlaceholder'](),
					options: hospitalityTypeSelectOptions(),
					colSpan: 1
				}
			]
		},
		{
			id: 'location',
			title: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionLocationTitle'](),
			description: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionLocationDescription'](),
			fields: [
				{
					id: 'address',
					kind: 'input',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldAddress'](),
					placeholder: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldAddressPlaceholder']()
				},
				{
					id: 'addressNumber',
					kind: 'input',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldAddressNumber'](),
					placeholder: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldAddressNumberPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'city',
					kind: 'input',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldCity'](),
					placeholder: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldCityPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'country',
					kind: 'input',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldCountry'](),
					placeholder: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldCountryPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'latitude',
					kind: 'input',
					type: 'number',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldLatitude'](),
					placeholder: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldCoordinatesPlaceholder'](),
					disabled: true,
					colSpan: 1
				},
				{
					id: 'longitude',
					kind: 'input',
					type: 'number',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldLongitude'](),
					placeholder: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldCoordinatesPlaceholder'](),
					disabled: true,
					colSpan: 1
				}
			]
		},
		{
			id: 'contact',
			title: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionContactTitle'](),
			description: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionContactDescription'](),
			columns: 1,
			fields: [
				{
					id: 'contactPhone',
					kind: 'input',
					type: 'tel',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldContactPhone'](),
					placeholder: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldContactPhonePlaceholder']()
				}
			]
		},
		{
			id: 'images',
			title: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionImagesTitle'](),
			description: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionImagesDescription'](),
			columns: 1,
			fields: [
				{
					id: 'images',
					kind: 'upload-multiple',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldImages'](),
					accept: 'image/*',
					hasCoverImage: true
				}
			]
		},
		{
			id: 'menu',
			title: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionMenuTitle'](),
			description: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionMenuDescription'](),
			columns: 1,
			fields: [
				{
					id: 'menuFileKey',
					kind: 'upload-single',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldMenuFile'](),
					description: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldMenuFileHint'](),
					accept: 'image/*,application/pdf'
				},
				{
					id: 'menuLink',
					kind: 'input',
					type: 'url',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldMenuLink'](),
					placeholder: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldMenuLinkPlaceholder']()
				}
			]
		},
		{
			id: 'details',
			title: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionDetailsTitle'](),
			description: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionDetailsDescription'](),
			fields: [
				{
					id: 'description',
					kind: 'textarea',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldDescription'](),
					placeholder: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldDescriptionPlaceholder'](),
					rows: 4,
					required: true
				},
				{
					id: 'reservationMode',
					kind: 'select',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldReservationMode'](),
					options: reservationModeSelectOptions()
				},
				{
					id: 'isActive',
					kind: 'checkbox',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldIsActive'](),
					description: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldIsActiveDescription']()
				}
			]
		},
		{
			id: 'admin',
			title: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionAdminTitle'](),
			description: m['AdminEditHospitalityPage.AdminEditHospitalityForm.sectionAdminDescription'](),
			columns: 1,
			fields: [
				{
					id: 'benefit',
					kind: 'input',
					label: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldBenefit'](),
					placeholder: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldBenefitPlaceholder'](),
					description: m['AdminEditHospitalityPage.AdminEditHospitalityForm.fieldBenefitHint']()
				}
			]
		}
	];

	let values = $state<HospitalityAdminEditFormInputs>({
		hospitalityId: '',
		name: '',
		type: '' as HospitalityAdminEditFormInputs['type'],
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
		images: [],
		menuFileKey: null,
		menuLink: '',
		benefit: ''
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
			images: [...(row.images ?? [])],
			menuFileKey: null,
			menuLink: row.menuLink ?? '',
			benefit: row.benefit
		};
		hydratedForId = row._id;
	});
</script>

<ConvexMutationForm
	class="w-full"
	{sections}
	bind:values
	schema={hospitalityAdminEditFormSchema}
	runFunction={api.tables.hospitalities.mutations.updateHospitality.updateHospitality}
	uploadKeyPrefix="hospitalities"
	submitLabel={m['AdminEditHospitalityPage.AdminEditHospitalityForm.submit']()}
	resetOnSuccess={false}
	customFields={{
		address: addressField,
		menuFileKey: menuFileField,
		reservationMode: reservationModeField
	}}
	onSuccess={() => appGoto(ADMIN_PAGE_ENDPOINTS.HOSPITALITIES)}
/>

{#snippet addressField({
	value,
	setValue,
	error,
	inputId
}: MutationFormFieldSnippetProps<HospitalityAdminEditFormInputs>)}
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

{#snippet menuFileField({
	value,
	setValue,
	inputId,
	field
}: MutationFormFieldSnippetProps<HospitalityAdminEditFormInputs>)}
	<UploadFileSingle
		id={inputId}
		accept={field.accept}
		bind:file={() => (value as File | null) ?? null, (next) => setValue(next)}
	/>
	{#if hospitality.menuFileUrl}
		<p class="mt-2 text-sm text-muted-foreground">
			{m['AdminEditHospitalityPage.AdminEditHospitalityForm.currentMenu']()}
			<a
				href={hospitality.menuFileUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary underline underline-offset-2"
			>
				{m['AdminEditHospitalityPage.AdminEditHospitalityForm.currentMenuView']()}
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
}: MutationFormFieldSnippetProps<HospitalityAdminEditFormInputs>)}
	<ReservationModeField {field} {inputId} {value} {setValue} invalid={!!error} />
{/snippet}
