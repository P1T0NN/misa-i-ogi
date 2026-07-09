// LIBRARIES
import { v } from 'convex/values';

// UTILS
import { adminMutation } from '@/convex/auth/middleware/authMiddleware';
import { authComponent } from '@/convex/auth/auth';

// HELPERS
import { createAccommodationForOwner } from './createAccommodationForOwner';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Admin-only create. Mirrors the envelope pattern used in `userMutations` so the
 * `MutationForm` toast pipeline (`translateFromBackend(result.message)`) works
 * unchanged.
 *
 * `scanToken` is auto-generated and opaque; it is the secret embedded in printed QRs.
 */
export const adminCreateAccommodation = adminMutation('adminCreateAccommodation')({
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
		addressNumber: v.optional(v.string()),
		latitude: v.optional(v.number()),
		longitude: v.optional(v.number()),
		ownerId: v.optional(v.string()),
		isActive: v.boolean(),
		// Set by `processUploadFields` after upload; required so every listing has a cover.
		coverImageKey: v.string()
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const selectedOwnerId = args.ownerId?.trim() || undefined;
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

		const addressNumber = args.addressNumber?.trim();
		const address = [args.address.trim(), addressNumber].filter(Boolean).join(' ');

		return createAccommodationForOwner(
			ctx,
			{
				name: args.name,
				type: args.type,
				address,
				city: args.city,
				country: args.country,
				addressNumber: addressNumber || undefined,
				latitude: args.latitude,
				longitude: args.longitude,
				isActive: args.isActive,
				coverImageKey: args.coverImageKey,
				ownerId: resolvedOwnerId
			},
			{ actorId: ctx.userId }
		);
	}
});
