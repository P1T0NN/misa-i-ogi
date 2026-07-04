// LIBRARIES
import { m } from '@/shared/lib/paraglide/messages';

// TYPES
import type { MutationFormSection } from '@/shared/components/ui/mutation-form/types.js';

export function createPartnershipFormSections(): MutationFormSection[] {
	return [
		{
			id: 'partners',
			title: m['AdminPartnershipAddPage.sectionPartnersTitle'](),
			description: m['AdminPartnershipAddPage.sectionPartnersDescription'](),
			fields: [
				{
					id: 'accommodationId',
					kind: 'input',
					label: m['AdminPartnershipAddPage.fieldAccommodation'](),
					colSpan: 1
				},
				{
					id: 'hospitalityIds',
					kind: 'input',
					label: m['AdminPartnershipAddPage.fieldHospitality'](),
					colSpan: 1
				}
			]
		},
		{
			id: 'offer',
			title: m['AdminPartnershipAddPage.sectionOfferTitle'](),
			description: m['AdminPartnershipAddPage.sectionOfferDescription'](),
			fields: [
				{
					id: 'benefit',
					kind: 'input',
					label: m['AdminPartnershipAddPage.fieldBenefit'](),
					placeholder: m['AdminPartnershipAddPage.fieldBenefitPlaceholder'](),
					required: true
				}
			]
		}
	];
}
