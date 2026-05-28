type TrimmedStringOptions = {
	minLength?: number;
	maxLength?: number;
};

type OptionalNumberOptions = {
	min?: number;
	max?: number;
	integer?: boolean;
};

export const DEFAULT_EMAIL_MAX_LENGTH = 254;
export const BASIC_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const TIME_24H_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function trimString(value: unknown): string | null {
	if (typeof value !== 'string') return null;
	return value.trim();
}

export function normalizeRequiredString(
	value: unknown,
	options: TrimmedStringOptions = {}
): string | null {
	const trimmed = trimString(value);
	if (trimmed === null) return null;

	const minLength = options.minLength ?? 1;
	if (trimmed.length < minLength) return null;
	if (options.maxLength !== undefined && trimmed.length > options.maxLength) return null;

	return trimmed;
}

export function normalizeOptionalString(
	value: unknown,
	options: TrimmedStringOptions = {}
): string | null {
	if (value === undefined || value === null) return '';

	const trimmed = trimString(value);
	if (trimmed === null) return null;
	if (trimmed.length === 0) return '';
	if (options.minLength !== undefined && trimmed.length < options.minLength) return null;
	if (options.maxLength !== undefined && trimmed.length > options.maxLength) return null;

	return trimmed;
}

export function normalizeOptionalEmail(
	value: unknown,
	options: { maxLength?: number } = {}
): string | null {
	const email = normalizeOptionalString(value, {
		maxLength: options.maxLength ?? DEFAULT_EMAIL_MAX_LENGTH
	});

	if (email === null) return null;
	if (email === '') return '';
	if (!BASIC_EMAIL_PATTERN.test(email)) return null;

	return email;
}

export function normalizeRequiredTime24h(value: unknown): string | null {
	const time = normalizeRequiredString(value);
	if (!time) return null;
	return TIME_24H_PATTERN.test(time) ? time : null;
}

export function normalizeOptionalNumber(
	value: unknown,
	options: OptionalNumberOptions = {}
): number | undefined | null {
	if (value === undefined || value === null) return undefined;

	const raw = typeof value === 'string' ? value.trim() : value;
	if (raw === '') return undefined;

	const numberValue = typeof raw === 'number' ? raw : Number(raw);
	if (!Number.isFinite(numberValue)) return null;
	if (options.integer && !Number.isInteger(numberValue)) return null;
	if (options.min !== undefined && numberValue < options.min) return null;
	if (options.max !== undefined && numberValue > options.max) return null;

	return numberValue;
}
