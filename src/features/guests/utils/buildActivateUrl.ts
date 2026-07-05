// CONFIG
import { UNPROTECTED_PAGE_ENDPOINTS } from '@/shared/page-endpoints';

/** Absolute guest QR URL — encodes `/activate/:token` on the public app origin. */
export function buildActivateUrl(scanToken: string, origin: string): string {
	const base = origin.replace(/\/$/, '');
	const path = UNPROTECTED_PAGE_ENDPOINTS.ACTIVATE.replace(':token', scanToken);
	return `${base}${path}`;
}
