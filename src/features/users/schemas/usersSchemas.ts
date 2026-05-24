// LIBRARIES
import * as v from 'valibot';
import { m } from '@/shared/lib/paraglide/messages';

// UTILS
import { isDeniedPassword } from '@/features/auth/utils/denyPasswordList.js';

export const userAddFormSchema = v.pipe(
	v.object({
		name: v.pipe(
			v.string(),
			v.trim(),
			v.minLength(1, m['ValidationMessages.SignUpForm.nameRequired']())
		),
		email: v.pipe(
			v.string(),
			v.trim(),
			v.minLength(1, m['ValidationMessages.SignUpForm.emailRequired']()),
			v.email(m['ValidationMessages.SignUpForm.invalidEmail']())
		),
		password: v.pipe(
			v.string(),
			v.minLength(1, m['ValidationMessages.SignUpForm.passwordRequired']()),
			v.minLength(8, m['ValidationMessages.SignUpForm.passwordMinLength']()),
			v.check(
				(input) => !isDeniedPassword(input),
				m['ValidationMessages.SignUpForm.passwordTooCommon']()
			)
		),
		confirmPassword: v.pipe(
			v.string(),
			v.minLength(1, m['ValidationMessages.SignUpForm.confirmPasswordRequired']())
		),
		role: v.picklist(['user', 'admin'] as const),
		emailVerified: v.boolean()
	}),
	v.forward(
		v.check(
			(input) => input.password === input.confirmPassword,
			m['ValidationMessages.SignUpForm.passwordsMustMatch']()
		),
		['confirmPassword']
	)
);

export type UserAddFormInputs = v.InferInput<typeof userAddFormSchema>;
