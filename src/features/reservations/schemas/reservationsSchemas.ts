// LIBRARIES
import * as v from 'valibot';
import { m } from '@/shared/lib/paraglide/messages';

/**
 * Client-side validation for the reservation request dialog.
 *
 * `requestedTime` must be a valid "HH:MM" string (the `CustomTimeInput`
 * already enforces this, but the schema is the authoritative gate).
 * `guestName` and `phone` are mandatory; `email` is optional but must be
 * a valid email address when provided.
 */
export const createReservationSchema = v.object({
	guestName: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateReservationSchema.guestNameRequired']())
	),
	requestedTime: v.pipe(
		v.string(),
		v.regex(
			/^([01]\d|2[0-3]):[0-5]\d$/,
			m['ValidationMessages.CreateReservationSchema.timeInvalid']()
		)
	),
	phone: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateReservationSchema.phoneRequired']())
	),
	email: v.union([
		v.literal(''),
		v.pipe(
			v.string(),
			v.trim(),
			v.email(m['ValidationMessages.CreateReservationSchema.emailInvalid']())
		)
	])
});

export type CreateReservationInput = v.InferInput<typeof createReservationSchema>;
