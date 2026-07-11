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
	guestCount: number;
	phone: string;
	requestedTime: string;
};

export async function sendCancelledReservationEmailToGuest(
	ctx: MutationCtx,
	details: GuestReservationEmailDetails
) {
	const subject = `Reservation cancelled at ${details.hospitalityName}`;
	const html = renderBaseEmailTemplate({
		eyebrow: 'Reservation cancelled',
		title: `${details.hospitalityName} cancelled your reservation`,
		description:
			'Unfortunately your reservation could not be confirmed. Please reach out to the hospitality owner if you have any questions.',
		children: renderDetailsTable([
			{ label: 'Preferred time', value: details.requestedTime },
			{ label: 'Guest name', value: details.guestName },
			{ label: 'Number of guests', value: String(details.guestCount) },
			{ label: 'Phone', value: details.phone },
			{ label: 'Email', value: details.guestEmail }
		])
	});

	const text = [
		`${details.hospitalityName} cancelled your reservation.`,
		'',
		'Unfortunately your reservation could not be confirmed. Please reach out to the hospitality owner if you have any questions.',
		'',
		`Preferred time: ${details.requestedTime}`,
		`Guest name: ${details.guestName}`,
		`Number of guests: ${details.guestCount}`,
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
