// CONFIG
import { COMPANY_DATA } from '@/shared/constants.js';

// UTILS
import { escapeHtml } from '@/convex/email/utils/convexEmailUtils';

export function renderEmailFooterTemplate() {
	return `
		<div style="border-top: 1px solid #f0eee6; color: #87867f; font-size: 12px; line-height: 1.6; margin-top: 24px; padding-top: 16px;">
			<p style="margin: 0 0 4px;">Sent by ${escapeHtml(COMPANY_DATA.NAME)}</p>
			<p style="margin: 0;">If you need help, contact ${escapeHtml(COMPANY_DATA.EMAIL)}.</p>
		</div>
	`;
}
