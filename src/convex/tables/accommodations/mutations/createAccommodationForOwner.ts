// HELPERS
import { allocateScanToken } from '@/convex/tables/accommodations/helpers/allocateScanToken';
import { analytics } from '@/convex/analytics';

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
	description?: string;
	isActive: boolean;
	coverImageKey: string;
	ownerId: string;
};

export async function createAccommodationForOwner(
	ctx: MutationCtx,
	input: CreateAccommodationForOwnerInput,
	options: { uploadOwnerId?: string } = {}
): Promise<MutationResult> {
	const scanToken = await allocateScanToken(ctx);
	if (!scanToken) {
		return {
			success: false,
			message: { key: 'GenericMessages.ACCOMMODATION_SCAN_TOKEN_FAILED' }
		};
	}

	const { coverImageKey: uploadedKey, ownerId, ...rest } = input;

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

	const accommodation: typeof rest & {
		scanToken: string;
		coverImageKey: string;
		coverImageUrl: string;
		ownerId: string;
	} = {
		...rest,
		scanToken,
		coverImageKey: uploaded.key,
		coverImageUrl,
		ownerId
	};

	const accommodationId = await ctx.db.insert('accommodations', accommodation);

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
			accommodationName: accommodation.name,
			accommodationType: accommodation.type
		}
	});

	return {
		success: true,
		message: { key: 'GenericMessages.ACCOMMODATION_CREATED' }
	};
}
