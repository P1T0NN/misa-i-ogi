export function guestIssuer(): string {
	const siteUrl = process.env.SITE_URL?.trim().replace(/\/+$/, '');
	if (!siteUrl) {
		throw new Error('SITE_URL is required for guest Convex auth');
	}
	return `${siteUrl}/api/guest-auth`;
}
