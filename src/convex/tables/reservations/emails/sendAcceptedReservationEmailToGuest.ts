// TEMPLATES
import { renderBaseEmailTemplate } from '@/convex/email/templates/baseEmailTemplate';

// UTILS
import { resend } from '@/convex/resend';
import {
	renderDetailsTable,
	renderEmailNotice,
	senderAddress
} from '@/convex/email/utils/convexEmailUtils';

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

export async function sendAcceptedReservationEmailToGuest(
	ctx: MutationCtx,
	details: GuestReservationEmailDetails
) {
	const subject = `Reservation confirmed at ${details.hospitalityName}`;
	const html = renderBaseEmailTemplate({
		eyebrow: 'Reservation confirmed',
		title: `${details.hospitalityName} confirmed your reservation`,
		description:
			'Your reservation is confirmed. We look forward to seeing you at the requested time.',
		children: [
			renderDetailsTable([
				{ label: 'Preferred time', value: details.requestedTime },
				{ label: 'Guest name', value: details.guestName },
				{ label: 'Number of guests', value: String(details.guestCount) },
				{ label: 'Phone', value: details.phone },
				{ label: 'Email', value: details.guestEmail }
			]),
			renderEmailNotice({
				title: 'Important',
				body: 'The hospitality may contact you via WhatsApp or phone to coordinate your visit. Please check your messages and respond promptly—if we do not hear from you within a reasonable timeframe, your reservation may be cancelled.'
			})
		].join('')
	});

	const text = [
		`${details.hospitalityName} confirmed your reservation.`,
		'',
		'Your reservation is confirmed. We look forward to seeing you at the requested time.',
		'',
		`Preferred time: ${details.requestedTime}`,
		`Guest name: ${details.guestName}`,
		`Number of guests: ${details.guestCount}`,
		`Phone: ${details.phone}`,
		`Email: ${details.guestEmail}`,
		'',
		'IMPORTANT',
		'The hospitality may contact you via WhatsApp or phone to coordinate your visit. Please check your messages and respond promptly—if we do not hear from you within a reasonable timeframe, your reservation may be cancelled.'
	].join('\n');

	await resend.sendEmail(ctx, {
		from: senderAddress(),
		to: details.guestEmail,
		subject,
		html,
		text
	});
}
