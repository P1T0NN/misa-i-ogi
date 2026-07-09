// LIBRARIES
import * as v from 'valibot';
import { m } from '@/shared/lib/paraglide/messages';

const accommodationCoordinate = v.pipe(
	v.nullable(v.number()),
	v.check(
		(value) => value !== null,
		m['ValidationMessages.CreateAccommodationSchema.coordinatesRequired']()
	)
);

const accommodationAddBaseSchema = {
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateAccommodationSchema.nameRequired']())
	),
	type: v.picklist(
		['apartment', 'hotel', 'villa', 'hostel', 'other'] as const,
		m['ValidationMessages.CreateAccommodationSchema.typeRequired']()
	),
	address: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateAccommodationSchema.addressRequired']())
	),
	city: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateAccommodationSchema.cityRequired']())
	),
	country: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateAccommodationSchema.countryRequired']())
	),
	// `null` until the user picks a file; validated as a real `File` on submit, then swapped for an R2 key.
	coverImageKey: v.pipe(
		v.union([v.null(), v.file()]),
		v.check(
			(input) => input instanceof File,
			m['ValidationMessages.CreateAccommodationSchema.coverRequired']()
		)
	)
};

export const accommodationAddFormSchema = v.object({
	...accommodationAddBaseSchema,
	addressNumber: v.optional(v.pipe(v.string(), v.trim())),
	latitude: accommodationCoordinate,
	longitude: accommodationCoordinate,
	ownerId: v.optional(v.pipe(v.string(), v.trim())),
	isActive: v.boolean()
});

export type AccommodationAddFormInputs = v.InferInput<typeof accommodationAddFormSchema>;

export const accommodationMyAddFormSchema = v.object({
	...accommodationAddBaseSchema,
	addressNumber: v.optional(v.pipe(v.string(), v.trim())),
	latitude: accommodationCoordinate,
	longitude: accommodationCoordinate
});

export type AccommodationMyAddFormInputs = v.InferInput<typeof accommodationMyAddFormSchema>;

export const accommodationEditFormSchema = v.object({
	accommodationId: v.pipe(v.string(), v.minLength(1)),
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateAccommodationSchema.nameRequired']())
	),
	type: v.picklist(
		['apartment', 'hotel', 'villa', 'hostel', 'other'] as const,
		m['ValidationMessages.CreateAccommodationSchema.typeRequired']()
	),
	address: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateAccommodationSchema.addressRequired']())
	),
	city: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateAccommodationSchema.cityRequired']())
	),
	country: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateAccommodationSchema.countryRequired']())
	),
	addressNumber: v.optional(v.pipe(v.string(), v.trim())),
	latitude: accommodationCoordinate,
	longitude: accommodationCoordinate,
	isActive: v.boolean(),
	coverImageKey: v.optional(v.union([v.null(), v.file()]))
});

export type AccommodationEditFormInputs = v.InferInput<typeof accommodationEditFormSchema>;
