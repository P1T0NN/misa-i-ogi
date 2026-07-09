// LIBRARIES
import { analytics } from '@/convex/analytics';

// HELPERS
import {
	activePartnershipsCounterKey,
	ownerReservationStatusCounterKey,
	RESERVATION_STATUSES
} from '@/convex/helpers/counterKeys';

// TYPES
import type { MutationCtx, QueryCtx } from '@/convex/_generated/server';
import type {
	ReservationCounts,
	ReservationStatus
} from '@/convex/tables/reservations/types/reservationsTypes';

export async function getOwnerReservationStatusCount(
	ctx: QueryCtx,
	ownerId: string,
	status: ReservationStatus
): Promise<number> {
	return (
		(await analytics.counters.get(ctx, ownerReservationStatusCounterKey(ownerId, status))) ?? 0
	);
}

export async function getOwnerReservationCounts(
	ctx: QueryCtx,
	ownerId: string
): Promise<ReservationCounts> {
	const counts = await analytics.counters.getMany(
		ctx,
		RESERVATION_STATUSES.map((status) => ownerReservationStatusCounterKey(ownerId, status))
	);

	return Object.fromEntries(
		RESERVATION_STATUSES.map((status) => [
			status,
			counts[ownerReservationStatusCounterKey(ownerId, status)] ?? 0
		])
	) as ReservationCounts;
}

export async function bumpOwnerReservationStatus(
	ctx: MutationCtx,
	ownerId: string,
	status: ReservationStatus,
	delta: number
): Promise<void> {
	if (delta === 0) return;
	await analytics.counters.bump(ctx, ownerReservationStatusCounterKey(ownerId, status), delta);
}

export async function transferOwnerReservationStatus(
	ctx: MutationCtx,
	ownerId: string,
	from: ReservationStatus,
	to: ReservationStatus
): Promise<void> {
	await bumpOwnerReservationStatus(ctx, ownerId, from, -1);
	await bumpOwnerReservationStatus(ctx, ownerId, to, 1);
}

export async function bumpActivePartnershipsForOwners(
	ctx: MutationCtx,
	accommodationOwnerId: string,
	hospitalityOwnerId: string,
	delta: number
): Promise<void> {
	if (delta === 0) return;

	await analytics.counters.bump(ctx, activePartnershipsCounterKey(accommodationOwnerId), delta);
	if (hospitalityOwnerId !== accommodationOwnerId) {
		await analytics.counters.bump(ctx, activePartnershipsCounterKey(hospitalityOwnerId), delta);
	}
}

export async function getActivePartnershipsCount(ctx: QueryCtx, userId: string): Promise<number> {
	return (await analytics.counters.get(ctx, activePartnershipsCounterKey(userId))) ?? 0;
}
