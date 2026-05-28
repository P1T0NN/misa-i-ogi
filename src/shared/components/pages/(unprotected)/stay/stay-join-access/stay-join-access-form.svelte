<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';
	import * as v from 'valibot';

	// REMOTE FUNCTIONS
	import { joinGuestStay } from '@/features/guests/mutations/joinGuestStay.remote';

	// COMPONENTS
	import { Button } from '@/shared/components/ui/button/index.js';
	import * as Card from '@/shared/components/ui/card/index.js';
	import {
		Field,
		FieldDescription,
		FieldError,
		FieldLabel
	} from '@/shared/components/ui/field/index.js';
	import { Input } from '@/shared/components/ui/input/index.js';
	import Spinner from '@/shared/components/ui/spinner/spinner.svelte';

	// SCHEMAS
	import { joinGuestStaySchema } from '@/features/guests/schemas/guestStaySchemas';

	let { activeScan = false }: { activeScan?: boolean } = $props();

	const SHARING_CODE_LENGTH = 4;
	const id = $props.id();

	let sharingCode = $state('');
	let errorMessage = $state<string | null>(null);
	let isPending = $state(false);

	const isInvalid = $derived(errorMessage !== null);

	async function requestAccess() {
		if (isPending) return;

		const validation = v.safeParse(joinGuestStaySchema, { sharingCode });
		if (!validation.success) {
			errorMessage = validation.issues[0]?.message;
			return;
		}

		isPending = true;
		errorMessage = null;

		try {
			const result = await joinGuestStay(validation.output);

			if (result.success) {
				window.location.reload();
				return;
			}

			errorMessage = result.message;
		} catch {
			errorMessage = m['StayPage.StayJoinAccessForm.unavailable']();
		} finally {
			isPending = false;
		}
	}

	function handleCodeInput() {
		errorMessage = null;
	}

	function handleCodeKeydown(event: KeyboardEvent) {
		if (event.key !== 'Enter') return;
		event.preventDefault();
		void requestAccess();
	}
</script>

<Card.Root class="gap-5 rounded-xl border border-border bg-card p-6 shadow-none">
	<Card.Header class="gap-2 p-0">
		<Card.Title class="font-serif text-xl font-medium text-foreground">
			{#if activeScan}
				{m['StayPage.StayJoinAccessForm.activeTitle']()}
			{:else}
				{m['StayPage.StayJoinAccessForm.title']()}
			{/if}
		</Card.Title>
		<Card.Description class="text-sm leading-relaxed text-muted-foreground">
			{#if activeScan}
				{m['StayPage.StayJoinAccessForm.body']()}
			{:else}
				{m['StayPage.StayJoinAccessForm.directBody']()}
			{/if}
		</Card.Description>
	</Card.Header>

	<Card.Content class="p-0">
		<div class="flex flex-col gap-4" aria-busy={isPending}>
			<Field data-invalid={isInvalid}>
				<FieldLabel for="stay-sharing-code-{id}">
					{m['StayPage.StayJoinAccessForm.label']()}
				</FieldLabel>
				<Input
					id="stay-sharing-code-{id}"
					name="sharingCode"
					type="text"
					autocomplete="one-time-code"
					autocapitalize="characters"
					spellcheck={false}
					maxlength={SHARING_CODE_LENGTH}
					bind:value={sharingCode}
					disabled={isPending}
					placeholder={m['StayPage.StayJoinAccessForm.placeholder']()}
					aria-invalid={isInvalid ? 'true' : undefined}
					oninput={handleCodeInput}
					onkeydown={handleCodeKeydown}
				/>
				<FieldDescription>{m['StayPage.StayJoinAccessForm.hint']()}</FieldDescription>
				{#if errorMessage}
					<FieldError>{errorMessage}</FieldError>
				{/if}
			</Field>

			<Button type="button" class="w-full" onclick={requestAccess} disabled={isPending}>
				{#if isPending}
					<Spinner />
				{/if}
				{m['StayPage.StayJoinAccessForm.submit']()}
			</Button>
		</div>
	</Card.Content>

	<Card.Description class="text-xs leading-relaxed text-muted-foreground">
		{m['StayPage.StayJoinAccessForm.scanInstead']()}
	</Card.Description>
</Card.Root>
