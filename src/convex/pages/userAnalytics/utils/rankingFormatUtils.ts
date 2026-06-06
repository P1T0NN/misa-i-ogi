export function formatCount(value: number) {
	return value.toLocaleString('en-US');
}

export function computeConversionRate(requests: number, confirmed: number) {
	if (requests === 0) return '0%';
	return `${Math.round((confirmed / requests) * 100)}%`;
}
