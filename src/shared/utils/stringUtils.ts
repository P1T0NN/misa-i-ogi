/** First-letter uppercased for display. Returns the input unchanged when empty. */
export function capitalize(s: string): string {
	return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

/** First letters of up to two whitespace-separated words, uppercased. */
export function initialsFromName(name: string, fallback = 'A'): string {
	return (
		name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('') || fallback
	);
}
