// LIBRARIES
import { v } from 'convex/values';

// UTILS
import { authMutation } from '@/convex/auth/middleware/authMiddleware';

// HELPERS
import { createAccommodationForOwner } from './createAccommodationForOwner';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

export const createMyAccommodation = authMutation('createMyAccommodation')({
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
		latitude: v.number(),
		longitude: v.number(),
		description: v.optional(v.string()),
		coverImageKey: v.string()
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const addressNumber = args.addressNumber?.trim();
		// Store the full street line in `address` (what every display reads) plus the
		// bare number so the edit form can rehydrate its separate field.
		const address = [args.address.trim(), addressNumber].filter(Boolean).join(' ');
		return createAccommodationForOwner(
			ctx,
			{
				...args,
				address,
				addressNumber: addressNumber || undefined,
				ownerId: ctx.userId,
				isActive: true
			},
			{
				uploadOwnerId: ctx.userId
			}
		);
	}
});
