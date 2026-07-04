function formatTrialDate(date: Date) {
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/** One-shot labels for “today → one month from now” trial copy. */
export function formatTrialWindowLabels(referenceTime = Date.now()) {
	const start = new Date(referenceTime);
	const end = new Date(referenceTime);
	end.setMonth(end.getMonth() + 1);

	return {
		startDate: formatTrialDate(start),
		endDate: formatTrialDate(end)
	};
}
