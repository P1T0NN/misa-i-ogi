// LIBRARIES
import * as v from 'valibot';
import { m } from '@/shared/lib/paraglide/messages';

// CONFIG
import { PARTNERSHIP_BENEFIT_MAX_LENGTH } from '@/shared/config.js';

const hospitalityBenefit = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.benefitRequired']()),
	v.maxLength(
		PARTNERSHIP_BENEFIT_MAX_LENGTH,
		m['ValidationMessages.CreateHospitalitySchema.benefitMaxLength']()
	)
);

const hospitalityCoordinate = v.pipe(
	v.nullable(v.number()),
	v.check(
		(value) => value !== null,
		m['ValidationMessages.CreateHospitalitySchema.coordinatesRequired']()
	)
);

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
	addressNumber: v.optional(v.pipe(v.string(), v.trim())),
	latitude: hospitalityCoordinate,
	longitude: hospitalityCoordinate,
	reservationMode: v.literal('managed_request'),
	createType: v.picklist(['platform', 'user'] as const),
	benefit: hospitalityBenefit,
	ownerId: v.optional(v.pipe(v.string(), v.trim())),
	isActive: v.boolean(),
	// Ordered gallery — the first image is the cover. At least one is required.
	images: v.pipe(
		v.array(v.file()),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.imagesRequired']())
	),
	menuFileKey: v.optional(v.union([v.null(), v.file()])),
	menuLink: v.optional(v.pipe(v.string(), v.trim()))
});

export type HospitalityAddFormInputs = v.InferInput<typeof hospitalityAddFormSchema>;

/** Self-service Add Hospitality page — venue only; partnerships are created separately. */
export const addHospitalityFormSchema = v.omit(hospitalityAddFormSchema, [
	'ownerId',
	'isActive',
	'createType'
]);

export type AddHospitalityFormInputs = v.InferInput<typeof addHospitalityFormSchema>;

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
	addressNumber: v.optional(v.pipe(v.string(), v.trim())),
	latitude: hospitalityCoordinate,
	longitude: hospitalityCoordinate,
	reservationMode: v.literal('managed_request'),
	isActive: v.boolean(),
	// Ordered gallery — existing images ({key,url}) and/or newly picked Files; first is the cover.
	images: v.pipe(
		v.array(v.union([v.file(), v.object({ key: v.string(), url: v.string() })])),
		v.minLength(1, m['ValidationMessages.CreateHospitalitySchema.imagesRequired']())
	),
	menuFileKey: v.optional(v.union([v.null(), v.file()])),
	menuLink: v.optional(v.pipe(v.string(), v.trim()))
});

export type HospitalityEditFormInputs = v.InferInput<typeof hospitalityEditFormSchema>;

/** Admin edit form — the owner edit fields PLUS the admin-only `benefit` (guest offer). */
export const hospitalityAdminEditFormSchema = v.object({
	...hospitalityEditFormSchema.entries,
	benefit: hospitalityBenefit
});

export type HospitalityAdminEditFormInputs = v.InferInput<typeof hospitalityAdminEditFormSchema>;
