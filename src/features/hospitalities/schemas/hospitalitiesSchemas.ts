// LIBRARIES
import * as v from 'valibot';
import { m } from '@/shared/lib/paraglide/messages';

export const hospitalityAddFormSchema = v.object({
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.nameRequired']())
	),
	type: v.picklist(
		['restaurant', 'cafe', 'bar', 'night_club', 'horse_ride', 'spa', 'tour', 'other'] as const,
		m['ValidationMessages.CreateHospitalitySchema.typeRequired']()
	),
	address: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.addressRequired']())
	),
	city: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.cityRequired']())
	),
	country: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.countryRequired']())
	),
	description: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.descriptionRequired']())
	),
	contactPhone: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.phoneRequired']())
	),
	// Optional but format-checked when non-empty: empty string passes via the literal branch.
	contactEmail: v.union([
		v.literal(''),
		v.pipe(v.string(), v.trim(), v.email(m['ValidationMessages.CreateHospitalitySchema.emailInvalid']()))
	]),
	website: v.union([
		v.literal(''),
		v.pipe(v.string(), v.trim(), v.url(m['ValidationMessages.CreateHospitalitySchema.websiteInvalid']()))
	]),
	ownerId: v.optional(v.pipe(v.string(), v.trim())),
	reservationRequestsEnabled: v.boolean(),
	isActive: v.boolean(),
	// `null` until the user picks a file; validated as a real `File` on submit, then swapped for an R2 key.
	coverImageKey: v.pipe(
		v.union([v.null(), v.file()]),
		v.check((input) => input instanceof File, m['ValidationMessages.CreateHospitalitySchema.coverRequired']())
	)
});

export type HospitalityAddFormInputs = v.InferInput<typeof hospitalityAddFormSchema>;

export const hospitalityEditFormSchema = v.object({
	hospitalityId: v.pipe(v.string(), v.minLength(1)),
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.nameRequired']())
	),
	type: v.picklist(
		['restaurant', 'cafe', 'bar', 'night_club', 'horse_ride', 'spa', 'tour', 'other'] as const,
		m['ValidationMessages.CreateHospitalitySchema.typeRequired']()
	),
	address: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.addressRequired']())
	),
	city: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.cityRequired']())
	),
	country: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.countryRequired']())
	),
	description: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.descriptionRequired']())
	),
	contactPhone: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.phoneRequired']())
	),
	contactEmail: v.union([
		v.literal(''),
		v.pipe(v.string(), v.trim(), v.email(m['ValidationMessages.CreateHospitalitySchema.emailInvalid']()))
	]),
	website: v.union([
		v.literal(''),
		v.pipe(v.string(), v.trim(), v.url(m['ValidationMessages.CreateHospitalitySchema.websiteInvalid']()))
	]),
	reservationRequestsEnabled: v.boolean(),
	isActive: v.boolean(),
	coverImageKey: v.optional(v.union([v.null(), v.file()]))
});

export type HospitalityEditFormInputs = v.InferInput<typeof hospitalityEditFormSchema>;
