// LIBRARIES
import * as v from 'valibot';
import { m } from '@/shared/lib/paraglide/messages';

export const partnershipAddFormSchema = v.object({
	accommodationId: v.pipe(
		v.string(),
		v.minLength(1, m['ValidationMessages.CreatePartnershipSchema.accommodationRequired']())
	),
	hospitalityIds: v.pipe(
		v.array(v.string()),
		v.minLength(1, m['ValidationMessages.CreatePartnershipSchema.hospitalityRequired']())
	),
	benefit: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreatePartnershipSchema.benefitRequired']()),
		v.maxLength(15, m['ValidationMessages.CreatePartnershipSchema.benefitMaxLength']())
	)
});

export type PartnershipAddFormInputs = v.InferInput<typeof partnershipAddFormSchema>;
