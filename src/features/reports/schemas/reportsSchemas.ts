// LIBRARIES
import * as v from 'valibot';
import { m } from '@/shared/lib/paraglide/messages';

export const REPORT_CATEGORIES = ['bug', 'idea', 'other'] as const;
export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

const MAX_MESSAGE_LENGTH = 5000;

/**
 * Client-side validation for the public `/report` form. Mirrors the server-side
 * gate in `createReport` (required bounded message, optional email); the
 * category is constrained by the picker UI but the schema is the authoritative gate.
 */
export const createReportSchema = v.object({
	category: v.picklist(REPORT_CATEGORIES),
	message: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, m['ValidationMessages.CreateReportSchema.messageRequired']()),
		v.maxLength(
			MAX_MESSAGE_LENGTH,
			m['ValidationMessages.CreateReportSchema.messageMax']({ max: MAX_MESSAGE_LENGTH })
		)
	),
	email: v.union([
		v.literal(''),
		v.pipe(v.string(), v.trim(), v.email(m['ValidationMessages.CreateReportSchema.emailInvalid']()))
	])
});

export type CreateReportInput = v.InferInput<typeof createReportSchema>;
