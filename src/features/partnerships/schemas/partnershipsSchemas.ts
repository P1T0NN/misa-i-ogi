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
	discountPercentage: v.optional(
		v.pipe(
			v.string(),
			v.trim(),
			v.check(
				(s) =>
					s === '' ||
					(!Number.isNaN(Number(s)) && Number(s) >= 1 && Number(s) <= 100),
				m['ValidationMessages.CreatePartnershipSchema.discountRange']()
			)
		)
	)
});

export type PartnershipAddFormInputs = v.InferInput<typeof partnershipAddFormSchema>;
