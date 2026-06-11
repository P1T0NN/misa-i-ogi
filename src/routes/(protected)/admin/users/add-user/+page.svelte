<script lang="ts">
	// LIBRARIES
	import { api } from '@/convex/_generated/api';
	import { m } from '@/shared/lib/paraglide/messages';

	// CONFIG
	import { ADMIN_PAGE_ENDPOINTS } from '@/shared/constants.js';

	// COMPONENTS
	import SvelteHead from '@/shared/components/ui/svelte-head/svelte-head.svelte';
	import ConvexMutationForm from '@/shared/components/ui/mutation-form/convex-mutation-form.svelte';
	import { Button } from '@/shared/components/ui/button/index.js';
	import PasswordInput from '@/features/auth/components/password-input/password-input.svelte';

	// SCHEMAS
	import { userAddFormSchema, type UserAddFormInputs } from '@/features/users/schemas/usersSchemas';

	// UTILS
	import { appGoto } from '@/shared/utils/app-navigation';

	// TYPES
	import type {
		MutationFormCustomFields,
		MutationFormFieldSnippetProps,
		MutationFormPrepareSubmit,
		MutationFormSection
	} from '@/shared/components/ui/mutation-form/types.js';

	// LUCIDE ICONS
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';

	const sections: MutationFormSection[] = [
		{
			id: 'account',
			title: m['AdminUserAddPage.sectionAccountTitle'](),
			description: m['AdminUserAddPage.sectionAccountDescription'](),
			fields: [
				{
					id: 'name',
					kind: 'input',
					label: m['AdminUserAddPage.fieldName'](),
					placeholder: m['AdminUserAddPage.fieldNamePlaceholder'](),
					autocomplete: 'name',
					autofocus: true,
					colSpan: 1
				},
				{
					id: 'email',
					kind: 'input',
					type: 'email',
					label: m['AdminUserAddPage.fieldEmail'](),
					placeholder: m['AdminUserAddPage.fieldEmailPlaceholder'](),
					autocomplete: 'email',
					colSpan: 1
				}
			]
		},
		{
			id: 'credentials',
			title: m['AdminUserAddPage.sectionCredentialsTitle'](),
			description: m['AdminUserAddPage.sectionCredentialsDescription'](),
			fields: [
				{
					id: 'password',
					kind: 'input',
					label: m['AdminUserAddPage.fieldPassword'](),
					description: m['AdminUserAddPage.fieldPasswordDescription'](),
					autocomplete: 'new-password',
					colSpan: 1
				},
				{
					id: 'confirmPassword',
					kind: 'input',
					label: m['AdminUserAddPage.fieldConfirmPassword'](),
					autocomplete: 'new-password',
					colSpan: 1
				}
			]
		},
		{
			id: 'access',
			title: m['AdminUserAddPage.sectionAccessTitle'](),
			description: m['AdminUserAddPage.sectionAccessDescription'](),
			fields: [
				{
					id: 'role',
					kind: 'select',
					label: m['AdminUserAddPage.fieldRole'](),
					selectPlaceholder: m['AdminUserAddPage.fieldRolePlaceholder'](),
					options: [
						{ value: 'user', label: m['AdminUserAddPage.roleUser']() },
						{ value: 'admin', label: m['AdminUserAddPage.roleAdmin']() }
					],
					colSpan: 1
				},
				{
					id: 'emailVerified',
					kind: 'checkbox',
					label: m['AdminUserAddPage.fieldEmailVerified'](),
					description: m['AdminUserAddPage.fieldEmailVerifiedDescription'](),
					colSpan: 2
				}
			]
		}
	];

	let values = $state<UserAddFormInputs>({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: 'user',
		emailVerified: false
	});

	const customFields: MutationFormCustomFields<UserAddFormInputs> = {
		password: passwordField,
		confirmPassword: passwordField
	};

	const stripClientOnlyFields: MutationFormPrepareSubmit<UserAddFormInputs> = ({ args }) => {
		delete args.confirmPassword;
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
					{m['AdminUserAddPage.title']()}
				</h1>
				<p class="text-sm leading-relaxed text-muted-foreground">
					{m['AdminUserAddPage.description']()}
				</p>
			</div>

			<Button
				variant="outline"
				href={ADMIN_PAGE_ENDPOINTS.USERS}
				class="w-full shrink-0 sm:w-auto sm:self-center"
			>
				<ArrowLeftIcon data-icon="inline-start" />
				{m['AdminUserAddPage.back']()}
			</Button>
		</header>

		<ConvexMutationForm
			class="w-full"
			{sections}
			{customFields}
			bind:values
			schema={userAddFormSchema}
			runFunction={api.tables.users.userMutations.createUser}
			submitLabel={m['AdminUserAddPage.submit']()}
			resetOnSuccess={false}
			prepareSubmit={stripClientOnlyFields}
			onSuccess={() => {
				void appGoto(ADMIN_PAGE_ENDPOINTS.USERS);
			}}
		/>
	</div>
</section>

{#snippet passwordField({
	field,
	inputId,
	value,
	setValue,
	error
}: MutationFormFieldSnippetProps<UserAddFormInputs>)}
	<PasswordInput
		id={inputId}
		value={typeof value === 'string' ? value : ''}
		autocomplete={field.autocomplete}
		aria-invalid={error ? 'true' : undefined}
		oninput={(event) => setValue(event.currentTarget.value)}
	/>
{/snippet}
