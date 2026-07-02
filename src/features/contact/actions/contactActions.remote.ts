// SVELTEKIT IMPORTS
import { RESEND_API_KEY } from '$env/static/private';

// LIBRARIES
import { Resend } from 'resend';
import { m } from '@/shared/lib/paraglide/messages';

// CONFIG
import { COMPANY_DATA } from '@/shared/constants';

// UTILS
import { safeCommand } from '@/shared/utils/remoteFunctionsUtils';

// SCHEMAS
import { sendContactFormEmailSchema } from '@/features/contact/schemas/contactSchemas';

export const sendContactFormEmail = safeCommand(sendContactFormEmailSchema, async (data) => {
	const resend = new Resend(RESEND_API_KEY);

	const { error } = await resend.emails.send({
		from: `Website Contact Form <noreply@${COMPANY_DATA.DOMAIN}>`,
		to: [COMPANY_DATA.EMAIL],
		replyTo: data.email,
		subject: 'Website contact form',
		// Plain text — user input must never be interpolated into HTML unescaped.
		text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
	});

	if (error) {
		return { success: false, message: error.message, data: null };
	}

	return { success: true, message: m['GenericMessages.EMAIL_SENT_SUCCESSFULLY'](), data: null };
});
