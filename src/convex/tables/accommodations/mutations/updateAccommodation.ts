// LIBRARIES
import { v } from 'convex/values';

// HELPERS
import { getOwnedAccommodation } from '@/convex/tables/accommodations/helpers/getOwnedAccommodation';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// UTILS
import { authMutation } from '@/convex/auth/middleware/authMiddleware';
import { deleteUploadedFilesByKeys } from '@/convex/storage/r2/deleteUploadedFilesByKeys';
import { resolveStoredFileUrlAndSyncRow } from '@/convex/storage/r2/resolveStoredFileUrl.js';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/** Owner-scoped update. Does not change `ownerId` or `scanToken`. */
export const updateAccommodation = authMutation('updateAccommodation')({
	args: {
		accommodationId: v.id('accommodations'),
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
		addressNumber: v.optional(v.string()),
		latitude: v.number(),
		longitude: v.number(),
		description: v.optional(v.string()),
		isActive: v.boolean(),
		coverImageKey: v.optional(v.string())
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const doc = await getOwnedAccommodation(ctx, args.accommodationId, ctx.userId);
		if (!doc) {
			return {
				success: false,
				message: { key: 'GenericMessages.ACCOMMODATION_NOT_FOUND' }
			};
		}

		let coverImageKey = doc.coverImageKey;
		let coverImageUrl = doc.coverImageUrl;

		if (args.coverImageKey) {
			const uploaded = await ctx.db
				.query('uploadedFilesR2')
				.withIndex('by_key', (q) => q.eq('key', args.coverImageKey!))
				.unique();

			if (!uploaded) {
				return {
					success: false,
					message: { key: 'GenericMessages.STORAGE_URL_UNAVAILABLE' }
				};
			}

			coverImageUrl = await resolveStoredFileUrlAndSyncRow(ctx, uploaded);
			coverImageKey = uploaded.key;
		}

		// A replaced cover image would otherwise become ghost data: its uploadedFilesR2
		// row and R2 object stay consistent with each other, so the orphan cron never
		// reclaims them once the doc stops referencing the key.
		await deleteUploadedFilesByKeys(ctx, [
			doc.coverImageKey !== coverImageKey ? doc.coverImageKey : undefined
		]);

		const description = args.description?.trim();
		const addressNumber = args.addressNumber?.trim();
		await ctx.db.patch(args.accommodationId, {
			name: args.name.trim(),
			type: args.type,
			// Full street line in `address` (what displays read) + the bare number for the edit form.
			address: [args.address.trim(), addressNumber].filter(Boolean).join(' '),
			addressNumber: addressNumber || undefined,
			city: args.city.trim(),
			country: args.country.trim(),
			latitude: args.latitude,
			longitude: args.longitude,
			description: description ? description : undefined,
			isActive: args.isActive,
			coverImageKey,
			coverImageUrl
		});

		ctx.audit(AUDIT_ACTIONS.ACCOMMODATION_UPDATE, {
			resource: { table: 'accommodations', id: args.accommodationId },
			before: { name: doc.name, type: doc.type, isActive: doc.isActive },
			after: { name: args.name.trim(), type: args.type, isActive: args.isActive }
		});

		return {
			success: true,
			message: { key: 'GenericMessages.ACCOMMODATION_UPDATED' }
		};
	}
});
