// LIBRARIES
import { v } from 'convex/values';

// HELPERS
import { isAdminUser } from '@/convex/auth/helpers/isAdminUser';
import { getHospitalityForEdit } from '@/convex/tables/hospitalities/helpers/getHospitalityForEdit';
import { getUserPlan } from '@/convex/tables/proTrials/helpers/proTrial';
import { parsePartnershipBenefit } from '@/convex/tables/partnerships/utils/parsePartnershipBenefit';
import { resolveUploadedImages } from '@/convex/helpers/resolveUploadedImages';
import {
	resolveMenuFile,
	normalizeMenuLink
} from '@/convex/tables/hospitalities/helpers/resolveMenuFile';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// UTILS
import { authMutation } from '@/convex/auth/middleware/authMiddleware';
import { deleteUploadedFilesByKeys } from '@/convex/storage/r2/deleteUploadedFilesByKeys';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Owner- or admin-scoped update. Does not change `ownerId`.
 *
 * `benefit` is an ADMIN-ONLY lever (the guest-facing offer): owners never edit it,
 * so it is validated + patched only when the caller is an admin. Non-admin callers
 * that send it are silently ignored.
 */
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
		// Ordered R2 refs (existing keys + new uploads); images[0] is the cover.
		images: v.optional(v.array(v.string())),
		menuFileKey: v.optional(v.string()),
		menuLink: v.optional(v.string()),
		benefit: v.optional(v.string())
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const doc = await getHospitalityForEdit(ctx, args.hospitalityId, ctx.userId);
		if (!doc) {
			return {
				success: false,
				message: { key: 'GenericMessages.HOSPITALITY_NOT_FOUND' }
			};
		}

		const callerIsAdmin = await isAdminUser(ctx);

		// Cron-deactivated venue (expired pro trial): only Pro (or admin) may switch it back on.
		let deactivationReason = doc.deactivationReason;
		if (doc.deactivationReason === 'trial_expired' && args.isActive) {
			if (!callerIsAdmin) {
				const plan = await getUserPlan(ctx, ctx.userId);
				if (plan !== 'pro') {
					return {
						success: false,
						message: { key: 'GenericMessages.PRO_TRIAL_EXPIRED' }
					};
				}
			}
			deactivationReason = undefined;
		}

		// Admin-only guest-offer edit. Owners can't reach this (field hidden + gate here).
		let benefit = doc.benefit;
		if (callerIsAdmin && args.benefit !== undefined) {
			const parsedBenefit = parsePartnershipBenefit(args.benefit);
			if (!parsedBenefit) {
				return {
					success: false,
					message: { key: 'GenericMessages.PARTNERSHIP_BENEFIT_INVALID' }
				};
			}
			benefit = parsedBenefit;
		}

		// The edit form submits the full ordered gallery — surviving existing keys plus
		// any new upload keys, images[0] the cover. Replace the whole array; keys that
		// dropped out get their R2 objects reclaimed below.
		let images = doc.images ?? [];
		let removedImageKeys: string[] = [];
		if (args.images !== undefined) {
			// Keys already on the doc were authorized when first attached (possibly by a
			// different account — admin vs owner), so they bypass the ownership check;
			// only new upload keys must resolve as the caller's own uploads.
			const existingByKey = new Map((doc.images ?? []).map((image) => [image.key, image]));
			const newKeys = args.images.filter((key) => !existingByKey.has(key));
			const resolvedNew = new Map(
				(await resolveUploadedImages(ctx, newKeys, ctx.userId)).map((image) => [image.key, image])
			);
			const resolved = args.images
				.map((key) => existingByKey.get(key) ?? resolvedNew.get(key))
				.filter((image) => image !== undefined);
			if (resolved.length === 0) {
				return {
					success: false,
					message: { key: 'GenericMessages.HOSPITALITY_IMAGE_REQUIRED' }
				};
			}
			const nextKeys = new Set(resolved.map((image) => image.key));
			removedImageKeys = (doc.images ?? [])
				.map((image) => image.key)
				.filter((key) => !nextKeys.has(key));
			images = resolved;
		}

		// A new upload replaces the menu file; otherwise keep whatever's there.
		let menuFileKey = doc.menuFileKey;
		let menuFileUrl = doc.menuFileUrl;
		if (args.menuFileKey) {
			const menu = await resolveMenuFile(ctx, args.menuFileKey, ctx.userId);
			if (!menu.ok) return menu.error;
			menuFileKey = menu.menuFileKey;
			menuFileUrl = menu.menuFileUrl;
		}

		// Link field is always sent by the edit form (empty clears it); a caller that
		// omits it entirely keeps the existing link.
		const menuLink = args.menuLink !== undefined ? normalizeMenuLink(args.menuLink) : doc.menuLink;

		// A replaced cover/menu file would otherwise become ghost data: its
		// uploadedFilesR2 row and R2 object stay consistent with each other, so the
		// orphan cron never reclaims them once the doc stops referencing the key.
		await deleteUploadedFilesByKeys(ctx, [
			...removedImageKeys,
			doc.menuFileKey !== menuFileKey ? doc.menuFileKey : undefined
		]);

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
			benefit,
			images,
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
