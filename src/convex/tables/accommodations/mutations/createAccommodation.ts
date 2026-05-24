// LIBRARIES
import { v } from 'convex/values';

// HELPERS
import { allocateScanToken } from '@/convex/tables/accommodations/helpers/allocateScanToken';

// UTILS
import { adminMutation } from '@/convex/auth/middleware/authMiddleware';
import { authComponent } from '@/convex/auth/auth';
import { resolveStoredFileUrlAndSyncRow } from '@/convex/storage/r2/resolveStoredFileUrl.js';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Admin-only create. Mirrors the envelope pattern used in `userMutations` so the
 * `MutationForm` toast pipeline (`translateFromBackend(result.message)`) works
 * unchanged.
 *
 * `scanToken` is auto-generated and opaque — it is the secret embedded in printed QRs.
 */
export const createAccommodation = adminMutation('createAccommodation')({
	args: {
		name: v.string(),
		type: v.union(
			v.literal('apartment'),
			v.literal('hotel'),
			v.literal('villa'),
			v.literal('hostel'),
			v.literal('other')
		),
		address: v.string(),
		city: v.string(),
		country: v.string(),
		description: v.optional(v.string()),
		ownerId: v.optional(v.string()),
		isActive: v.boolean(),
		// Set by `processUploadFields` after upload; required so every listing has a cover.
		coverImageKey: v.string()
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const scanToken = await allocateScanToken(ctx);
		if (!scanToken) {
			return {
				success: false,
				message: { key: 'GenericMessages.ACCOMMODATION_SCAN_TOKEN_FAILED' }
			};
		}

		const { coverImageKey: uploadedKey, ownerId, ...rest } = args;
		const selectedOwnerId = ownerId?.trim() || undefined;
		const resolvedOwnerId = selectedOwnerId ?? ctx.userId;

		if (selectedOwnerId) {
			const owner = await authComponent.getAnyUserById(ctx, selectedOwnerId);
			if (!owner) {
				return {
					success: false,
					message: { key: 'GenericMessages.USER_NOT_FOUND' }
				};
			}
		}

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
			ownerId: resolvedOwnerId
		};

		await ctx.db.insert('accommodations', accommodation);

		return {
			success: true,
			message: { key: 'GenericMessages.ACCOMMODATION_CREATED' }
		};
	}
});
