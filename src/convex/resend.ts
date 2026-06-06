// LIBRARIES
import { Resend } from '@convex-dev/resend';
import { components } from '@/convex/_generated/api';

/**
 * Durable Resend queue backed by the Convex Resend component.
 *
 * Set `RESEND_TEST_MODE=true` in Convex env to restrict delivery to Resend test
 * addresses. By default this app enqueues real emails, matching the existing
 * direct Resend OTP helper behavior.
 */
export const resend = new Resend(components.resend, {
	testMode: process.env.RESEND_TEST_MODE === 'true'
});
