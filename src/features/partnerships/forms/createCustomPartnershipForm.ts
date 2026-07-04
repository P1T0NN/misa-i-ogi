// LIBRARIES
import { m } from '@/shared/lib/paraglide/messages';

// TYPES
import type { MutationFormSection } from '@/shared/components/ui/mutation-form/types.js';

export function createCustomPartnershipFormSections(): MutationFormSection[] {
	return [
		{
			id: 'partners',
			title: m['CreateCustomPartnershipPage.CreateCustomPartnershipForm.sectionTitle'](),
			description:
				m['CreateCustomPartnershipPage.CreateCustomPartnershipForm.sectionDescription'](),
			fields: [
				{
					id: 'accommodationId',
					kind: 'input',
					label: m['CreateCustomPartnershipPage.CreateCustomPartnershipForm.fieldAccommodation'](),
					colSpan: 1
				},
				{
					id: 'connectCode',
					kind: 'input',
					label: m['CreateCustomPartnershipPage.CreateCustomPartnershipForm.fieldConnectCode'](),
					colSpan: 1
				}
			]
		}
	];
}
