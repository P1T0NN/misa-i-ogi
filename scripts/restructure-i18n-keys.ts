import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

type JsonObject = Record<string, unknown>;

function getAt(obj: JsonObject, path: string[]): unknown {
	let cur: unknown = obj;
	for (const part of path) {
		if (cur == null || typeof cur !== 'object' || Array.isArray(cur)) return undefined;
		cur = (cur as JsonObject)[part];
	}
	return cur;
}

function setAt(obj: JsonObject, path: string[], value: unknown): void {
	let cur: JsonObject = obj;
	for (let i = 0; i < path.length - 1; i++) {
		const part = path[i]!;
		const next = cur[part];
		if (next == null || typeof next !== 'object' || Array.isArray(next)) {
			cur[part] = {};
		}
		cur = cur[part] as JsonObject;
	}
	cur[path[path.length - 1]!] = value;
}

function deleteAt(obj: JsonObject, path: string[]): void {
	let cur: JsonObject = obj;
	for (let i = 0; i < path.length - 1; i++) {
		const part = path[i]!;
		const next = cur[part];
		if (next == null || typeof next !== 'object' || Array.isArray(next)) return;
		cur = next as JsonObject;
	}
	delete cur[path[path.length - 1]!];
}

function moveKeys(page: JsonObject, fromKeys: string[], toPath: string[]): void {
	const target: JsonObject = {};
	for (const key of fromKeys) {
		if (page[key] !== undefined) {
			target[key] = page[key];
			delete page[key];
		}
	}
	if (Object.keys(target).length > 0) {
		page[toPath[0]!] = { ...(page[toPath[0]!] as JsonObject), ...target };
	}
}

function hoistToRoot(messages: JsonObject, fromPath: string[], toRootKey: string): void {
	const source = getAt(messages, fromPath) as JsonObject | undefined;
	if (!source) return;
	messages[toRootKey] = source;
	deleteAt(messages, fromPath);
}

function flattenPageHeader(pageName: string, messages: JsonObject): void {
	const page = messages[pageName] as JsonObject;
	if (!page?.AnalyticsHeader) return;
	const header = page.AnalyticsHeader as JsonObject;
	for (const [key, value] of Object.entries(header)) {
		page[key] = value;
	}
	delete page.AnalyticsHeader;
}

function flattenPageError(pageName: string, errorComponentName: string, messages: JsonObject): void {
	const page = messages[pageName] as JsonObject;
	const errorBlock = page?.[errorComponentName] as JsonObject | undefined;
	if (!errorBlock) return;

	const mapping: Record<string, string> = {
		title: 'errorTitle',
		description: 'errorDescription',
		headerDescription: 'errorHeaderDescription',
		body: 'errorBody',
		bodyDescription: 'errorBodyDescription',
		retry: 'errorRetryLabel'
	};

	for (const [from, to] of Object.entries(mapping)) {
		if (errorBlock[from] !== undefined) {
			page[to] = errorBlock[from];
		}
	}
	delete page[errorComponentName];
}

function restructureMessages(messages: JsonObject): void {
	// features/ → root
	hoistToRoot(messages, ['HospitalityPage', 'RequestReservationDialog'], 'RequestReservationDialog');
	hoistToRoot(messages, ['HospitalityPage', 'GuestReservationCard'], 'GuestReservationCard');

	const loginPage = messages.LoginPage as JsonObject;
	if (loginPage?.continueWithGoogle !== undefined) {
		messages.GoogleLoginButton = {
			continueWithGoogle: loginPage.continueWithGoogle
		};
		delete loginPage.continueWithGoogle;
	}

	const hospitalityData = messages.HospitalityData as JsonObject;
	if (hospitalityData?.managedReservationsTitle !== undefined) {
		messages.ManagedReservationsAlert = {
			title: hospitalityData.managedReservationsTitle,
			description: hospitalityData.managedReservationsDescription
		};
		delete hospitalityData.managedReservationsTitle;
		delete hospitalityData.managedReservationsDescription;
	}

	// Rename nested component namespaces
	const renameNested = (pageName: string, from: string, to: string) => {
		const page = messages[pageName] as JsonObject;
		if (!page?.[from]) return;
		page[to] = page[from];
		delete page[from];
	};

	renameNested('AdminHospitalitiesPage', 'VisibilityButton', 'HospitalityVisibilityButton');
	renameNested('AddHospitalityPage', 'VisibilityNotice', 'AddHospitalityVisibilityNotice');

	const selectDialog = messages.SelectMyAccommodationDialog as JsonObject;
	if (selectDialog?.Error) {
		messages.SelectMyAccommodationDialogError = selectDialog.Error;
		delete selectDialog.Error;
	}
	if (selectDialog?.Empty) {
		messages.SelectMyAccommodationDialogEmpty = selectDialog.Empty;
		delete selectDialog.Empty;
	}

	// HospitalityLocation gets its own addressLineMeta
	const hospitalityPage = messages.HospitalityPage as JsonObject;
	const headerMeta = (hospitalityPage?.HospitalityHeader as JsonObject)?.addressLineMeta;
	if (headerMeta && hospitalityPage?.HospitalityLocation) {
		(hospitalityPage.HospitalityLocation as JsonObject).addressLineMeta = headerMeta;
	}

	// EditAccommodationPage component nesting
	const editAcc = messages.EditAccommodationPage as JsonObject;
	moveKeys(
		editAcc,
		['title', 'description', 'back'],
		['EditAccommodationHeader']
	);
	moveKeys(
		editAcc,
		[
			'sectionBasicsTitle',
			'sectionBasicsDescription',
			'sectionLocationTitle',
			'sectionLocationDescription',
			'sectionCoverTitle',
			'sectionCoverDescription',
			'currentCoverAlt',
			'sectionDetailsTitle',
			'sectionDetailsDescription',
			'fieldName',
			'fieldNamePlaceholder',
			'fieldType',
			'fieldTypePlaceholder',
			'fieldAddress',
			'fieldAddressPlaceholder',
			'fieldAddressNumber',
			'fieldAddressNumberPlaceholder',
			'fieldCity',
			'fieldCityPlaceholder',
			'fieldCountry',
			'fieldCountryPlaceholder',
			'fieldLatitude',
			'fieldLongitude',
			'fieldCoordinatesPlaceholder',
			'fieldDescription',
			'fieldDescriptionPlaceholder',
			'fieldIsActive',
			'fieldIsActiveDescription',
			'fieldCoverImage',
			'submit'
		],
		['EditAccommodationForm']
	);
	moveKeys(
		editAcc,
		['sectionGuestAccessTitle', 'sectionGuestAccessDescription', 'showQr'],
		['EditAccommodationGuestAccess']
	);
	flattenPageError('EditAccommodationPage', 'EditAccommodationError', messages);

	// EditHospitalityPage component nesting
	const editHosp = messages.EditHospitalityPage as JsonObject;
	moveKeys(editHosp, ['title', 'description', 'back'], ['EditHospitalityHeader']);
	moveKeys(
		editHosp,
		[
			'sectionBasicsTitle',
			'sectionBasicsDescription',
			'sectionLocationTitle',
			'sectionLocationDescription',
			'sectionContactTitle',
			'sectionContactDescription',
			'sectionCoverTitle',
			'sectionCoverDescription',
			'currentCoverAlt',
			'sectionMenuTitle',
			'sectionMenuDescription',
			'fieldMenuFile',
			'fieldMenuFileHint',
			'fieldMenuLink',
			'fieldMenuLinkPlaceholder',
			'currentMenu',
			'currentMenuView',
			'sectionDetailsTitle',
			'sectionDetailsDescription',
			'fieldName',
			'fieldNamePlaceholder',
			'fieldType',
			'fieldTypePlaceholder',
			'fieldAddress',
			'fieldAddressPlaceholder',
			'fieldAddressNumber',
			'fieldAddressNumberPlaceholder',
			'fieldCity',
			'fieldCityPlaceholder',
			'fieldCountry',
			'fieldCountryPlaceholder',
			'fieldLatitude',
			'fieldLongitude',
			'fieldCoordinatesPlaceholder',
			'fieldContactPhone',
			'fieldContactPhonePlaceholder',
			'fieldReservationMode',
			'fieldDescription',
			'fieldDescriptionPlaceholder',
			'fieldIsActive',
			'fieldIsActiveDescription',
			'fieldCoverImage',
			'submit'
		],
		['EditHospitalityForm']
	);
	flattenPageError('EditHospitalityPage', 'EditHospitalityError', messages);

	// AdminPartnershipAddPage dialog keys
	const adminPartnershipAdd = messages.AdminPartnershipAddPage as JsonObject;
	moveKeys(
		adminPartnershipAdd,
		[
			'selectAccommodation',
			'modifyAccommodation',
			'selectAccommodationDialogTitle',
			'selectAccommodationLoading',
			'selectAccommodationTruncated'
		],
		['PartnershipsSelectAccommodationDialog']
	);
	moveKeys(
		adminPartnershipAdd,
		[
			'selectHospitality',
			'modifyHospitality',
			'selectHospitalityDialogTitle',
			'selectHospitalityDone',
			'selectHospitalitySelectedCount',
			'selectHospitalityLoading',
			'selectHospitalityTruncated'
		],
		['PartnershipsSelectHospitalityDialog']
	);

	// Analytics list pages: flatten header + error for +page.svelte
	for (const pageName of [
		'AnalyticsAccommodationsPage',
		'AnalyticsHospitalitiesPage',
		'AnalyticsReservationsPage',
		'AnalyticsOverviewPage'
	]) {
		flattenPageHeader(pageName, messages);
	}

	flattenPageError(
		'AnalyticsAccommodationsPage',
		'UserAnalyticsAccommodationsError',
		messages
	);
	flattenPageError(
		'AnalyticsHospitalitiesPage',
		'UserAnalyticsHospitalitiesError',
		messages
	);
	flattenPageError('AnalyticsReservationsPage', 'UserAnalyticsReservationsError', messages);
	flattenPageError('AnalyticsOverviewPage', 'UserAnalyticsOverviewError', messages);

	// Analytics detail pages
	for (const pageName of ['AnalyticsAccommodationDetailPage', 'AnalyticsHospitalityDetailPage']) {
		flattenPageHeader(pageName, messages);
	}
	flattenPageError(
		'AnalyticsAccommodationDetailPage',
		'UserAnalyticsAccommodationDetailError',
		messages
	);
	// Detail pages currently borrow list-page error keys — add dedicated block by copying if missing
	const accDetail = messages.AnalyticsAccommodationDetailPage as JsonObject;
	if (!accDetail.errorTitle) {
		const src = messages.AnalyticsAccommodationsPage as JsonObject;
		accDetail.errorTitle = src.errorTitle;
		accDetail.errorHeaderDescription = src.errorHeaderDescription;
		accDetail.errorBody = src.errorBody;
	}
	const hospDetail = messages.AnalyticsHospitalityDetailPage as JsonObject;
	if (!hospDetail.errorTitle) {
		const src = messages.AnalyticsHospitalitiesPage as JsonObject;
		hospDetail.errorTitle = src.errorTitle;
		hospDetail.errorHeaderDescription = src.errorHeaderDescription;
		hospDetail.errorBody = src.errorBody;
	}

	// Other +page.svelte inline errors
	flattenPageError('MyAccommodationsPage', 'MyAccommodationsError', messages);
	flattenPageError('MyHospitalitiesPage', 'MyHospitalitiesError', messages);
	flattenPageError('ReservationsPage', 'ReservationsTabsError', messages);
	flattenPageError('AdminDashboardPage', 'AdminDashboardError', messages);
	flattenPageError('AdminAnalyticsPage', 'AdminAnalyticsError', messages);
	flattenPageError('AdminUserPage', 'UserPageError', messages);

	// DashboardStats inline error
	const dashboard = messages.DashboardPage as JsonObject;
	const statsError = dashboard?.DashboardStatsError as JsonObject | undefined;
	if (statsError) {
		const stats = (dashboard.DashboardStats ?? {}) as JsonObject;
		stats.errorTitle = statsError.title;
		stats.errorDescription = statsError.description;
		dashboard.DashboardStats = stats;
		delete dashboard.DashboardStatsError;
	}

	// CreateCustomPartnershipForm benefit fields (avoid cross-page borrow)
	const createCustom = messages.CreateCustomPartnershipPage as JsonObject;
	const form = (createCustom?.CreateCustomPartnershipForm ?? {}) as JsonObject;
	const partnershipItem = (messages.PartnershipsPage as JsonObject)?.PartnershipRequestItem as
		| JsonObject
		| undefined;
	if (partnershipItem && !form.benefitLabel) {
		form.benefitLabel = partnershipItem.benefitLabel;
		form.benefitPlaceholder = partnershipItem.benefitPlaceholder;
		form.benefitHint = partnershipItem.benefitHint;
		createCustom.CreateCustomPartnershipForm = form;
	}
}

const PREFIX_REPLACEMENTS: Array<[string, string]> = [
	['HospitalityPage.RequestReservationDialog', 'RequestReservationDialog'],
	['HospitalityPage.GuestReservationCard', 'GuestReservationCard'],
	['LoginPage.continueWithGoogle', 'GoogleLoginButton.continueWithGoogle'],
	['HospitalityData.managedReservationsTitle', 'ManagedReservationsAlert.title'],
	['HospitalityData.managedReservationsDescription', 'ManagedReservationsAlert.description'],
	['AdminHospitalitiesPage.VisibilityButton', 'AdminHospitalitiesPage.HospitalityVisibilityButton'],
	['AddHospitalityPage.VisibilityNotice', 'AddHospitalityPage.AddHospitalityVisibilityNotice'],
	['SelectMyAccommodationDialog.Error', 'SelectMyAccommodationDialogError'],
	['SelectMyAccommodationDialog.Empty', 'SelectMyAccommodationDialogEmpty'],
	['EditAccommodationPage.title', 'EditAccommodationPage.EditAccommodationHeader.title'],
	['EditAccommodationPage.description', 'EditAccommodationPage.EditAccommodationHeader.description'],
	['EditAccommodationPage.back', 'EditAccommodationPage.EditAccommodationHeader.back'],
	['EditHospitalityPage.title', 'EditHospitalityPage.EditHospitalityHeader.title'],
	['EditHospitalityPage.description', 'EditHospitalityPage.EditHospitalityHeader.description'],
	['EditHospitalityPage.back', 'EditHospitalityPage.EditHospitalityHeader.back'],
	['HospitalityPage.HospitalityHeader.addressLineMeta', 'HospitalityPage.HospitalityLocation.addressLineMeta'],
	['AnalyticsAccommodationsPage.AnalyticsHeader.', 'AnalyticsAccommodationsPage.'],
	['AnalyticsHospitalitiesPage.AnalyticsHeader.', 'AnalyticsHospitalitiesPage.'],
	['AnalyticsReservationsPage.AnalyticsHeader.', 'AnalyticsReservationsPage.'],
	['AnalyticsOverviewPage.AnalyticsHeader.', 'AnalyticsOverviewPage.'],
	['AnalyticsAccommodationDetailPage.AnalyticsHeader.', 'AnalyticsAccommodationDetailPage.'],
	['AnalyticsHospitalityDetailPage.AnalyticsHeader.', 'AnalyticsHospitalityDetailPage.'],
	[
		'AnalyticsAccommodationsPage.UserAnalyticsAccommodationsError.title',
		'AnalyticsAccommodationsPage.errorTitle'
	],
	[
		'AnalyticsAccommodationsPage.UserAnalyticsAccommodationsError.headerDescription',
		'AnalyticsAccommodationsPage.errorHeaderDescription'
	],
	['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsError.body', 'AnalyticsAccommodationsPage.errorBody'],
	[
		'AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesError.title',
		'AnalyticsHospitalitiesPage.errorTitle'
	],
	[
		'AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesError.headerDescription',
		'AnalyticsHospitalitiesPage.errorHeaderDescription'
	],
	['AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesError.body', 'AnalyticsHospitalitiesPage.errorBody'],
	[
		'AnalyticsReservationsPage.UserAnalyticsReservationsError.title',
		'AnalyticsReservationsPage.errorTitle'
	],
	[
		'AnalyticsReservationsPage.UserAnalyticsReservationsError.headerDescription',
		'AnalyticsReservationsPage.errorHeaderDescription'
	],
	['AnalyticsReservationsPage.UserAnalyticsReservationsError.body', 'AnalyticsReservationsPage.errorBody'],
	['AnalyticsOverviewPage.UserAnalyticsOverviewError.title', 'AnalyticsOverviewPage.errorTitle'],
	[
		'AnalyticsOverviewPage.UserAnalyticsOverviewError.headerDescription',
		'AnalyticsOverviewPage.errorHeaderDescription'
	],
	['AnalyticsOverviewPage.UserAnalyticsOverviewError.body', 'AnalyticsOverviewPage.errorBody'],
	['MyAccommodationsPage.MyAccommodationsError.title', 'MyAccommodationsPage.errorTitle'],
	['MyAccommodationsPage.MyAccommodationsError.description', 'MyAccommodationsPage.errorDescription'],
	['MyHospitalitiesPage.MyHospitalitiesError.title', 'MyHospitalitiesPage.errorTitle'],
	['MyHospitalitiesPage.MyHospitalitiesError.description', 'MyHospitalitiesPage.errorDescription'],
	['ReservationsPage.ReservationsTabsError.title', 'ReservationsPage.errorTitle'],
	['ReservationsPage.ReservationsTabsError.description', 'ReservationsPage.errorDescription'],
	['AdminDashboardPage.AdminDashboardError.title', 'AdminDashboardPage.errorTitle'],
	['AdminDashboardPage.AdminDashboardError.description', 'AdminDashboardPage.errorDescription'],
	['AdminAnalyticsPage.AdminAnalyticsError.title', 'AdminAnalyticsPage.errorTitle'],
	['AdminAnalyticsPage.AdminAnalyticsError.headerDescription', 'AdminAnalyticsPage.errorHeaderDescription'],
	['AdminAnalyticsPage.AdminAnalyticsError.body', 'AdminAnalyticsPage.errorBody'],
	['AdminAnalyticsPage.AdminAnalyticsError.bodyDescription', 'AdminAnalyticsPage.errorBodyDescription'],
	['AdminUserPage.UserPageError.title', 'AdminUserPage.errorTitle'],
	['AdminUserPage.UserPageError.description', 'AdminUserPage.errorDescription'],
	['AdminUserPage.UserPageError.retry', 'AdminUserPage.errorRetryLabel'],
	['EditAccommodationPage.EditAccommodationError.title', 'EditAccommodationPage.errorTitle'],
	['EditAccommodationPage.EditAccommodationError.description', 'EditAccommodationPage.errorDescription'],
	['EditHospitalityPage.EditHospitalityError.title', 'EditHospitalityPage.errorTitle'],
	['EditHospitalityPage.EditHospitalityError.description', 'EditHospitalityPage.errorDescription'],
	['DashboardPage.DashboardStatsError.title', 'DashboardPage.DashboardStats.errorTitle'],
	['DashboardPage.DashboardStatsError.description', 'DashboardPage.DashboardStats.errorDescription'],
	['AdminPartnershipAddPage.selectAccommodation', 'AdminPartnershipAddPage.PartnershipsSelectAccommodationDialog.selectAccommodation'],
	['AdminPartnershipAddPage.modifyAccommodation', 'AdminPartnershipAddPage.PartnershipsSelectAccommodationDialog.modifyAccommodation'],
	[
		'AdminPartnershipAddPage.selectAccommodationDialogTitle',
		'AdminPartnershipAddPage.PartnershipsSelectAccommodationDialog.selectAccommodationDialogTitle'
	],
	[
		'AdminPartnershipAddPage.selectAccommodationLoading',
		'AdminPartnershipAddPage.PartnershipsSelectAccommodationDialog.selectAccommodationLoading'
	],
	[
		'AdminPartnershipAddPage.selectAccommodationTruncated',
		'AdminPartnershipAddPage.PartnershipsSelectAccommodationDialog.selectAccommodationTruncated'
	],
	['AdminPartnershipAddPage.selectHospitality', 'AdminPartnershipAddPage.PartnershipsSelectHospitalityDialog.selectHospitality'],
	['AdminPartnershipAddPage.modifyHospitality', 'AdminPartnershipAddPage.PartnershipsSelectHospitalityDialog.modifyHospitality'],
	[
		'AdminPartnershipAddPage.selectHospitalityDialogTitle',
		'AdminPartnershipAddPage.PartnershipsSelectHospitalityDialog.selectHospitalityDialogTitle'
	],
	['AdminPartnershipAddPage.selectHospitalityDone', 'AdminPartnershipAddPage.PartnershipsSelectHospitalityDialog.selectHospitalityDone'],
	[
		'AdminPartnershipAddPage.selectHospitalitySelectedCount',
		'AdminPartnershipAddPage.PartnershipsSelectHospitalityDialog.selectHospitalitySelectedCount'
	],
	[
		'AdminPartnershipAddPage.selectHospitalityLoading',
		'AdminPartnershipAddPage.PartnershipsSelectHospitalityDialog.selectHospitalityLoading'
	],
	[
		'AdminPartnershipAddPage.selectHospitalityTruncated',
		'AdminPartnershipAddPage.PartnershipsSelectHospitalityDialog.selectHospitalityTruncated'
	]
];

// Edit form flat keys → EditAccommodationForm / EditHospitalityForm
const EDIT_ACCOMMODATION_FORM_KEYS = [
	'sectionBasicsTitle',
	'sectionBasicsDescription',
	'sectionLocationTitle',
	'sectionLocationDescription',
	'sectionCoverTitle',
	'sectionCoverDescription',
	'currentCoverAlt',
	'sectionDetailsTitle',
	'sectionDetailsDescription',
	'fieldName',
	'fieldNamePlaceholder',
	'fieldType',
	'fieldTypePlaceholder',
	'fieldAddress',
	'fieldAddressPlaceholder',
	'fieldAddressNumber',
	'fieldAddressNumberPlaceholder',
	'fieldCity',
	'fieldCityPlaceholder',
	'fieldCountry',
	'fieldCountryPlaceholder',
	'fieldLatitude',
	'fieldLongitude',
	'fieldCoordinatesPlaceholder',
	'fieldDescription',
	'fieldDescriptionPlaceholder',
	'fieldIsActive',
	'fieldIsActiveDescription',
	'fieldCoverImage',
	'submit'
];

for (const key of EDIT_ACCOMMODATION_FORM_KEYS) {
	PREFIX_REPLACEMENTS.push([
		`EditAccommodationPage.${key}`,
		`EditAccommodationPage.EditAccommodationForm.${key}`
	]);
}

PREFIX_REPLACEMENTS.push(
	['EditAccommodationPage.sectionGuestAccessTitle', 'EditAccommodationPage.EditAccommodationGuestAccess.sectionGuestAccessTitle'],
	[
		'EditAccommodationPage.sectionGuestAccessDescription',
		'EditAccommodationPage.EditAccommodationGuestAccess.sectionGuestAccessDescription'
	],
	['EditAccommodationPage.showQr', 'EditAccommodationPage.EditAccommodationGuestAccess.showQr']
);

const EDIT_HOSPITALITY_FORM_EXTRA = [
	'sectionContactTitle',
	'sectionContactDescription',
	'sectionMenuTitle',
	'sectionMenuDescription',
	'fieldMenuFile',
	'fieldMenuFileHint',
	'fieldMenuLink',
	'fieldMenuLinkPlaceholder',
	'currentMenu',
	'currentMenuView',
	'fieldContactPhone',
	'fieldContactPhonePlaceholder',
	'fieldReservationMode'
];

for (const key of [...EDIT_ACCOMMODATION_FORM_KEYS.filter((k) => k !== 'fieldCoverImage'), ...EDIT_HOSPITALITY_FORM_EXTRA, 'fieldCoverImage', 'submit']) {
	if (key === 'fieldCoverImage') {
		PREFIX_REPLACEMENTS.push([
			`EditHospitalityPage.fieldCoverImage`,
			`EditHospitalityPage.EditHospitalityForm.fieldCoverImage`
		]);
		continue;
	}
	if (EDIT_ACCOMMODATION_FORM_KEYS.includes(key) || EDIT_HOSPITALITY_FORM_EXTRA.includes(key)) {
		PREFIX_REPLACEMENTS.push([`EditHospitalityPage.${key}`, `EditHospitalityPage.EditHospitalityForm.${key}`]);
	}
}

// Fix detail page error key replacements - use explicit mapping instead of broken prefix
PREFIX_REPLACEMENTS.push(
	[
		'AnalyticsAccommodationsPage.UserAnalyticsAccommodationsError.title',
		'AnalyticsAccommodationDetailPage.errorTitle'
	],
	[
		'AnalyticsAccommodationsPage.UserAnalyticsAccommodationsError.headerDescription',
		'AnalyticsAccommodationDetailPage.errorHeaderDescription'
	],
	['AnalyticsAccommodationsPage.UserAnalyticsAccommodationsError.body', 'AnalyticsAccommodationDetailPage.errorBody'],
	[
		'AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesError.title',
		'AnalyticsHospitalityDetailPage.errorTitle'
	],
	[
		'AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesError.headerDescription',
		'AnalyticsHospitalityDetailPage.errorHeaderDescription'
	],
	['AnalyticsHospitalitiesPage.UserAnalyticsHospitalitiesError.body', 'AnalyticsHospitalityDetailPage.errorBody']
);

function replaceInSource(content: string): string {
	// Sort longest first to avoid partial replacements
	const sorted = [...PREFIX_REPLACEMENTS].sort((a, b) => b[0].length - a[0].length);
	let out = content;
	for (const [from, to] of sorted) {
		out = out.split(from).join(to);
	}
	return out;
}

function walkAndReplace(dir: string): void {
	const skip = new Set(['node_modules', '.svelte-kit', 'dist', 'build', 'paraglide']);
	for (const entry of readdirSync(dir)) {
		if (skip.has(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			walkAndReplace(full);
			continue;
		}
		if (!/\.(ts|svelte|js)$/.test(full)) continue;
		const original = readFileSync(full, 'utf8');
		const updated = replaceInSource(original);
		if (updated !== original) writeFileSync(full, updated, 'utf8');
	}
}

for (const file of ['messages/en.json', 'messages/sr.json']) {
	const messages = JSON.parse(readFileSync(file, 'utf8')) as JsonObject;
	restructureMessages(messages);
	writeFileSync(file, `${JSON.stringify(messages, null, '\t')}\n`, 'utf8');
}

walkAndReplace('src');

console.log('i18n key restructure complete');
