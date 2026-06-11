<script lang="ts">
	// SVELTEKIT IMPORTS
	import { appGoto } from '@/shared/utils/app-navigation';

	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { ADMIN_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ConvexMutationForm from '@/shared/components/ui/mutation-form/convex-mutation-form.svelte';
	import { Button } from '@/shared/components/ui/button/index.js';
	import PartnershipsSelectAccommodationDialog from '@/shared/components/pages/(protected)/admin/partnerships/partnerships-select-accommodation-dialog.svelte';
	import PartnershipsSelectHospitalityDialog from '@/shared/components/pages/(protected)/admin/partnerships/partnerships-select-hospitality-dialog.svelte';

	// SCHEMAS
	import {
		partnershipAddFormSchema,
		type PartnershipAddFormInputs
	} from '@/features/partnerships/schemas/partnershipsSchemas';

	// TYPES
	import type {
		MutationFormCustomFields,
		MutationFormFieldSnippetProps,
		MutationFormSection
	} from '@/shared/components/ui/mutation-form/types.js';

	// LUCIDE ICONS
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';

	const sections: MutationFormSection[] = [
		{
			id: 'partners',
			title: m['AdminPartnershipAddPage.sectionPartnersTitle'](),
			description: m['AdminPartnershipAddPage.sectionPartnersDescription'](),
			fields: [
				{
					id: 'accommodationId',
					kind: 'input',
					label: m['AdminPartnershipAddPage.fieldAccommodation'](),
					colSpan: 1
				},
				{
					id: 'hospitalityIds',
					kind: 'input',
					label: m['AdminPartnershipAddPage.fieldHospitality'](),
					colSpan: 1
				}
			]
		},
		{
			id: 'offer',
			title: m['AdminPartnershipAddPage.sectionOfferTitle'](),
			description: m['AdminPartnershipAddPage.sectionOfferDescription'](),
			fields: [
				{
					id: 'discountPercentage',
					kind: 'input',
					type: 'number',
					label: m['AdminPartnershipAddPage.fieldDiscount'](),
					placeholder: m['AdminPartnershipAddPage.fieldDiscountPlaceholder'](),
					description: m['AdminPartnershipAddPage.fieldDiscountDescription']()
				}
			]
		}
	];

	let values = $state<PartnershipAddFormInputs>({
		accommodationId: '',
		hospitalityIds: [],
		discountPercentage: ''
	});

	const customFields: MutationFormCustomFields<PartnershipAddFormInputs> = {
		accommodationId: accommodationField,
		hospitalityIds: hospitalityField
	};
</script>

<SvelteHead />

<section class="flex w-full justify-center px-4 py-6 md:px-6 md:py-8">
	<div class="flex w-full max-w-3xl flex-col gap-6">
		<header
			class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
		>
			<div class="flex min-w-0 flex-col gap-1 sm:flex-1">
				<h1 class="text-2xl font-semibold tracking-tight">
					{m['AdminPartnershipAddPage.title']()}
				</h1>
				<p class="text-sm leading-relaxed text-muted-foreground">
					{m['AdminPartnershipAddPage.description']()}
				</p>
			</div>

			<Button
				variant="outline"
				href={ADMIN_PAGE_ENDPOINTS.PARTNERSHIPS}
				class="w-full shrink-0 sm:w-auto sm:self-center"
			>
				<ArrowLeftIcon data-icon="inline-start" />
				{m['AdminPartnershipAddPage.back']()}
			</Button>
		</header>

		<ConvexMutationForm
			class="w-full"
			{sections}
			{customFields}
			bind:values
			schema={partnershipAddFormSchema}
			runFunction={api.tables.partnerships.mutations.createPartnership.createPartnership}
			submitLabel={m['AdminPartnershipAddPage.submit']()}
			resetOnSuccess={false}
			onSuccess={() => {
				void appGoto(ADMIN_PAGE_ENDPOINTS.PARTNERSHIPS);
			}}
		/>
	</div>
</section>

{#snippet accommodationField({
	inputId,
	value,
	setValue
}: MutationFormFieldSnippetProps<PartnershipAddFormInputs>)}
	<PartnershipsSelectAccommodationDialog
		{inputId}
		value={typeof value === 'string' ? value : ''}
		{setValue}
	/>
{/snippet}

{#snippet hospitalityField({
	inputId,
	value,
	setValue
}: MutationFormFieldSnippetProps<PartnershipAddFormInputs>)}
	<PartnershipsSelectHospitalityDialog
		{inputId}
		value={Array.isArray(value) ? value : []}
		{setValue}
	/>
{/snippet}
