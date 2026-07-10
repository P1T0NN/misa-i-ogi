// SVELTEKIT IMPORTS
import { resolve } from '$app/paths';

export const ADMIN_PAGE_ENDPOINTS = {
	DASHBOARD: resolve('/admin/dashboard'),
	ANALYTICS: resolve('/admin/analytics'),
	ACCOMMODATIONS: resolve('/admin/accommodations'),
	ACCOMMODATION_ADD: resolve('/admin/accommodations/add-accommodation'),
	HOSPITALITIES: resolve('/admin/hospitalities'),
	HOSPITALITY_ADD: resolve('/admin/hospitalities/add-hospitality'),
	PARTNERSHIPS: resolve('/admin/partnerships'),
	PARTNERSHIP_ADD: resolve('/admin/partnerships/add-partnership'),
	USERS: resolve('/admin/users'),
	USER_ADD: resolve('/admin/users/add-user'),
	// Templates filled at the call site via .replace(':id', …) — not concrete routes, so not resolve()d.
	USER: '/admin/users/:id',
	EDIT_ACCOMMODATION: '/admin/edit-accommodation/:id',
	EDIT_HOSPITALITY: '/admin/edit-hospitality/:id'
};

export const PROTECTED_PAGE_ENDPOINTS = {
	DASHBOARD: resolve('/dashboard'),
	ANALYTICS: resolve('/analytics/overview'),
	ANALYTICS_ACCOMMODATIONS: resolve('/analytics/accommodations'),
	ANALYTICS_HOSPITALITIES: resolve('/analytics/hospitalities'),
	ANALYTICS_RESERVATIONS: resolve('/analytics/reservations'),
	MY_ACCOMMODATIONS: resolve('/my-accommodations'),
	MY_ACCOMMODATION_ADD: resolve('/add-accommodation'),
	MY_HOSPITALITIES: resolve('/my-hospitalities'),
	MY_HOSPITALITY_ADD: resolve('/add-hospitality'),
	RESERVATIONS: resolve('/reservations'),
	PARTNERSHIPS: resolve('/partnerships'),
	CREATE_CUSTOM_PARTNERSHIP: resolve('/create-custom-partnership'),
	// Templates filled at the call site via .replace(':id', …) — not concrete routes, so not resolve()d.
	EDIT_ACCOMMODATION: '/edit-accommodation/:id',
	EDIT_HOSPITALITY: '/edit-hospitality/:id'
} as const;

export const UNPROTECTED_PAGE_ENDPOINTS = {
	ROOT: '/',
	LOGIN: resolve('/login'),
	TERMS_OF_SERVICE: resolve('/terms'),
	SIGNUP: resolve('/signup'),
	FORGOT_PASSWORD: resolve('/forgot-password'),
	/** Public feedback / bug-report form. */
	REPORT: resolve('/report'),
	/** Anchor to the contact section on the landing — not a route, so it must NOT be wrapped in resolve(). */
	CONTACT: '/#contact',
	/** Sets the guest-stay cookie then redirects to {@link STAY}. Encoded in printed QRs. */
	ACTIVATE: '/activate/:token',
	/** Guest perks page — bookmarkable; no token in URL. Perks gated by guest-stay cookie. */
	STAY: resolve('/stay'),
	/** Guest-stay venue detail. Requires active guest access, admin, or hospitality owner. */
	HOSPITALITY: '/stay/hospitality/:id'
} as const;
