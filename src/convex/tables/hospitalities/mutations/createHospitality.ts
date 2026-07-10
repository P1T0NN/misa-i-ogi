// LIBRARIES
import { v } from 'convex/values';
import { adminMutation } from '@/convex/auth/middleware/authMiddleware';
import { authComponent } from '@/convex/auth/auth';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// HELPERS
import { analytics } from '@/convex/analytics';
import { COUNTER_KEYS } from '@/convex/helpers/counterKeys';
import { resolveUploadedImages } from '@/convex/helpers/resolveUploadedImages';
import { generateUniqueConnectCode } from '@/convex/tables/hospitalities/helpers/generateUniqueConnectCode';
import {
	resolveMenuFile,
	normalizeMenuLink
} from '@/convex/tables/hospitalities/helpers/resolveMenuFile';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';
import { parsePartnershipBenefit } from '@/convex/tables/partnerships/utils/parsePartnershipBenefit';

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
		addressNumber: v.optional(v.string()),
		latitude: v.optional(v.number()),
		longitude: v.optional(v.number()),
		description: v.string(),
		contactPhone: v.string(),
		reservationMode: v.literal('managed_request'),
		// platform = public, linkable by every accommodation; user = private, reachable
		// only via the owner's custom-partnership connect code. Missing defaults to platform.
		createType: v.optional(v.union(v.literal('platform'), v.literal('user'))),
		// Guest-facing offer for every venue.
		benefit: v.string(),
		ownerId: v.optional(v.string()),
		isActive: v.boolean(),
		// Ordered R2 refs set by `processUploadFields`; images[0] is the cover.
		images: v.array(v.string()),
		menuFileKey: v.optional(v.string()),
		menuLink: v.optional(v.string())
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		const createType = args.createType ?? 'platform';

		const benefit = parsePartnershipBenefit(args.benefit);
		if (!benefit) {
			return {
				success: false,
				message: { key: 'GenericMessages.PARTNERSHIP_BENEFIT_INVALID' }
			};
		}

		const addressNumber = args.addressNumber?.trim();
		const address = [args.address.trim(), addressNumber].filter(Boolean).join(' ');
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

		// Admin uploads the images themselves; images[0] is the cover.
		const images = await resolveUploadedImages(ctx, args.images, ctx.userId);
		if (images.length === 0) {
			return {
				success: false,
				message: { key: 'GenericMessages.HOSPITALITY_IMAGE_REQUIRED' }
			};
		}

		const menu = await resolveMenuFile(ctx, args.menuFileKey);
		if (!menu.ok) return menu.error;
		const menuLink = normalizeMenuLink(args.menuLink);

		const connectCode = await generateUniqueConnectCode(ctx);

		const hospitalityId = await ctx.db.insert('hospitalities', {
			name: args.name,
			type: args.type,
			address,
			addressNumber: addressNumber || undefined,
			city: args.city,
			country: args.country,
			latitude: args.latitude,
			longitude: args.longitude,
			description: args.description,
			contactPhone: args.contactPhone,
			reservationMode: args.reservationMode,
			isActive: args.isActive,
			benefit,
			ownerId: resolvedOwnerId,
			images,
			menuFileKey: menu.menuFileKey,
			menuFileUrl: menu.menuFileUrl,
			menuLink,
			createType,
			connectCode
		});
		await analytics.counters.bump(ctx, COUNTER_KEYS.HOSPITALITIES_TOTAL, 1);

		ctx.audit(AUDIT_ACTIONS.HOSPITALITY_CREATE, {
			resource: { table: 'hospitalities', id: hospitalityId },
			after: { name: args.name, type: args.type, createType },
			metadata: { ownerId: resolvedOwnerId }
		});

		await analytics.track(ctx, 'hospitality.claimed', {
			subject: { type: 'hospitality', id: hospitalityId },
			organizationId: resolvedOwnerId,
			scopes: [
				{
					scopeType: 'organization',
					scopeId: createAnalyticsScopeId('hospitalityOwner', resolvedOwnerId)
				}
			],
			properties: {
				hospitalityId,
				hospitalityName: args.name,
				hospitalityType: args.type
			}
		});

		return {
			success: true,
			message: { key: 'GenericMessages.HOSPITALITY_CREATED' }
		};
	}
});
