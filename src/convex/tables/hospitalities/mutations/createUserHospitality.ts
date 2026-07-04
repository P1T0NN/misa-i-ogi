// LIBRARIES
import { v } from 'convex/values';
import { authMutation } from '@/convex/auth/middleware/authMiddleware';
import { createAnalyticsScopeId } from '@piton-/analytics-convex';
import { resolveStoredFileUrlAndSyncRow } from '@/convex/storage/r2/resolveStoredFileUrl.js';

// HELPERS
import { analytics } from '@/convex/analytics';
import { generateUniqueConnectCode } from '@/convex/tables/hospitalities/helpers/generateUniqueConnectCode';
import { ensureHospitalityCreateAccess } from '@/convex/tables/hospitalities/helpers/ensureHospitalityCreateAccess';
import { resolveMenuFile, normalizeMenuLink } from '@/convex/tables/hospitalities/helpers/resolveMenuFile';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// SCHEMAS
import { mutationResultValidator, type MutationResult } from '@/convex/schemas/mutationResult';

/**
 * Self-service venue creation (the owner-facing Add Hospitality page). Creates
 * just the venue — no partnership, no quota: linking happens later on the
 * create-custom-partnership flow via the venue's connect code. Born
 * `createType: "user"` and `visibility: "private"` (only an admin can publish
 * it); the connect code is minted here so it's shareable immediately.
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
		coverImageKey: v.string(),
		menuFileKey: v.optional(v.string()),
		menuLink: v.optional(v.string())
	},
	returns: mutationResultValidator,
	handler: async (ctx, args): Promise<MutationResult> => {
		// Trial/Pro gate — the client hides the form too, but the server decides.
		const denied = await ensureHospitalityCreateAccess(ctx, ctx.userId);
		if (denied) return denied;

		const uploaded = await ctx.db
			.query('uploadedFilesR2')
			.withIndex('by_key', (q) => q.eq('key', args.coverImageKey))
			.unique();
		if (!uploaded) {
			return { success: false, message: { key: 'GenericMessages.STORAGE_URL_UNAVAILABLE' } };
		}

		const coverImageUrl = await resolveStoredFileUrlAndSyncRow(ctx, uploaded);

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
			ownerId: ctx.userId,
			coverImageKey: uploaded.key,
			coverImageUrl,
			menuFileKey: menu.menuFileKey,
			menuFileUrl: menu.menuFileUrl,
			menuLink,
			createType: 'user',
			visibility: 'private',
			connectCode,
			isActive: true
		});

		ctx.audit(AUDIT_ACTIONS.HOSPITALITY_CREATE, {
			resource: { table: 'hospitalities', id: hospitalityId },
			after: { name: args.name, type: args.type, createType: 'user', visibility: 'private' }
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
