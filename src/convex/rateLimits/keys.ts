/** Centralized rate-limit bucket keys — keep naming consistent across call sites. */
export const rateLimitKey = {
	ip: (ip: string) => ip.trim() || 'unknown',
	anonymous: 'anonymous'
} as const;
