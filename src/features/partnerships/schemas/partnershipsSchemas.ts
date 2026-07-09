// LIBRARIES
import * as v from 'valibot';
import { m } from '@/shared/lib/paraglide/messages';

// CONFIG
import { PARTNERSHIP_BENEFIT_MAX_LENGTH } from '@/shared/config.js';

// HELPERS
import { CONNECT_CODE_LENGTH } from '@/convex/tables/hospitalities/helpers/connectCode';

export const partnershipAddFormSchema = v.object({
	accommodationId: v.pipe(
		v.string(),
		v.minLength(1, m['ValidationMessages.CreateCustomPartnershipSchema.accommodationRequired']())
	),
	hospitalityIds: v.pipe(
		v.array(v.string()),
		v.minLength(1, m['ValidationMessages.CreateCustomPartnershipSchema.hospitalityRequired']())
	),
	benefit: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateCustomPartnershipSchema.benefitRequired']()),
		v.maxLength(
			PARTNERSHIP_BENEFIT_MAX_LENGTH,
			m['ValidationMessages.CreateCustomPartnershipSchema.benefitMaxLength']()
		)
	)
});

export type PartnershipAddFormInputs = v.InferInput<typeof partnershipAddFormSchema>;

/**
 * Self-service create-partnership flow — the caller picks their accommodation
 * and types the target venue's connect code (no venue pool). The benefit is the
 * hospitality owner's call, supplied on accept for cross-owner requests.
 */
export const myPartnershipAddFormSchema = v.object({
	accommodationId: v.pipe(
		v.string(),
		v.minLength(1, m['ValidationMessages.CreateCustomPartnershipSchema.accommodationRequired']())
	),
	connectCode: v.pipe(
		v.string(),
		v.trim(),
		v.length(
			CONNECT_CODE_LENGTH,
			m['ValidationMessages.CreateCustomPartnershipSchema.connectCodeInvalid']()
		)
	),
	benefit: v.optional(
		v.pipe(
			v.string(),
			v.trim(),
			v.maxLength(
				PARTNERSHIP_BENEFIT_MAX_LENGTH,
				m['ValidationMessages.CreateCustomPartnershipSchema.benefitMaxLength']()
			)
		)
	)
});

export type MyPartnershipAddFormInputs = v.InferInput<typeof myPartnershipAddFormSchema>;
