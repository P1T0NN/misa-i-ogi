// LIBRARIES
import * as v from 'valibot';

export const sendContactFormEmailSchema = v.object({
	name: v.pipe(
		v.string(),
		v.minLength(3, 'Name must be at least 3 characters'),
		v.maxLength(100, 'Name must be at most 100 characters')
	),
	email: v.pipe(v.string(), v.email('Please enter a valid email address'), v.maxLength(254)),
	message: v.pipe(
		v.string(),
		v.minLength(10, 'Message must be at least 10 characters'),
		v.maxLength(5000, 'Message must be at most 5000 characters')
	),
	// Honeypot — invisible field hidden from real users via CSS. Bots that
	// auto-fill every input will leave a non-empty value and get rejected.
	website: v.optional(v.literal(''))
});

export type SendContactFormEmailSchema = v.InferOutput<typeof sendContactFormEmailSchema>;
