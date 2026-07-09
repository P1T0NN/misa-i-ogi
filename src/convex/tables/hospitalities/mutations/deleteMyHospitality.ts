// LIBRARIES
import { ConvexError } from 'convex/values';

// HELPERS
import { createDeleteMutation } from '@/convex/helpers/createDeleteMutation';
import { COUNTER_KEYS } from '@/convex/helpers/counterKeys';
import { cascadeHospitalityChildren } from '@/convex/tables/hospitalities/helpers/cascadeHospitalityChildren';
import { cleanupHospitalityFiles } from '@/convex/tables/hospitalities/helpers/cleanupHospitalityFiles';
import { hasActiveHospitalityPartnership } from '@/convex/tables/partnerships/helpers/hasActivePartnership';
import { hospitalityHasOpenReservations } from '@/convex/tables/reservations/helpers/hospitalityHasOpenReservations';

// TYPES
import type { ConvexErrorPayload } from '@/convex/types/convexTypes';

/** Owner self-service delete — same guards and storage cleanup as admin bulk delete. */
export const deleteMyHospitality = createDeleteMutation('deleteMyHospitality', {
	table: 'hospitalities',
	totalCounterKey: COUNTER_KEYS.HOSPITALITIES_TOTAL,
	ownerId: { field: (doc) => doc.ownerId },
	runStorageDelete: cleanupHospitalityFiles,
	// Sequential + cascade: see `deleteHospitalities` for the rationale.
	phase2Strategy: 'sequential',
	onDelete: (ctx, doc) => cascadeHospitalityChildren(ctx, doc._id, doc.ownerId),
	authorize: async (ctx, doc) => {
		if (await hasActiveHospitalityPartnership(ctx, doc._id)) {
			throw new ConvexError({
				code: 'HOSPITALITY_HAS_ACTIVE_PARTNERSHIP',
				message: { key: 'GenericMessages.HOSPITALITY_CANNOT_DELETE_ACTIVE_PARTNERSHIP' }
			} satisfies ConvexErrorPayload);
		}
		if (await hospitalityHasOpenReservations(ctx, doc._id)) {
			throw new ConvexError({
				code: 'HOSPITALITY_HAS_OPEN_RESERVATIONS',
				message: { key: 'GenericMessages.HOSPITALITY_CANNOT_DELETE_OPEN_RESERVATIONS' }
			} satisfies ConvexErrorPayload);
		}
		return true;
	}
});
