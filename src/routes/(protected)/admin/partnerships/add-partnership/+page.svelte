<script lang="ts">
	// SVELTEKIT IMPORTS
	import { appGoto } from '@/shared/utils/app-navigation';

	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { ADMIN_PAGE_ENDPOINTS } from '@/shared/page-endpoints.js';
	import { PARTNERSHIP_BENEFIT_MAX_LENGTH } from '@/shared/config.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ConvexMutationForm from '@/shared/components/ui/mutation-form/convex-mutation-form.svelte';
	import { Button } from '@/shared/components/ui/button/index.js';
	import { FieldDescription } from '@/shared/components/ui/field/index.js';
	import { Input } from '@/shared/components/ui/input/index.js';
	import PartnershipsSelectAccommodationDialog from '@/shared/components/pages/(protected)/admin/partnerships/partnerships-select-accommodation-dialog.svelte';
	import PartnershipsSelectHospitalityDialog from '@/shared/components/pages/(protected)/admin/partnerships/partnerships-select-hospitality-dialog.svelte';

	// SCHEMAS
	import {
		partnershipAddFormSchema,
		type PartnershipAddFormInputs
	} from '@/features/partnerships/schemas/partnershipsSchemas';

	// FORMS
	import { createPartnershipFormSections } from '@/features/partnerships/forms/createPartnershipForm';

	// TYPES
	import type {
		MutationFormCustomFields,
		MutationFormFieldSnippetProps
	} from '@/shared/components/ui/mutation-form/types.js';

	// LUCIDE ICONS
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';

	const sections = createPartnershipFormSections();

	let values = $state<PartnershipAddFormInputs>({
		accommodationId: '',
		hospitalityIds: [],
		benefit: ''
	});

	const customFields: MutationFormCustomFields<PartnershipAddFormInputs> = {
		accommodationId: accommodationField,
		hospitalityIds: hospitalityField,
		benefit: benefitField
	};
</script>

<SvelteHead
	title={m['AdminPartnershipAddPage.SEO.title']()}
	description={m['AdminPartnershipAddPage.SEO.description']()}
/>

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

{#snippet benefitField({
	inputId,
	value,
	setValue,
	error
}: MutationFormFieldSnippetProps<PartnershipAddFormInputs>)}
	{@const benefitValue = typeof value === 'string' ? value : ''}
	<Input
		id={inputId}
		name="benefit"
		value={benefitValue}
		maxlength={PARTNERSHIP_BENEFIT_MAX_LENGTH}
		placeholder={m['AdminPartnershipAddPage.fieldBenefitPlaceholder']()}
		required
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={`${inputId}-hint`}
		oninput={(event) => setValue(event.currentTarget.value)}
	/>
	<FieldDescription id={`${inputId}-hint`} class="flex items-center justify-between gap-3">
		<span>{m['AdminPartnershipAddPage.fieldBenefitDescription']()}</span>
		<span class="shrink-0 tabular-nums">{benefitValue.length}/{PARTNERSHIP_BENEFIT_MAX_LENGTH}</span>
	</FieldDescription>
{/snippet}
