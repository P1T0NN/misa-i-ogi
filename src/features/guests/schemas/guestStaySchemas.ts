// LIBRARIES
import * as v from 'valibot';
import { m } from '@/shared/lib/paraglide/messages';

const sharingCodeInvalid = m['ValidationMessages.JoinGuestStaySchema.sharingCodeInvalid']();

export const joinGuestStaySchema = v.object({
	sharingCode: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(4, sharingCodeInvalid),
		v.maxLength(4, sharingCodeInvalid)
	)
});
