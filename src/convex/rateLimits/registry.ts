// LIBRARIES
import { MINUTE } from '@convex-dev/rate-limiter';

/**
 * Reusable token-bucket shapes. Pick a preset when registering a function, or
 * define custom values inline in {@link convexRateLimitRegistry}.
 */
export const limitPresets = {
	interactiveWrite: {
		kind: 'token bucket' as const,
		rate: 120,
		period: MINUTE,
		capacity: 60
	},
	externalAction: {
		kind: 'token bucket' as const,
		rate: 60,
		period: MINUTE,
		capacity: 20
	},
	bulkDelete: {
		kind: 'token bucket' as const,
		rate: 200,
		period: MINUTE,
		capacity: 100
	},
	fileUpload: {
		kind: 'token bucket' as const,
		rate: 30,
		period: MINUTE,
		capacity: 10
	},
	searchQuery: {
		kind: 'token bucket' as const,
		rate: 60,
		period: MINUTE,
		capacity: 30
	},
	connectCodeLookup: {
		kind: 'token bucket' as const,
		rate: 30,
		period: MINUTE,
		capacity: 15
	},
	guestStayActivate: {
		kind: 'token bucket' as const,
		rate: 60,
		period: MINUTE,
		capacity: 20
	},
	guestStayShareJoin: {
		kind: 'token bucket' as const,
		rate: 5,
		period: MINUTE,
		capacity: 5
	},
	// Guest JWT mint: keyed per IP, but many guests share one NAT IP (hotel WiFi)
	// and every tab-focus/bfcache restore after the 5-min JWT TTL re-hits it.
	// Generous so legitimate shared-IP traffic never locks guests out of the stay
	// page, while still bounding a hostile IP to ~5 req/s sustained.
	guestTokenMint: {
		kind: 'token bucket' as const,
		rate: 300,
		period: MINUTE,
		capacity: 100
	},
	guestReservationCreate: {
		kind: 'token bucket' as const,
		rate: 5,
		period: MINUTE,
		capacity: 5
	},
	authSignIn: {
		kind: 'token bucket' as const,
		rate: 5,
		period: MINUTE,
		capacity: 5
	},
	authSignUp: {
		kind: 'token bucket' as const,
		rate: 3,
		period: MINUTE,
		capacity: 3
	},
	authOtpSend: {
		kind: 'token bucket' as const,
		rate: 2,
		period: MINUTE,
		capacity: 2
	},
	authOtpVerify: {
		kind: 'token bucket' as const,
		rate: 5,
		period: MINUTE,
		capacity: 5
	},
	authPasswordResetRequest: {
		kind: 'token bucket' as const,
		rate: 3,
		period: MINUTE,
		capacity: 3
	},
	authPasswordReset: {
		kind: 'token bucket' as const,
		rate: 5,
		period: MINUTE,
		capacity: 5
	},
	authOAuth: {
		kind: 'token bucket' as const,
		rate: 10,
		period: MINUTE,
		capacity: 10
	}
} as const;

/** Per-function and trusted server-route rate limits. */
export const convexRateLimitRegistry = {
	// Guest QR activation (public mutation, IP-keyed at call site)
	createGuest: limitPresets.guestStayActivate,
	joinGuestBySharingCode: limitPresets.guestStayShareJoin,

	// Guest stay-page endpoints reachable with only a stay cookie
	viewHospitality: limitPresets.interactiveWrite,
	createGuestSharingCode: limitPresets.connectCodeLookup,

	// Public report form (anonymous callers share one bucket, signed-in users get their own)
	createReport: limitPresets.connectCodeLookup,
	// Guest JWT mint (trusted-server action, IP-keyed; NAT-friendly preset)
	guestTokenMint: limitPresets.guestTokenMint,

	// Reservation flow (createReservation is guest-session-keyed; sends emails, keep tight)
	createReservation: limitPresets.guestReservationCreate,
	confirmReservation: limitPresets.interactiveWrite,
	cancelReservation: limitPresets.interactiveWrite,
	markReservationNoShow: limitPresets.interactiveWrite,

	// Domain accommodation writes
	adminCreateAccommodation: limitPresets.interactiveWrite,
	createMyAccommodation: limitPresets.interactiveWrite,
	deleteMyAccommodation: limitPresets.interactiveWrite,
	updateAccommodation: limitPresets.interactiveWrite,
	createHospitality: limitPresets.interactiveWrite,
	deleteMyHospitality: limitPresets.interactiveWrite,
	updateHospitality: limitPresets.interactiveWrite,
	createPartnership: limitPresets.interactiveWrite,

	// Custom partnerships (self-service)
	createCustomPartnership: limitPresets.interactiveWrite,
	createUserHospitality: limitPresets.interactiveWrite,
	startProTrial: limitPresets.interactiveWrite,
	acceptPartnershipRequest: limitPresets.interactiveWrite,
	declinePartnershipRequest: limitPresets.interactiveWrite,
	updatePartnershipBenefit: limitPresets.interactiveWrite,
	revokePartnership: limitPresets.interactiveWrite,
	setHospitalityCreateType: limitPresets.interactiveWrite,

	// Admin user management
	createUser: limitPresets.interactiveWrite,
	setUserRole: limitPresets.interactiveWrite,
	setUserPlan: limitPresets.interactiveWrite,
	banUser: limitPresets.interactiveWrite,
	unbanUser: limitPresets.interactiveWrite,
	revokeSession: limitPresets.interactiveWrite,
	revokeAllSessions: limitPresets.interactiveWrite,
	deleteUser: limitPresets.bulkDelete,

	// R2 uploads
	generateUploadUrl: limitPresets.fileUpload,

	// Bulk deletes
	deleteAccommodations: limitPresets.bulkDelete,
	deleteHospitalities: limitPresets.bulkDelete,
	deletePartnerships: limitPresets.bulkDelete,
	deleteUploadedFileR2: limitPresets.bulkDelete,

	// Admin list queries (advisory check when name passed to fetchOptimized)
	fetchAllAccommodations: limitPresets.searchQuery,
	fetchAllHospitalities: limitPresets.searchQuery,
	fetchAllPartnershipsAdmin: limitPresets.searchQuery,
	fetchReports: limitPresets.searchQuery,
	fetchUploadedFilesR2: limitPresets.searchQuery,
	publicSearchInput: limitPresets.searchQuery,
	lookupCustomPartnershipFormVenueByConnectCode: limitPresets.connectCodeLookup,
	searchAllAccommodations: limitPresets.searchQuery,
	searchAllHospitalities: limitPresets.searchQuery,
	searchMyAccommodations: limitPresets.searchQuery,
	searchMyHospitalities: limitPresets.searchQuery,

	// Better Auth HTTP routes (enforced in hooks.before — see auth/authRoutes.ts)
	signInEmail: limitPresets.authSignIn,
	signUpEmail: limitPresets.authSignUp,
	sendVerificationOtp: limitPresets.authOtpSend,
	sendVerificationOtpByEmail: limitPresets.authOtpSend,
	verifyEmailOtp: limitPresets.authOtpVerify,
	verifyEmailOtpByEmail: limitPresets.authOtpVerify,
	requestPasswordReset: limitPresets.authPasswordResetRequest,
	requestPasswordResetByEmail: limitPresets.authPasswordResetRequest,
	resetPassword: limitPresets.authPasswordReset,
	resetPasswordByEmail: limitPresets.authPasswordReset,
	signInSocial: limitPresets.authOAuth
} as const;

export type ConvexRateLimitName = keyof typeof convexRateLimitRegistry;
