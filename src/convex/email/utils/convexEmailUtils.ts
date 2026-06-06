// CONFIG
import { CONVEX_PROJECT_SETTINGS } from '@/convex/projectSettings';

export function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

export function renderDetailRow(label: string, value: string): string {
	return `
		<tr>
			<td style="padding: 8px 12px 8px 0; color: #5e5d59; font-size: 13px; vertical-align: top; white-space: nowrap;">${escapeHtml(label)}</td>
			<td style="padding: 8px 0; color: #141413; font-size: 14px; font-weight: 600; vertical-align: top;">${escapeHtml(value)}</td>
		</tr>
	`;
}

export function renderDetailsTable(
	rows: Array<{ label: string; value: string | null | undefined }>
) {
	const renderedRows = rows
		.filter((row): row is { label: string; value: string } => Boolean(row.value))
		.map((row) => renderDetailRow(row.label, row.value))
		.join('');

	return `<table style="border-collapse: collapse; width: 100%;">${renderedRows}</table>`;
}

export function senderAddress(): string {
	return `${CONVEX_PROJECT_SETTINGS.NAME} <${CONVEX_PROJECT_SETTINGS.RESEND_EMAIL}>`;
}
