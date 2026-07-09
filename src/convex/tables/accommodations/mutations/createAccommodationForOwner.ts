// HELPERS
import { allocateScanToken } from '@/convex/tables/accommodations/helpers/allocateScanToken';
import { analytics } from '@/convex/analytics';
import { COUNTER_KEYS } from '@/convex/helpers/counterKeys';
import { logAudit } from '@/convex/tables/auditLog/helpers/logAudit';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// UTILS
import { createAnalyticsScopeId } from '@piton-/analytics-convex';
import { resolveStoredFileUrlAndSyncRow } from '@/convex/storage/r2/resolveStoredFileUrl.js';

// SCHEMAS
import type { MutationResult } from '@/convex/schemas/mutationResult';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';

export type CreateAccommodationForOwnerInput = {
	name: string;
	type: 'apartment' | 'hotel' | 'villa' | 'hostel' | 'other';
	address: string;
	city: string;
	country: string;
	addressNumber?: string;
	latitude?: number;
	longitude?: number;
	isActive: boolean;
	coverImageKey: string;
	ownerId: string;
};

export async function createAccommodationForOwner(
	ctx: MutationCtx,
	input: CreateAccommodationForOwnerInput,
	options: { uploadOwnerId?: string; actorId?: string } = {}
): Promise<MutationResult> {
	const scanToken = await allocateScanToken(ctx);
	if (!scanToken) {
		return {
			success: false,
			message: { key: 'GenericMessages.ACCOMMODATION_SCAN_TOKEN_FAILED' }
		};
	}

	const { coverImageKey: uploadedKey, ownerId } = input;

	const uploaded = await ctx.db
		.query('uploadedFilesR2')
		.withIndex('by_key', (q) => q.eq('key', uploadedKey))
		.unique();

	if (!uploaded) {
		return {
			success: false,
			message: { key: 'GenericMessages.STORAGE_URL_UNAVAILABLE' }
		};
	}
	if (options.uploadOwnerId && uploaded.ownerId !== options.uploadOwnerId) {
		return {
			success: false,
			message: { key: 'GenericMessages.FORBIDDEN' }
		};
	}

	const coverImageUrl = await resolveStoredFileUrlAndSyncRow(ctx, uploaded);

	const accommodationId = await ctx.db.insert('accommodations', {
		name: input.name,
		type: input.type,
		address: input.address,
		city: input.city,
		country: input.country,
		addressNumber: input.addressNumber,
		latitude: input.latitude,
		longitude: input.longitude,
		isActive: input.isActive,
		scanToken,
		coverImageKey: uploaded.key,
		coverImageUrl,
		ownerId
	});
	await analytics.counters.bump(ctx, COUNTER_KEYS.ACCOMMODATIONS_TOTAL, 1);

	// Actor is the admin for admin-create, the owner for self-service. `ownerId`
	// (who the venue belongs to) rides in metadata so both are on the record.
	logAudit(ctx, AUDIT_ACTIONS.ACCOMMODATION_CREATE, {
		userId: options.actorId,
		resource: { table: 'accommodations', id: accommodationId },
		after: { name: input.name, type: input.type, isActive: input.isActive },
		metadata: { ownerId }
	});

	await analytics.track(ctx, 'accommodation.registered', {
		subject: { type: 'accommodation', id: accommodationId },
		organizationId: ownerId,
		scopes: [
			{
				scopeType: 'organization',
				scopeId: createAnalyticsScopeId('accommodationOwner', ownerId)
			}
		],
		properties: {
			accommodationId,
			accommodationName: input.name,
			accommodationType: input.type
		}
	});

	return {
		success: true,
		message: { key: 'GenericMessages.ACCOMMODATION_CREATED' }
	};
}
