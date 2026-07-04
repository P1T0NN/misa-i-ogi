<script lang="ts">
	// SVELTEKIT IMPORTS
	import { appGoto } from '@/shared/utils/app-navigation';

	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { PROTECTED_PAGE_ENDPOINTS } from '@/shared/constants.js';
	import { PARTNERSHIP_BENEFIT_MAX_LENGTH } from '@/shared/config.js';

	// CLASSES
	import { authClass } from '@/features/auth/classes/authClass.svelte';

	// COMPONENTS
	import ConvexMutationForm from '@/shared/components/ui/mutation-form/convex-mutation-form.svelte';
	import CreateCustomPartnershipFormActions from '@/shared/components/pages/(protected)/create-custom-partnership/create-custom-partnership-form-actions.svelte';
	import SelectMyAccommodationDialog from '@/features/accommodations/components/select-my-accommodation-dialog/select-my-accommodation-dialog.svelte';
	import CustomPartnershipTrialNotice from '@/shared/components/pages/(protected)/create-custom-partnership/custom-partnership-trial-notice.svelte';
	import { Input } from '@/shared/components/ui/input/index.js';
	import { FieldDescription } from '@/shared/components/ui/field/index.js';
	import { Badge } from '@/shared/components/ui/badge/index.js';

	// SCHEMAS
	import {
		myPartnershipAddFormSchema,
		type MyPartnershipAddFormInputs
	} from '@/features/partnerships/schemas/partnershipsSchemas';

	// FORMS
	import { createCustomPartnershipFormSections } from '@/features/partnerships/forms/createCustomPartnershipForm';

	// HELPERS
	import { CONNECT_CODE_LENGTH } from '@/convex/tables/hospitalities/helpers/connectCode';

	// UTILS
	import { hasProAccess } from '@/features/auth/utils/hasProAccess';

	// TYPES
	import type { MutationFormFieldSnippetProps } from '@/shared/components/ui/mutation-form/types.js';

	const sections = createCustomPartnershipFormSections();

	let values = $state<MyPartnershipAddFormInputs>({
		accommodationId: '',
		connectCode: '',
		benefit: ''
	});

	const access = $derived(hasProAccess(authClass.currentUser));

	const connectPreview = useQuery(
		api.tables.hospitalities.queries.fetchConnectCodePreview.fetchConnectCodePreview,
		() =>
			values.connectCode.length === CONNECT_CODE_LENGTH
				? { connectCode: values.connectCode }
				: 'skip'
	);

	const isOwnVenue = $derived(connectPreview.data?.isOwnHospitality === true);
	const awaitingPreview = $derived(
		values.connectCode.length === CONNECT_CODE_LENGTH &&
			connectPreview.data === undefined &&
			connectPreview.isLoading
	);
	const submitDisabled = $derived(
		awaitingPreview || (isOwnVenue && !(values.benefit ?? '').trim())
	);
</script>

{#if access === 'trial-expired'}
	<CustomPartnershipTrialNotice />
{:else}
	<ConvexMutationForm
		class="w-full"
		{sections}
		bind:values
		schema={myPartnershipAddFormSchema}
		runFunction={api.tables.partnerships.mutations.createCustomPartnership
			.createCustomPartnership}
		customFields={{
			accommodationId: accommodationField,
			connectCode: connectCodeField
		}}
		resetOnSuccess={false}
		prepareSubmit={async ({ args }) => {
			if (!isOwnVenue) delete args.benefit;
		}}
		onSuccess={() => {
			void appGoto(PROTECTED_PAGE_ENDPOINTS.PARTNERSHIPS);
		}}
	>
		{#snippet extraFields()}
			{#if connectPreview.data}
				<div class="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
					<div class="flex flex-wrap items-center gap-2">
						<span class="text-sm font-medium">{connectPreview.data.hospitalityName}</span>
						{#if connectPreview.data.isOwnHospitality}
							<Badge variant="outline">
								{m['CreateCustomPartnershipPage.CreateCustomPartnershipForm.ownVenueBadge']()}
							</Badge>
						{/if}
					</div>
					<span class="text-xs text-muted-foreground">{connectPreview.data.hospitalityCity}</span>
				</div>
			{/if}

			{#if isOwnVenue}
				<label class="flex flex-col gap-1.5">
					<div class="flex items-center justify-between gap-2">
						<span class="text-sm font-medium">
							{m['PartnershipsPage.PartnershipRequestItem.benefitLabel']()}
						</span>
						
						<span class="shrink-0 text-xs tabular-nums text-muted-foreground">
							{(values.benefit ?? '').length}/{PARTNERSHIP_BENEFIT_MAX_LENGTH}
						</span>
					</div>

					<Input
						bind:value={values.benefit}
						maxlength={PARTNERSHIP_BENEFIT_MAX_LENGTH}
						placeholder={m['PartnershipsPage.PartnershipRequestItem.benefitPlaceholder']()}
					/>
					<FieldDescription>
						{m['CreateCustomPartnershipPage.CreateCustomPartnershipForm.ownVenueBenefitHint']()}
					</FieldDescription>
				</label>
			{:else if connectPreview.data}
				<p class="text-sm text-muted-foreground">
					{m['CreateCustomPartnershipPage.CreateCustomPartnershipForm.partnerVenueBenefitHint']()}
				</p>
			{/if}
		{/snippet}

		{#snippet actions({ busy }: { busy: boolean })}
			<CreateCustomPartnershipFormActions
				{busy}
				{isOwnVenue}
				{submitDisabled}
				showTrialHint={access === 'trial-available'}
			/>
		{/snippet}
	</ConvexMutationForm>
{/if}

{#snippet accommodationField({
	inputId,
	value,
	setValue
}: MutationFormFieldSnippetProps<MyPartnershipAddFormInputs>)}
	<SelectMyAccommodationDialog
		{inputId}
		value={typeof value === 'string' ? value : ''}
		setValue={(next) => {
			setValue(next);
			values.connectCode = '';
			values.benefit = '';
		}}
	/>
{/snippet}

{#snippet connectCodeField({
	inputId,
	value,
	setValue,
	error
}: MutationFormFieldSnippetProps<MyPartnershipAddFormInputs>)}
	{#if !values.accommodationId}
		<p class="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
			{m['CreateCustomPartnershipPage.CreateCustomPartnershipForm.pickAccommodationFirst']()}
		</p>
	{:else}
		<Input
			id={inputId}
			name="connectCode"
			value={typeof value === 'string' ? value : ''}
			maxlength={CONNECT_CODE_LENGTH}
			placeholder={m[
				'CreateCustomPartnershipPage.CreateCustomPartnershipForm.connectCodePlaceholder'
			]()}
			autocomplete="off"
			class="tracking-[0.3em] uppercase"
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={`${inputId}-hint`}
			oninput={(event) => {
				setValue(event.currentTarget.value.toUpperCase());
				values.benefit = '';
			}}
		/>
		<FieldDescription id={`${inputId}-hint`}>
			{m['CreateCustomPartnershipPage.CreateCustomPartnershipForm.connectCodeHint']()}
		</FieldDescription>
	{/if}
{/snippet}
