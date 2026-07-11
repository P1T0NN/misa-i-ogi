<script lang="ts">
	// LIBRARIES
	import { m } from '@/shared/lib/paraglide/messages';

	// CLASSES
	import { contactSectionClass } from './contactSection.svelte.ts';

	// COMPONENTS
	import * as Card from '@/shared/components/ui/card/index.js';
	import {
		Field,
		FieldContent,
		FieldError,
		FieldGroup,
		FieldLabel,
		FieldSet
	} from '@/shared/components/ui/field';
	import { Input } from '@/shared/components/ui/input/index.js';
	import { Textarea } from '@/shared/components/ui/textarea/index.js';
	import ContactSubmitButton from './contact-submit-button.svelte';

	// UTILS
	import { clearFieldErrorOn } from '@/shared/utils/validationUtils.js';
</script>

<Card.Root class="shadow-card-soft gap-0 border border-border-2 bg-card p-4 sm:p-5">
	<Card.Header class="p-0">
		<Card.Title class="text-base font-semibold text-foreground">
			{m['ContactSection.ContactRightContent.formTitle']()}
		</Card.Title>

		<Card.Description class="mt-1 text-sm text-muted-foreground">
			{m['ContactSection.ContactRightContent.formDescription']()}
		</Card.Description>
	</Card.Header>

	<Card.Content class="p-0 pt-3">
		<FieldSet>
			<FieldGroup class="gap-4">
				<Field data-invalid={Boolean(contactSectionClass.fieldErrors.name)}>
					<FieldLabel for="contact-name">
						{m['ContactSection.ContactRightContent.nameLabel']()}
					</FieldLabel>

					<FieldContent>
						<Input
							id="contact-name"
							bind:value={contactSectionClass.contactInputs.name}
							type="text"
							name="name"
							autocomplete="name"
							placeholder={m['ContactSection.ContactRightContent.namePlaceholder']()}
							aria-invalid={Boolean(contactSectionClass.fieldErrors.name)}
							oninput={clearFieldErrorOn(contactSectionClass, 'name')}
						/>

						{#if contactSectionClass.fieldErrors.name}
							<FieldError>{contactSectionClass.fieldErrors.name}</FieldError>
						{/if}
					</FieldContent>
				</Field>

				<Field data-invalid={Boolean(contactSectionClass.fieldErrors.email)}>
					<FieldLabel for="contact-email">
						{m['ContactSection.ContactRightContent.emailLabel']()}
					</FieldLabel>

					<FieldContent>
						<Input
							id="contact-email"
							bind:value={contactSectionClass.contactInputs.email}
							type="email"
							name="email"
							autocomplete="email"
							placeholder={m['ContactSection.ContactRightContent.emailPlaceholder']()}
							aria-invalid={Boolean(contactSectionClass.fieldErrors.email)}
							oninput={clearFieldErrorOn(contactSectionClass, 'email')}
						/>

						{#if contactSectionClass.fieldErrors.email}
							<FieldError>{contactSectionClass.fieldErrors.email}</FieldError>
						{/if}
					</FieldContent>
				</Field>

				<Field data-invalid={Boolean(contactSectionClass.fieldErrors.message)}>
					<FieldLabel for="contact-message">
						{m['ContactSection.ContactRightContent.messageLabel']()}
					</FieldLabel>

					<FieldContent>
						<Textarea
							id="contact-message"
							bind:value={contactSectionClass.contactInputs.message}
							name="message"
							rows={5}
							placeholder={m['ContactSection.ContactRightContent.messagePlaceholder']()}
							aria-invalid={Boolean(contactSectionClass.fieldErrors.message)}
							oninput={clearFieldErrorOn(contactSectionClass, 'message')}
							class="resize-none"
						/>

						{#if contactSectionClass.fieldErrors.message}
							<FieldError>{contactSectionClass.fieldErrors.message}</FieldError>
						{/if}
					</FieldContent>
				</Field>
			</FieldGroup>
		</FieldSet>

		<!--
			Honeypot - invisible to humans (off-screen + aria-hidden + tabindex=-1),
			but most form-stuffing bots will fill it in. Server rejects any non-empty value.
		-->
		<div
			aria-hidden="true"
			style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;"
		>
			<label for="contact-website">{m['ContactSection.ContactRightContent.honeypotLabel']()}</label>
			<input
				id="contact-website"
				type="text"
				name="website"
				autocomplete="off"
				tabindex={-1}
				bind:value={contactSectionClass.contactInputs.website}
			/>
		</div>

		<ContactSubmitButton />

		<p class="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
			{m['ContactSection.ContactRightContent.footer']()}
		</p>
	</Card.Content>
</Card.Root>
