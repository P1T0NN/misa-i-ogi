// SVELTEKIT IMPORTS
import { getContext, setContext } from 'svelte';

// TYPES
import type { CurrentGuest } from '@/convex/tables/guests/types/guestsTypes';
import type { GuestAuthStatus } from '@/features/guests/classes/guestAuth.svelte.js';

export type StayGuestAuthStatus = GuestAuthStatus;

export type StayRouteContext = {
	readonly guestAuthStatus: StayGuestAuthStatus;
	readonly currentGuest: CurrentGuest | undefined;
	readonly sharingCode: string;
};

const STAY_ROUTE_CONTEXT = Symbol('StayRouteContext');

export function setStayRouteContext(context: StayRouteContext) {
	setContext(STAY_ROUTE_CONTEXT, context);
	return context;
}

export function useStayRouteContext() {
	const context = getContext<StayRouteContext | undefined>(STAY_ROUTE_CONTEXT);

	if (!context) {
		throw new Error('useStayRouteContext must be used inside the /stay route layout.');
	}

	return context;
}
