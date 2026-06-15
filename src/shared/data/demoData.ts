import { COMPANY_DATA } from '@/shared/constants';

export const DEMO_TOTAL_STEPS = 6 as const;

export type DemoVenueKey =
	| 'skadarlija'
	| 'cetinjska'
	| 'kalemegdan'
	| 'savamala'
	| 'bakery'
	| 'hammam';

export type DemoVenueFilter = 'all' | 'food' | 'drink' | 'exp' | 'night';

export type DemoVenue = {
	readonly filter: Exclude<DemoVenueFilter, 'all'>;
	readonly catCrumb: string;
	readonly catLine: string;
	readonly name: string;
	readonly loc: string;
	/** Safe HTML for detail discount line */
	readonly pctHtml: string;
	readonly desc: string;
	readonly vouchPctHtml: string;
	readonly vouchDesc: string;
	readonly vouchCat: string;
	readonly code: string;
	/** Safe HTML for list row discount */
	readonly listDiscHtml: string;
	readonly listMeta: string;
};

export const DEMO_VENUE_ORDER: readonly DemoVenueKey[] = [
	'skadarlija',
	'cetinjska',
	'kalemegdan',
	'savamala',
	'bakery',
	'hammam'
] as const;

export const DEMO_VENUES: Record<DemoVenueKey, DemoVenue> = {
	skadarlija: {
		filter: 'food',
		catCrumb: 'Eat · Skadarlija',
		catLine: 'CLASSIC SERBIAN · DINNER',
		name: 'Skadarlija restaurant',
		loc: 'Cobblestone bohemian quarter · 4 min walk',
		pctHtml: '15<small class="text-sm opacity-70">%</small>',
		desc: "A tavern on Belgrade's oldest restaurant street, serving the kind of long evening dinner that ends with a tamburaš band at the next table. Reservations help; the perk does not require one.",
		vouchPctHtml: '15<small class="text-lg opacity-70">% off</small>',
		vouchDesc: 'Show this screen to your server before ordering.',
		vouchCat: 'Eat · Dinner',
		code: 'KONAK-DOR14-S2K9',
		listDiscHtml: '15<span class="text-xs">%</span>',
		listMeta: '4 MIN · CLASSIC SERBIAN'
	},
	cetinjska: {
		filter: 'drink',
		catCrumb: 'Drink · Cetinjska',
		catLine: 'THIRD WAVE · COFFEE',
		name: 'Cetinjska coffee bar',
		loc: 'Former brewery yard · 6 min walk',
		pctHtml: 'Gift',
		desc: 'A small roastery inside the old brewery courtyard. Order any coffee with the perk and the kitchen sends a pastry to the table.',
		vouchPctHtml: 'Free <small class="text-lg opacity-70">pastry</small>',
		vouchDesc: 'Show this screen at the bar before ordering coffee.',
		vouchCat: 'Drink · Coffee',
		code: 'KONAK-DOR14-C7P1',
		listDiscHtml: 'Gift',
		listMeta: '6 MIN · THIRD WAVE'
	},
	kalemegdan: {
		filter: 'exp',
		catCrumb: 'Experience · Kalemegdan',
		catLine: 'WALKING TOUR · 2 HR',
		name: 'Kalemegdan walking tour',
		loc: 'Meets at Pobednik · 10 min walk',
		pctHtml: '20<small class="text-sm opacity-70">%</small>',
		desc: 'A two-hour loop through the fortress and the river point, run by a small team of local guides. Daily at 10:00 and 16:00, no booking needed.',
		vouchPctHtml: '20<small class="text-lg opacity-70">% off</small>',
		vouchDesc: 'Show this screen at the meeting point under Pobednik.',
		vouchCat: 'Experience · Tour',
		code: 'KONAK-DOR14-K3R8',
		listDiscHtml: '20<span class="text-xs">%</span>',
		listMeta: '10 MIN · 2 HR LOOP'
	},
	savamala: {
		filter: 'drink',
		catCrumb: 'Drink · Savamala',
		catLine: 'NATURAL WINE · BAR',
		name: 'Wine bar, Savamala',
		loc: 'Riverside warehouse district · 12 min walk',
		pctHtml: '1st glass',
		desc: "A small natural-wine list focused on Balkan growers, in one of Savamala's converted river warehouses. Your first glass is on the house with the perk.",
		vouchPctHtml: 'Free <small class="text-lg opacity-70">glass</small>',
		vouchDesc: 'Show this screen at the bar before ordering.',
		vouchCat: 'Drink · Wine bar',
		code: 'KONAK-DOR14-W4V2',
		listDiscHtml: '<span class="text-sm">1st glass</span>',
		listMeta: '12 MIN · NATURAL WINE'
	},
	bakery: {
		filter: 'night',
		catCrumb: 'Late night · Strahinjića Bana',
		catLine: 'BAKERY · 22 → 06',
		name: 'Late-night bakery',
		loc: 'Three minutes from the apartment door',
		pctHtml: '10<small class="text-sm opacity-70">%</small>',
		desc: 'Burek, kifle, and warm bread until dawn. The kind of place locals stop on the walk home — three minutes from the apartment door.',
		vouchPctHtml: '10<small class="text-lg opacity-70">% off</small>',
		vouchDesc: 'Show this screen at the counter before paying.',
		vouchCat: 'Late night · Bakery',
		code: 'KONAK-DOR14-L9N3',
		listDiscHtml: '10<span class="text-xs">%</span>',
		listMeta: '3 MIN · 22–06'
	},
	hammam: {
		filter: 'exp',
		catCrumb: 'Experience · Vračar',
		catLine: 'HAMMAM · SPA',
		name: 'Hammam & spa, Vračar',
		loc: 'Quiet residential block · 14 min walk',
		pctHtml: '10<small class="text-sm opacity-70">%</small>',
		desc: 'A small Turkish-bath circuit with massage and steam room, in a quiet Vračar courtyard. By appointment — call ahead to book.',
		vouchPctHtml: '10<small class="text-lg opacity-70">% off</small>',
		vouchDesc: 'Show this screen at reception on arrival.',
		vouchCat: 'Experience · Spa',
		code: 'KONAK-DOR14-H5M7',
		listDiscHtml: '10<span class="text-xs">%</span>',
		listMeta: '14 MIN · APPOINTMENT'
	}
};

export type DemoNarrStep = {
	readonly title: string;
	readonly body: string;
	readonly keyTag: string;
	readonly key: string;
};

/** Keys 1..DEMO_TOTAL_STEPS */
export const DEMO_NARR: Record<number, DemoNarrStep> = {
	1: {
		title: `You've just walked into a ${COMPANY_DATA.NAME} apartment.`,
		body: 'A small framed card sits by the entryway. The phone screen shows what a guest sees the second they arrive — a friendly hello tied to this specific unit, and a single button to open the camera.',
		keyTag: 'NO APP',
		key: 'No download, no signup. The opening screen lives at a regular web link the card prints out.'
	},
	2: {
		title: 'Camera scans the QR card.',
		body: 'Hold up the phone. The native camera (iOS or Android) recognizes the code in a half-second and offers the perk page as a notification. Tap it.',
		keyTag: '0.5 SECONDS',
		key: 'On any phone built in the last five years. Older devices can fall back to any free QR reader.'
	},
	3: {
		title: 'The page is now personalized to this apartment.',
		body: 'The site knows it was opened from card DOR-014 — Solunska 22, Apt 3. The list it builds is shaped by that exact location, with hospitalities ranked by walking distance.',
		keyTag: 'PER APARTMENT',
		key: 'Each card has its own curated list. A Vračar accommodation shows different hospitalities than this Dorćol one — the neighborhood is the filter.'
	},
	4: {
		title: 'Browse, filter, decide.',
		body: 'Twenty-two hospitalities, sorted by walk time and grouped into categories — eat, drink, experience, late night. Tap a chip to filter the list to one mood.',
		keyTag: 'SEASONAL',
		key: 'Summer adds the river beaches and rooftop bars. Winter rotates in saunas and warm-up kafanas.'
	},
	5: {
		title: 'Open a hospitality to see the detail.',
		body: 'Hours, walking time, what the perk actually is, and a phone number you can tap to call. Most guests use this screen to decide whether to walk now or save for tomorrow.',
		keyTag: 'NO RESERVATION',
		key: 'The perk does not require a booking. Walk in, show the voucher, sit down.'
	},
	6: {
		title: 'Voucher screen — show to staff.',
		body: "When you tap 'Use my perk', the page becomes a small voucher card. Hand the phone over the bar or counter. The staff confirms with a single tap.",
		keyTag: 'REUSABLE',
		key: 'Perks are valid for the length of your accommodation. You can return tomorrow and the same voucher still works.'
	}
};

export const DEMO_STEP_THUMBS = [
	{ step: 1, title: 'Arrive', desc: 'Welcome screen for this specific apartment.' },
	{ step: 2, title: 'Scan', desc: 'Camera reads the QR card by the door.' },
	{ step: 3, title: 'Unlock', desc: 'Confirmation and a quick summary of what’s inside.' },
	{ step: 4, title: 'Browse', desc: 'Filtered list of nearby hospitalities and perks.' },
	{ step: 5, title: 'Detail', desc: 'Single hospitality, with hours and walking time.' },
	{ step: 6, title: 'Redeem', desc: 'Voucher screen for the staff to confirm.' }
] as const;

export const DEMO_LIST_FILTERS: readonly { id: DemoVenueFilter; label: string }[] = [
	{ id: 'all', label: 'All' },
	{ id: 'food', label: 'Eat' },
	{ id: 'drink', label: 'Drink' },
	{ id: 'exp', label: 'Experience' },
	{ id: 'night', label: 'Late night' }
] as const;

export function demoVenueMatchesFilter(venue: DemoVenue, filter: DemoVenueFilter): boolean {
	return filter === 'all' || venue.filter === filter;
}
