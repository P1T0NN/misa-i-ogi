/** Centralized rate-limit bucket keys — keep naming consistent across call sites. */
export const rateLimitKey = {
	ip: (ip: string) => ip.trim() || 'unknown',
	guest: (guestId: string) => `guest:${guestId}`,
	anonymous: 'anonymous'
} as const;
