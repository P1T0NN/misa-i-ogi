<script lang="ts">
	// LIBRARIES
	import { appGoto } from '@/shared/utils/app-navigation';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ConvexMutationForm from '@/shared/components/ui/mutation-form/convex-mutation-form.svelte';
	import GooglePlacesAutocomplete from '@/shared/components/ui/google-places-autocomplete/google-places-autocomplete.svelte';
	import LocationMap from '@/shared/components/ui/location-map/location-map.svelte';
	import { Button } from '@/shared/components/ui/button/index.js';

	// SCHEMAS
	import {
		accommodationMyAddFormSchema,
		type AccommodationMyAddFormInputs
	} from '@/features/accommodations/schemas/accommodationsSchemas';

	// DATA
	import { accommodationTypeSelectOptions } from '@/features/accommodations/data/accommodationsData';

	// TYPES
	import type {
		MutationFormSection,
		MutationFormFieldSnippetProps
	} from '@/shared/components/ui/mutation-form/types.js';

	// LUCIDE ICONS
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';

	const sections: MutationFormSection[] = [
		{
			id: 'basics',
			title: m['AddAccommodationPage.sectionBasicsTitle'](),
			description: m['AddAccommodationPage.sectionBasicsDescription'](),
			fields: [
				{
					id: 'name',
					kind: 'input',
					label: m['AddAccommodationPage.fieldName'](),
					placeholder: m['AddAccommodationPage.fieldNamePlaceholder'](),
					autofocus: true,
					colSpan: 1
				},
				{
					id: 'type',
					kind: 'select',
					label: m['AddAccommodationPage.fieldType'](),
					selectPlaceholder: m['AddAccommodationPage.fieldTypePlaceholder'](),
					options: accommodationTypeSelectOptions(),
					colSpan: 1
				}
			]
		},
		{
			id: 'location',
			title: m['AddAccommodationPage.sectionLocationTitle'](),
			description: m['AddAccommodationPage.sectionLocationDescription'](),
			fields: [
				{
					id: 'address',
					kind: 'input',
					label: m['AddAccommodationPage.fieldAddress'](),
					placeholder: m['AddAccommodationPage.fieldAddressPlaceholder'](),
					autocomplete: 'street-address'
				},
				{
					id: 'addressNumber',
					kind: 'input',
					label: m['AddAccommodationPage.fieldAddressNumber'](),
					placeholder: m['AddAccommodationPage.fieldAddressNumberPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'city',
					kind: 'input',
					label: m['AddAccommodationPage.fieldCity'](),
					placeholder: m['AddAccommodationPage.fieldCityPlaceholder'](),
					autocomplete: 'address-level2',
					colSpan: 1
				},
				{
					id: 'country',
					kind: 'input',
					label: m['AddAccommodationPage.fieldCountry'](),
					placeholder: m['AddAccommodationPage.fieldCountryPlaceholder'](),
					autocomplete: 'country-name',
					colSpan: 1
				},
				{
					id: 'latitude',
					kind: 'input',
					type: 'number',
					label: m['AddAccommodationPage.fieldLatitude'](),
					placeholder: m['AddAccommodationPage.fieldCoordinatesPlaceholder'](),
					disabled: true,
					colSpan: 1
				},
				{
					id: 'longitude',
					kind: 'input',
					type: 'number',
					label: m['AddAccommodationPage.fieldLongitude'](),
					placeholder: m['AddAccommodationPage.fieldCoordinatesPlaceholder'](),
					disabled: true,
					colSpan: 1
				}
			]
		},
		{
			id: 'cover',
			title: m['AddAccommodationPage.sectionCoverTitle'](),
			description: m['AddAccommodationPage.sectionCoverDescription'](),
			columns: 1,
			fields: [
				{
					id: 'coverImageKey',
					kind: 'upload-single',
					label: m['AddAccommodationPage.fieldCoverImage'](),
					accept: 'image/*'
				}
			]
		},
		{
			id: 'details',
			title: m['AddAccommodationPage.sectionDetailsTitle'](),
			description: m['AddAccommodationPage.sectionDetailsDescription'](),
			fields: [
				{
					id: 'description',
					kind: 'textarea',
					label: m['AddAccommodationPage.fieldDescription'](),
					placeholder: m['AddAccommodationPage.fieldDescriptionPlaceholder'](),
					rows: 4
				}
			]
		}
	];

	let values = $state<AccommodationMyAddFormInputs>({
		name: '',
		type: '' as AccommodationMyAddFormInputs['type'],
		address: '',
		addressNumber: '',
		city: '',
		country: '',
		latitude: null,
		longitude: null,
		description: '',
		coverImageKey: null
	});
</script>

{#snippet addressField({
	value,
	setValue,
	error,
	inputId
}: MutationFormFieldSnippetProps<AccommodationMyAddFormInputs>)}
	<GooglePlacesAutocomplete
		id={inputId}
		value={value as string}
		invalid={!!error}
		onInput={(next) => {
			setValue(next);
			// A manual edit invalidates the last picked pin — coordinates are only valid from a real selection.
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

<SvelteHead
	title={m['AddAccommodationPage.SEO.title']()}
	description={m['AddAccommodationPage.SEO.description']()}
/>

<section class="flex w-full justify-center px-4 py-6 md:px-6 md:py-8">
	<div class="flex w-full max-w-3xl flex-col gap-6">
		<header
			class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
		>
			<div class="flex min-w-0 flex-col gap-1 sm:flex-1">
				<h1 class="text-2xl font-semibold tracking-tight">
					{m['AddAccommodationPage.title']()}
				</h1>
				<p class="text-sm leading-relaxed text-muted-foreground">
					{m['AddAccommodationPage.description']()}
				</p>
			</div>
			<Button
				variant="outline"
				href={PROTECTED_PAGE_ENDPOINTS.MY_ACCOMMODATIONS}
				class="w-full shrink-0 sm:w-auto sm:self-center"
			>
				<ArrowLeftIcon data-icon="inline-start" />
				{m['AddAccommodationPage.back']()}
			</Button>
		</header>

		<ConvexMutationForm
			class="w-full"
			{sections}
			bind:values
			schema={accommodationMyAddFormSchema}
			customFields={{ address: addressField }}
			runFunction={api.tables.accommodations.mutations.createMyAccommodation.createMyAccommodation}
			submitLabel={m['AddAccommodationPage.submit']()}
			resetOnSuccess={false}
			onSuccess={() => appGoto(PROTECTED_PAGE_ENDPOINTS.MY_ACCOMMODATIONS)}
		/>
	</div>
</section>
