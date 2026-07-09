<script lang="ts">
	// SVELTEKIT IMPORTS
	import { appGoto } from '@/shared/utils/app-navigation';

	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';

	// COMPONENTS
	import ConvexMutationForm from '@/shared/components/ui/mutation-form/convex-mutation-form.svelte';
	import GooglePlacesAutocomplete from '@/shared/components/ui/google-places-autocomplete/google-places-autocomplete.svelte';
	import LocationMap from '@/shared/components/ui/location-map/location-map.svelte';
	import { Button } from '@/shared/components/ui/button/index.js';

	// SCHEMAS
	import {
		addHospitalityFormSchema,
		type AddHospitalityFormInputs
	} from '@/features/hospitalities/schemas/hospitalitiesSchemas';

	// FORMS
	import { addHospitalityFormSections } from '@/features/hospitalities/forms/addHospitalityForm';

	// TYPES
	import type { MutationFormFieldSnippetProps } from '@/shared/components/ui/mutation-form/types.js';

	const sections = addHospitalityFormSections();

	let values = $state<AddHospitalityFormInputs>({
		name: '',
		type: '' as AddHospitalityFormInputs['type'],
		address: '',
		addressNumber: '',
		city: '',
		country: '',
		latitude: null,
		longitude: null,
		description: '',
		contactPhone: '',
		benefit: '',
		// Managed in-app for every venue — no owner-facing choice, so no field.
		reservationMode: 'managed_request',
		coverImageKey: null,
		menuFileKey: null,
		menuLink: ''
	});
</script>

<ConvexMutationForm
	class="w-full"
	{sections}
	bind:values
	schema={addHospitalityFormSchema}
	runFunction={api.tables.hospitalities.mutations.createUserHospitality.createUserHospitality}
	customFields={{
		address: addressField
	}}
	resetOnSuccess={false}
	onSuccess={() => {
		void appGoto(PROTECTED_PAGE_ENDPOINTS.MY_HOSPITALITIES);
	}}
>
	{#snippet actions({ busy }: { busy: boolean })}
		<Button type="submit" class="w-full" disabled={busy}>
			{m['AddHospitalityPage.AddHospitalityForm.submit']()}
		</Button>
	{/snippet}
</ConvexMutationForm>

{#snippet addressField({
	value,
	setValue,
	error,
	inputId
}: MutationFormFieldSnippetProps<AddHospitalityFormInputs>)}
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
