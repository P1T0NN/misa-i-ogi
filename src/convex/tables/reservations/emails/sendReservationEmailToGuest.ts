// TEMPLATES
import { renderBaseEmailTemplate } from '@/convex/email/templates/baseEmailTemplate';

// UTILS
import { resend } from '@/convex/resend';
import { renderDetailsTable, senderAddress } from '@/convex/email/utils/convexEmailUtils';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';

type GuestReservationEmailDetails = {
	guestEmail: string;
	hospitalityName: string;
	guestName: string;
	phone: string;
	requestedTime: string;
};

export async function sendReservationEmailToGuest(
	ctx: MutationCtx,
	details: GuestReservationEmailDetails
) {
	const subject = `Reservation request sent to ${details.hospitalityName}`;
	const html = renderBaseEmailTemplate({
		eyebrow: 'Reservation pending',
		title: `We sent your request to ${details.hospitalityName}`,
		description:
			'Your reservation is not confirmed yet. The hospitality owner will contact you to confirm the final details.',
		children: renderDetailsTable([
			{ label: 'Preferred time', value: details.requestedTime },
			{ label: 'Guest name', value: details.guestName },
			{ label: 'Phone', value: details.phone },
			{ label: 'Email', value: details.guestEmail }
		])
	});

	const text = [
		`We sent your reservation request to ${details.hospitalityName}.`,
		'',
		'Your reservation is not confirmed yet. The hospitality owner will contact you to confirm the final details.',
		'',
		`Preferred time: ${details.requestedTime}`,
		`Guest name: ${details.guestName}`,
		`Phone: ${details.phone}`,
		`Email: ${details.guestEmail}`
	].join('\n');

	await resend.sendEmail(ctx, {
		from: senderAddress(),
		to: details.guestEmail,
		subject,
		html,
		text
	});
}
