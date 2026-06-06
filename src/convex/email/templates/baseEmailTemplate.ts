// TEMPLATES
import { renderEmailFooterTemplate } from './emailFooterTemplate';
import { renderEmailHeaderTemplate } from './emailHeaderTemplate';

// UTILS
import { escapeHtml } from '@/convex/email/utils/convexEmailUtils';

type BaseEmailTemplateInput = {
	eyebrow: string;
	title: string;
	description: string;
	children: string;
};

export function renderBaseEmailTemplate({
	eyebrow,
	title,
	description,
	children
}: BaseEmailTemplateInput) {
	return `
		<div style="background: #f5f4ed; color: #141413; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; line-height: 1.6; padding: 24px;">
			<div style="background: #faf9f5; border: 1px solid #f0eee6; border-radius: 16px; margin: 0 auto; max-width: 560px; padding: 24px;">
				${renderEmailHeaderTemplate()}
				<p style="color: #c96442; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; letter-spacing: 0.12em; margin: 0 0 12px; text-transform: uppercase;">${escapeHtml(eyebrow)}</p>
				<h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 500; line-height: 1.2; margin: 0 0 12px;">${escapeHtml(title)}</h1>
				<p style="color: #5e5d59; font-size: 15px; margin: 0 0 20px;">${escapeHtml(description)}</p>
				${children}
				${renderEmailFooterTemplate()}
			</div>
		</div>
	`;
}
