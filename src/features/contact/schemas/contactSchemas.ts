// LIBRARIES
import * as v from 'valibot';
import { m } from '@/shared/lib/paraglide/messages';

export const sendContactFormEmailSchema = v.object({
	name: v.pipe(
		v.string(),
		v.minLength(3, m['ValidationMessages.ContactSection.nameMinLength']()),
		v.maxLength(100, m['ValidationMessages.ContactSection.nameMaxLength']())
	),
	email: v.pipe(
		v.string(),
		v.email(m['ValidationMessages.ContactSection.invalidEmail']()),
		v.maxLength(254)
	),
	message: v.pipe(
		v.string(),
		v.minLength(10, m['ValidationMessages.ContactSection.messageMinLength']()),
		v.maxLength(5000, m['ValidationMessages.ContactSection.messageMaxLength']())
	),
	// Honeypot — invisible field hidden from real users via CSS. Bots that
	// auto-fill every input will leave a non-empty value and get rejected.
	website: v.optional(v.literal(''))
});

export type SendContactFormEmailSchema = v.InferOutput<typeof sendContactFormEmailSchema>;
