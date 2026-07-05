export const COMPANY_DATA = {
	NAME: 'Kurosava',
	EMAIL: 'kurosava@gmail.com',
	RESEND_EMAIL: 'onboarding@resend.dev', // default email for the Resend provider
	DOMAIN: 'kurosava.com',
	LOCATION: 'Belgrade, Serbia',
	LOGO: '/logo/opt/logo-no-text-orange-transparent-595w.webp',
	FAVICON: '/kurosava.ico',
	// Default social-share image (Open Graph / Twitter). Non-transparent PNG so it
	// renders on every platform. Path is site-relative; SvelteHead makes it absolute.
	OG_IMAGE: '/images/landing/hero-image.png',
	OG_IMAGE_WIDTH: 1672,
	OG_IMAGE_HEIGHT: 941,
	DESCRIPTION:
		'Kurosava is a platform for connecting accommodations with hospitality owners for enabling the guests to enjoy their stay even more with additional benefits.'
} as const;
