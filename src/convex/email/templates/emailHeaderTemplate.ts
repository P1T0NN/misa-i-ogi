// CONFIG
import { COMPANY_DATA } from '@/shared/constants.js';

// UTILS
import { escapeHtml } from '@/convex/email/utils/convexEmailUtils';

export function renderEmailHeaderTemplate() {
	return `
		<div style="padding: 0 0 20px;">
			<div style="color: #141413; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 500; line-height: 1.2;">
				${escapeHtml(COMPANY_DATA.NAME)}
			</div>
		</div>
	`;
}
