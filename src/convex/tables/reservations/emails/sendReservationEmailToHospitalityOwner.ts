// LIBRARIES
import { resend } from '@/convex/resend';

// HELPERS
import { authComponent } from '@/convex/auth/auth';

// TEMPLATES
import { renderBaseEmailTemplate } from '@/convex/email/templates/baseEmailTemplate';

// UTILS
import { renderDetailsTable, senderAddress } from '@/convex/email/utils/convexEmailUtils';

// TYPES
import type { Doc } from '@/convex/_generated/dataModel';
import type { MutationCtx } from '@/convex/_generated/server';

type ReservationEmailDetails = {
	hospitality: Pick<Doc<'hospitalities'>, '_id' | 'name' | 'ownerId'>;
	guestName: string;
	phone: string;
	requestedTime: string;
	guestEmail?: string;
};

export async function sendReservationEmailToHospitalityOwner(
	ctx: MutationCtx,
	details: ReservationEmailDetails
) {
	const owner = await authComponent.getAnyUserById(ctx, details.hospitality.ownerId);
	if (!owner?.email) {
		throw new Error('Hospitality owner email is missing');
	}

	const subject = `New reservation request for ${details.hospitality.name}`;
	const html = renderBaseEmailTemplate({
		eyebrow: 'Reservation request',
		title: `New request for ${details.hospitality.name}`,
		description:
			'A guest submitted a reservation request from the stay app. Contact them to confirm or decline.',
		children: renderDetailsTable([
			{ label: 'Preferred time', value: details.requestedTime },
			{ label: 'Guest name', value: details.guestName },
			{ label: 'Phone', value: details.phone },
			{ label: 'Guest email', value: details.guestEmail }
		])
	});

	const text = [
		`New reservation request for ${details.hospitality.name}`,
		'',
		`Preferred time: ${details.requestedTime}`,
		`Guest name: ${details.guestName}`,
		`Phone: ${details.phone}`,
		...(details.guestEmail ? [`Guest email: ${details.guestEmail}`] : []),
		'',
		'Contact the guest to confirm or decline the request.'
	].join('\n');

	await resend.sendEmail(ctx, {
		from: senderAddress(),
		to: owner.email,
		subject,
		html,
		text,
		...(details.guestEmail ? { replyTo: [details.guestEmail] } : {})
	});
}
