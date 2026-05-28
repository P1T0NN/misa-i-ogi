export const COMPANY_DATA = {
	NAME: 'Company Name',
	EMAIL: 'company@gmail.com',
	DOMAIN: 'company.com',
	LOGO: '/logo/logo.webp',
	DESCRIPTION:
		'We build dependable software and services so your team can focus on what matters most.'
} as const;

export const ADMIN_PAGE_ENDPOINTS = {
	DASHBOARD: '/admin/dashboard',
	ACCOMMODATIONS: '/admin/accommodations',
	ACCOMMODATION_ADD: '/admin/accommodations/add-accommodation',
	HOSPITALITIES: '/admin/hospitalities',
	HOSPITALITY_ADD: '/admin/hospitalities/add-hospitality',
	PARTNERSHIPS: '/admin/partnerships',
	PARTNERSHIP_ADD: '/admin/partnerships/add-partnership',
	USERS: '/admin/users',
	USER_ADD: '/admin/users/add-user',
	USER: '/admin/users/:id'
};

export const PROTECTED_PAGE_ENDPOINTS = {
	DASHBOARD: '/dashboard',
	MY_ACCOMMODATIONS: '/my-accommodations',
	MY_HOSPITALITIES: '/my-hospitalities',
	RESERVATIONS: '/reservations',
	EDIT_ACCOMMODATION: '/edit-accommodation/:id',
	EDIT_HOSPITALITY: '/edit-hospitality/:id'
} as const;

export const UNPROTECTED_PAGE_ENDPOINTS = {
	ROOT: '/',
	LOGIN: '/login',
	TERMS_OF_SERVICE: '/terms',
	SIGNUP: '/signup',
	FORGOT_PASSWORD: '/forgot-password',
	CONTACT: '/contact',
	/** Sets the guest-stay cookie then redirects to {@link STAY}. Encoded in printed QRs. */
	ACTIVATE: '/activate/:token',
	/** Guest perks page — bookmarkable; no token in URL. Perks gated by guest-stay cookie. */
	STAY: '/stay',
	/** Guest-stay venue detail. Requires active guest access, admin, or hospitality owner. */
	HOSPITALITY: '/stay/hospitality/:id'
} as const;
