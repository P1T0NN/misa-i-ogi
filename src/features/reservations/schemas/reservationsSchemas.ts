// LIBRARIES
import * as v from 'valibot';
import { m } from '@/shared/lib/paraglide/messages';

const MIN_GUEST_COUNT = 1;
const MAX_GUEST_COUNT = 50;

const guestCountSchema = v.pipe(
	v.union([v.string(), v.number()]),
	v.transform((value) => (typeof value === 'number' ? value : Number(value.trim()))),
	v.pipe(
		v.number(m['ValidationMessages.CreateReservationSchema.guestCountInvalid']()),
		v.integer(m['ValidationMessages.CreateReservationSchema.guestCountInvalid']()),
		v.minValue(MIN_GUEST_COUNT, m['ValidationMessages.CreateReservationSchema.guestCountMin']()),
		v.maxValue(MAX_GUEST_COUNT, m['ValidationMessages.CreateReservationSchema.guestCountMax']())
	)
);

/**
 * Client-side validation for the reservation request dialog.
 *
 * `requestedTime` must be a valid "HH:MM" string (the `CustomTimeInput`
 * already enforces this, but the schema is the authoritative gate).
 * `guestName`, `guestCount`, and `phone` are mandatory; `email` is optional but must be
 * a valid email address when provided.
 */
export const createReservationSchema = v.object({
	guestName: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateReservationSchema.guestNameRequired']())
	),
	guestCount: guestCountSchema,
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
