// LIBRARIES
import { v } from 'convex/values';
import { authMutation } from '@/convex/auth/middleware/authMiddleware';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';

// HELPERS
import { analytics } from '@/convex/analytics';
import { COUNTER_KEYS } from '@/convex/helpers/counterKeys';
import { resolveUploadedImages } from '@/convex/helpers/resolveUploadedImages';
import { generateUniqueConnectCode } from '@/convex/tables/hospitalities/helpers/generateUniqueConnectCode';
import { ensureHospitalityCreateAccess } from '@/convex/tables/hospitalities/helpers/ensureHospitalityCreateAccess';
import {
	resolveMenuFile,
	normalizeMenuLink
} from '@/convex/tables/hospitalities/helpers/resolveMenuFile';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';
import { parsePartnershipBenefit } from '@/convex/tables/partnerships/utils/parsePartnershipBenefit';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

// CONFIG
import { SUBSCRIPTION_ENABLED } from '@/shared/config.js';

/**
 * Self-service venue creation (the owner-facing Add Hospitality page). Creates
 * just the venue — no partnership, no quota: linking happens later on the
 * create-custom-partnership flow via the venue's connect code. Born
 * `createType: "user"` (reachable only via its connect code); the connect code is
 * minted here so it's shareable immediately.
 */
export const createUserHospitality = authMutation('createUserHospitality')({
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
		benefit: v.string(),
		images: v.array(v.string()),
		menuFileKey: v.optional(v.string()),
		menuLink: v.optional(v.string())
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		// Paid tier is closed for launch — refuse even if a stale client reaches here.
		if (!SUBSCRIPTION_ENABLED) {
			return { success: false, message: { key: 'GenericMessages.FORBIDDEN' } };
		}

		// Trial/Pro gate — the client hides the form too, but the server decides.
		const denied = await ensureHospitalityCreateAccess(ctx, ctx.userId);
		if (denied) return denied;

		const benefit = parsePartnershipBenefit(args.benefit);
		if (!benefit) {
			return { success: false, message: { key: 'GenericMessages.PARTNERSHIP_BENEFIT_INVALID' } };
		}

		// Only the caller's own uploads count; images[0] is the cover.
		const images = await resolveUploadedImages(ctx, args.images, ctx.userId);
		if (images.length === 0) {
			return { success: false, message: { key: 'GenericMessages.HOSPITALITY_IMAGE_REQUIRED' } };
		}

		const menu = await resolveMenuFile(ctx, args.menuFileKey);
		if (!menu.ok) return menu.error;
		const menuLink = normalizeMenuLink(args.menuLink);

		const addressNumber = args.addressNumber?.trim();
		// Full street line in `address` (what displays read) + the bare number for edit forms.
		const address = [args.address.trim(), addressNumber].filter(Boolean).join(' ');

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
			benefit,
			ownerId: ctx.userId,
			images,
			menuFileKey: menu.menuFileKey,
			menuFileUrl: menu.menuFileUrl,
			menuLink,
			createType: 'user',
			connectCode,
			isActive: true
		});
		await analytics.counters.bump(ctx, COUNTER_KEYS.HOSPITALITIES_TOTAL, 1);

		ctx.audit(AUDIT_ACTIONS.HOSPITALITY_CREATE, {
			resource: { table: 'hospitalities', id: hospitalityId },
			after: { name: args.name, type: args.type, createType: 'user' }
		});

		await analytics.track(ctx, 'hospitality.claimed', {
			subject: { type: 'hospitality', id: hospitalityId },
			organizationId: ctx.userId,
			scopes: [
				{
					scopeType: 'organization',
					scopeId: createAnalyticsScopeId('hospitalityOwner', ctx.userId)
				}
			],
			properties: {
				hospitalityId,
				hospitalityName: args.name,
				hospitalityType: args.type
			}
		});

		return { success: true, message: { key: 'GenericMessages.HOSPITALITY_CREATED' } };
	}
});
