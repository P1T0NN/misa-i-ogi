// LIBRARIES
import { v } from 'convex/values';

// HELPERS
import { getOwnedHospitality } from '@/convex/tables/hospitalities/helpers/getOwnedHospitality';
import { getUserPlan } from '@/convex/tables/proTrials/helpers/proTrial';
import { resolveMenuFile, normalizeMenuLink } from '@/convex/tables/hospitalities/helpers/resolveMenuFile';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// UTILS
import { authMutation } from '@/convex/auth/middleware/authMiddleware';
import { resolveStoredFileUrlAndSyncRow } from '@/convex/storage/r2/resolveStoredFileUrl.js';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/** Owner-scoped update. Does not change `ownerId`. */
export const updateHospitality = authMutation('updateHospitality')({
	args: {
		hospitalityId: v.id('hospitalities'),
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
		addressNumber: v.optional(v.string()),
		latitude: v.number(),
		longitude: v.number(),
		description: v.string(),
		contactPhone: v.string(),
		reservationMode: v.literal('managed_request'),
		isActive: v.boolean(),
		coverImageKey: v.optional(v.string()),
		menuFileKey: v.optional(v.string()),
		menuLink: v.optional(v.string())
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const doc = await getOwnedHospitality(ctx, args.hospitalityId, ctx.userId);
		if (!doc) {
			return {
				success: false,
				message: { key: 'GenericMessages.HOSPITALITY_NOT_FOUND' }
			};
		}

		// Cron-deactivated venue (expired pro trial): only a Pro upgrade may switch
		// it back on — otherwise the expiry would be a checkbox away from undone.
		let deactivationReason = doc.deactivationReason;
		if (doc.deactivationReason === 'trial_expired' && args.isActive) {
			const plan = await getUserPlan(ctx, ctx.userId);
			if (plan !== 'pro') {
				return {
					success: false,
					message: { key: 'GenericMessages.PRO_TRIAL_EXPIRED' }
				};
			}
			deactivationReason = undefined;
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

		// A new upload replaces the menu file; otherwise keep whatever's there.
		let menuFileKey = doc.menuFileKey;
		let menuFileUrl = doc.menuFileUrl;
		if (args.menuFileKey) {
			const menu = await resolveMenuFile(ctx, args.menuFileKey);
			if (!menu.ok) return menu.error;
			menuFileKey = menu.menuFileKey;
			menuFileUrl = menu.menuFileUrl;
		}

		// Link field is always sent by the edit form (empty clears it); a caller that
		// omits it entirely keeps the existing link.
		const menuLink =
			args.menuLink !== undefined ? normalizeMenuLink(args.menuLink) : doc.menuLink;

		const addressNumber = args.addressNumber?.trim();
		await ctx.db.patch(args.hospitalityId, {
			name: args.name.trim(),
			type: args.type,
			// Full street line in `address` (what displays read) + the bare number for the edit form.
			address: [args.address.trim(), addressNumber].filter(Boolean).join(' '),
			addressNumber: addressNumber || undefined,
			city: args.city.trim(),
			country: args.country.trim(),
			latitude: args.latitude,
			longitude: args.longitude,
			description: args.description.trim(),
			contactPhone: args.contactPhone.trim(),
			reservationMode: args.reservationMode,
			isActive: args.isActive,
			deactivationReason,
			coverImageKey,
			coverImageUrl,
			menuFileKey,
			menuFileUrl,
			menuLink
		});

		ctx.audit(AUDIT_ACTIONS.HOSPITALITY_UPDATE, {
			resource: { table: 'hospitalities', id: args.hospitalityId },
			before: { name: doc.name, type: doc.type, isActive: doc.isActive },
			after: { name: args.name.trim(), type: args.type, isActive: args.isActive }
		});

		return {
			success: true,
			message: { key: 'GenericMessages.HOSPITALITY_UPDATED' }
		};
	}
});
