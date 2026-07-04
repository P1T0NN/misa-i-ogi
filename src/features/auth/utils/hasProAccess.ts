// TYPES
import type { CurrentUser } from '@/features/auth/classes/authClass.svelte';
import type { ProAccess } from '@/convex/auth/types/types';

/**
 * Derives {@link ProAccess} from the current user snapshot for UI gating.
 */
export function hasProAccess(
	user: Pick<CurrentUser, 'plan' | 'proTrialEndsAt'> | null | undefined
): ProAccess | null {
	if (!user) return null;
	if (user.plan === 'pro') return 'pro';

	const endsAt = user.proTrialEndsAt;
	if (endsAt == null) return 'trial-available';
	return Date.now() >= endsAt ? 'trial-expired' : 'trial-active';
}
