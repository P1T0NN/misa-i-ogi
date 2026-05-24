<script lang="ts">
	// LIBRARIES
	import { appGoto } from '@/shared/utils/app-navigation';
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { ADMIN_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// FEATURES
	import { hospitalityTypeSelectOptions } from '@/features/hospitalities/data/hospitalitiesData';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ConvexMutationForm from '@/shared/components/ui/mutation-form/convex-mutation-form.svelte';
	import { Button } from '@/shared/components/ui/button/index.js';
	import AdminOwnerField from '@/features/users/components/admin-owner-field.svelte';

	// SCHEMAS
	import { hospitalityAddFormSchema, type HospitalityAddFormInputs } from '@/features/hospitalities/schemas/hospitalitiesSchemas';

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
			title: m['AdminHospitalityAddPage.sectionBasicsTitle'](),
			description: m['AdminHospitalityAddPage.sectionBasicsDescription'](),
			fields: [
				{
					id: 'name',
					kind: 'input',
					label: m['AdminHospitalityAddPage.fieldName'](),
					placeholder: m['AdminHospitalityAddPage.fieldNamePlaceholder'](),
					autofocus: true,
					colSpan: 1
				},
				{
					id: 'type',
					kind: 'select',
					label: m['AdminHospitalityAddPage.fieldType'](),
					selectPlaceholder: m['AdminHospitalityAddPage.fieldTypePlaceholder'](),
					options: hospitalityTypeSelectOptions(),
					colSpan: 1
				},
				{
					id: 'ownerId',
					kind: 'input',
					label: 'Owner',
					colSpan: 2
				}
			]
		},
		{
			id: 'location',
			title: m['AdminHospitalityAddPage.sectionLocationTitle'](),
			description: m['AdminHospitalityAddPage.sectionLocationDescription'](),
			fields: [
				{
					id: 'address',
					kind: 'input',
					label: m['AdminHospitalityAddPage.fieldAddress'](),
					placeholder: m['AdminHospitalityAddPage.fieldAddressPlaceholder'](),
					autocomplete: 'street-address'
				},
				{
					id: 'city',
					kind: 'input',
					label: m['AdminHospitalityAddPage.fieldCity'](),
					placeholder: m['AdminHospitalityAddPage.fieldCityPlaceholder'](),
					autocomplete: 'address-level2',
					colSpan: 1
				},
				{
					id: 'country',
					kind: 'input',
					label: m['AdminHospitalityAddPage.fieldCountry'](),
					placeholder: m['AdminHospitalityAddPage.fieldCountryPlaceholder'](),
					autocomplete: 'country-name',
					colSpan: 1
				}
			]
		},
		{
			id: 'contact',
			title: m['AdminHospitalityAddPage.sectionContactTitle'](),
			description: m['AdminHospitalityAddPage.sectionContactDescription'](),
			fields: [
				{
					id: 'contactPhone',
					kind: 'input',
					type: 'tel',
					label: m['AdminHospitalityAddPage.fieldContactPhone'](),
					placeholder: m['AdminHospitalityAddPage.fieldContactPhonePlaceholder'](),
					autocomplete: 'tel',
					colSpan: 1
				},
				{
					id: 'contactEmail',
					kind: 'input',
					type: 'email',
					label: m['AdminHospitalityAddPage.fieldContactEmail'](),
					placeholder: m['AdminHospitalityAddPage.fieldContactEmailPlaceholder'](),
					autocomplete: 'email',
					colSpan: 1
				},
				{
					id: 'website',
					kind: 'input',
					type: 'url',
					label: m['AdminHospitalityAddPage.fieldWebsite'](),
					placeholder: m['AdminHospitalityAddPage.fieldWebsitePlaceholder'](),
					autocomplete: 'url'
				}
			]
		},
		{
			id: 'cover',
			title: m['AdminHospitalityAddPage.sectionCoverTitle'](),
			description: m['AdminHospitalityAddPage.sectionCoverDescription'](),
			columns: 1,
			fields: [
				{
					id: 'coverImageKey',
					kind: 'upload-single',
					label: m['AdminHospitalityAddPage.fieldCoverImage'](),
					accept: 'image/*'
				}
			]
		},
		{
			id: 'details',
			title: m['AdminHospitalityAddPage.sectionDetailsTitle'](),
			description: m['AdminHospitalityAddPage.sectionDetailsDescription'](),
			fields: [
				{
					id: 'description',
					kind: 'textarea',
					label: m['AdminHospitalityAddPage.fieldDescription'](),
					placeholder: m['AdminHospitalityAddPage.fieldDescriptionPlaceholder'](),
					rows: 4
				},
				{
					id: 'reservationRequestsEnabled',
					kind: 'checkbox',
					label: m['AdminHospitalityAddPage.fieldReservationRequestsEnabled'](),
					description: m['AdminHospitalityAddPage.fieldReservationRequestsEnabledDescription']()
				},
				{
					id: 'isActive',
					kind: 'checkbox',
					label: m['AdminHospitalityAddPage.fieldIsActive'](),
					description: m['AdminHospitalityAddPage.fieldIsActiveDescription']()
				}
			]
		}
	];

	let values = $state<HospitalityAddFormInputs>({
		name: '',
		type: '' as HospitalityAddFormInputs['type'],
		address: '',
		city: '',
		country: '',
		description: '',
		contactPhone: '',
		contactEmail: '',
		website: '',
		ownerId: '',
		reservationRequestsEnabled: false,
		isActive: true,
		coverImageKey: null
	});
</script>

<SvelteHead />

<section class="flex w-full justify-center px-4 py-6 md:px-6 md:py-8">
	<div class="flex w-full max-w-3xl flex-col gap-6">
		<header
			class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
		>
			<div class="flex min-w-0 flex-col gap-1 sm:flex-1">
				<h1 class="text-2xl font-semibold tracking-tight">
					{m['AdminHospitalityAddPage.title']()}
				</h1>
				<p class="text-muted-foreground text-sm leading-relaxed">
					{m['AdminHospitalityAddPage.description']()}
				</p>
			</div>
			<Button
				variant="outline"
				href={ADMIN_PAGE_ENDPOINTS.HOSPITALITIES}
				class="w-full shrink-0 sm:w-auto sm:self-center"
			>
				<ArrowLeftIcon data-icon="inline-start" />
				{m['AdminHospitalityAddPage.back']()}
			</Button>
		</header>

		<ConvexMutationForm
			class="w-full"
			{sections}
			bind:values
			schema={hospitalityAddFormSchema}
			runFunction={api.tables.hospitalities.mutations.createHospitality.createHospitality}
			submitLabel={m['AdminHospitalityAddPage.submit']()}
			customFields={{ ownerId: ownerField }}
			resetOnSuccess={false}
			onSuccess={() => appGoto(ADMIN_PAGE_ENDPOINTS.HOSPITALITIES)}
		/>
	</div>
</section>

{#snippet ownerField({ value, setValue, inputId }: MutationFormFieldSnippetProps<HospitalityAddFormInputs>)}
	<AdminOwnerField value={String(value ?? '')} {inputId} onValueChange={setValue} />
{/snippet}
