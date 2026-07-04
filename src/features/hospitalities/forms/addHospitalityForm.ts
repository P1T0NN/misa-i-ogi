// LIBRARIES
import { m } from '@/shared/lib/paraglide/messages';

// FEATURES
import { hospitalityTypeSelectOptions } from '@/features/hospitalities/data/hospitalitiesData';

// TYPES
import type { MutationFormSection } from '@/shared/components/ui/mutation-form/types.js';

export function addHospitalityFormSections(): MutationFormSection[] {
	return [
		{
			id: 'basics',
			title: m['AddHospitalityPage.AddHospitalityForm.sectionBasicsTitle'](),
			description: m['AddHospitalityPage.AddHospitalityForm.sectionBasicsDescription'](),
			fields: [
				{
					id: 'name',
					kind: 'input',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldName'](),
					placeholder: m['AddHospitalityPage.AddHospitalityForm.fieldNamePlaceholder'](),
					autofocus: true,
					colSpan: 1
				},
				{
					id: 'type',
					kind: 'select',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldType'](),
					selectPlaceholder: m['AddHospitalityPage.AddHospitalityForm.fieldTypePlaceholder'](),
					options: hospitalityTypeSelectOptions(),
					colSpan: 1
				}
			]
		},
		{
			id: 'location',
			title: m['AddHospitalityPage.AddHospitalityForm.sectionLocationTitle'](),
			description: m['AddHospitalityPage.AddHospitalityForm.sectionLocationDescription'](),
			fields: [
				{
					id: 'address',
					kind: 'input',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldAddress'](),
					placeholder: m['AddHospitalityPage.AddHospitalityForm.fieldAddressPlaceholder']()
				},
				{
					id: 'addressNumber',
					kind: 'input',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldAddressNumber'](),
					placeholder: m['AddHospitalityPage.AddHospitalityForm.fieldAddressNumberPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'city',
					kind: 'input',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldCity'](),
					placeholder: m['AddHospitalityPage.AddHospitalityForm.fieldCityPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'country',
					kind: 'input',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldCountry'](),
					placeholder: m['AddHospitalityPage.AddHospitalityForm.fieldCountryPlaceholder'](),
					colSpan: 1
				},
				{
					id: 'latitude',
					kind: 'input',
					type: 'number',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldLatitude'](),
					placeholder: m['AddHospitalityPage.AddHospitalityForm.fieldCoordinatesPlaceholder'](),
					disabled: true,
					colSpan: 1
				},
				{
					id: 'longitude',
					kind: 'input',
					type: 'number',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldLongitude'](),
					placeholder: m['AddHospitalityPage.AddHospitalityForm.fieldCoordinatesPlaceholder'](),
					disabled: true,
					colSpan: 1
				}
			]
		},
		{
			id: 'contact',
			title: m['AddHospitalityPage.AddHospitalityForm.sectionContactTitle'](),
			description: m['AddHospitalityPage.AddHospitalityForm.sectionContactDescription'](),
			columns: 1,
			fields: [
				{
					id: 'contactPhone',
					kind: 'input',
					type: 'tel',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldContactPhone'](),
					placeholder: m['AddHospitalityPage.AddHospitalityForm.fieldContactPhonePlaceholder']()
				}
			]
		},
		{
			id: 'cover',
			title: m['AddHospitalityPage.AddHospitalityForm.sectionCoverTitle'](),
			description: m['AddHospitalityPage.AddHospitalityForm.sectionCoverDescription'](),
			columns: 1,
			fields: [
				{
					id: 'coverImageKey',
					kind: 'upload-single',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldCoverImage'](),
					accept: 'image/*'
				}
			]
		},
		{
			id: 'menu',
			title: m['AddHospitalityPage.AddHospitalityForm.sectionMenuTitle'](),
			description: m['AddHospitalityPage.AddHospitalityForm.sectionMenuDescription'](),
			columns: 1,
			fields: [
				{
					id: 'menuFileKey',
					kind: 'upload-single',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldMenuFile'](),
					description: m['AddHospitalityPage.AddHospitalityForm.fieldMenuFileHint'](),
					accept: 'image/*,application/pdf'
				},
				{
					id: 'menuLink',
					kind: 'input',
					type: 'url',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldMenuLink'](),
					placeholder: m['AddHospitalityPage.AddHospitalityForm.fieldMenuLinkPlaceholder']()
				}
			]
		},
		{
			id: 'details',
			title: m['AddHospitalityPage.AddHospitalityForm.sectionDetailsTitle'](),
			description: m['AddHospitalityPage.AddHospitalityForm.sectionDetailsDescription'](),
			columns: 1,
			fields: [
				{
					id: 'description',
					kind: 'textarea',
					label: m['AddHospitalityPage.AddHospitalityForm.fieldDescription'](),
					placeholder: m['AddHospitalityPage.AddHospitalityForm.fieldDescriptionPlaceholder'](),
					rows: 4,
					required: true
				}
			]
		}
	];
}
