// LIBRARIES
import { v } from 'convex/values';
import { adminMutation } from '@/convex/auth/middleware/authMiddleware';
import { authComponent } from '@/convex/auth/auth';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';
import { resolveStoredFileUrlAndSyncRow } from '@/convex/storage/r2/resolveStoredFileUrl.js';

// HELPERS
import { analytics } from '@/convex/analytics';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Admin-only create. Mirrors `userMutations` envelope so the `MutationForm`
 * toast pipeline works unchanged.
 */
export const createHospitality = adminMutation('createHospitality')({
	args: {
		name: v.string(),
		type: v.union(
			v.literal('restaurant'),
			v.literal('cafe'),
			v.literal('bar'),
			v.literal('night_club'),
			v.literal('horse_ride'),
			v.literal('spa'),
			v.literal('tour'),
			v.literal('other')
		),
		address: v.string(),
		city: v.string(),
		country: v.string(),
		description: v.string(),
		contactPhone: v.string(),
		reservationMode: v.literal('managed_request'),
		ownerId: v.optional(v.string()),
		isActive: v.boolean(),
		// Set by `processUploadFields` after upload; required so every venue has a cover.
		coverImageKey: v.string()
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
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

		const hospitality: typeof rest & {
			coverImageKey: string;
			coverImageUrl: string;
			ownerId: string;
			reservationMode: 'managed_request';
		} = {
			...rest,
			coverImageKey: uploaded.key,
			coverImageUrl,
			ownerId: resolvedOwnerId,
			reservationMode: args.reservationMode
		};

		const hospitalityId = await ctx.db.insert('hospitalities', hospitality);

		await analytics.writeTrack(ctx, {
			name: 'hospitality.claimed',
			organizationId: resolvedOwnerId,
			scopes: [
				{
					scopeType: 'organization',
					scopeId: createAnalyticsScopeId('hospitalityOwner', resolvedOwnerId)
				}
			],
			properties: {
				hospitalityId,
				hospitalityName: hospitality.name,
				hospitalityType: hospitality.type
			}
		});

		return {
			success: true,
			message: { key: 'GenericMessages.HOSPITALITY_CREATED' }
		};
	}
});
