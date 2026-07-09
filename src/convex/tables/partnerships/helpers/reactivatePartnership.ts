// HELPERS
import { analytics } from '@/convex/analytics';
import { customPartnershipsCounterKey } from '@/convex/helpers/counterKeys';
import { bumpActivePartnershipsForOwners } from '@/convex/helpers/ownerCounterHelpers';
import { logAudit } from '@/convex/tables/auditLog/helpers/logAudit';
import { AUDIT_ACTIONS } from '@/convex/tables/auditLog/auditLogConfigs';

// TYPES
import type { MutationCtx } from '@/convex/_generated/server';
import type { Doc, Id } from '@/convex/_generated/dataModel';

type ReactivatePartnershipArgs = {
	partnershipId: Id<'partnerships'>;
	partnership: Doc<'partnerships'>;
	accommodationOwnerId: string;
	hospitalityOwnerId: string;
	benefit: string;
	actorId: string;
	auditMetadata?: Record<string, unknown>;
};

/** Re-enable a deactivated pair row (e.g. after trial expiry) without a second insert. */
export async function reactivatePartnership(ctx: MutationCtx, args: ReactivatePartnershipArgs) {
	const after = {
		isActive: true as const,
		benefit: args.benefit,
		deactivationReason: undefined
	};

	await ctx.db.patch(args.partnershipId, after);

	if (!args.partnership.isActive) {
		await bumpActivePartnershipsForOwners(
			ctx,
			args.accommodationOwnerId,
			args.hospitalityOwnerId,
			1
		);
	}

	if (args.partnership.createType === 'custom') {
		await analytics.counters.bump(ctx, customPartnershipsCounterKey(args.accommodationOwnerId), 1);
	}

	logAudit(ctx, AUDIT_ACTIONS.PARTNERSHIP_CREATE, {
		userId: args.actorId,
		resource: { table: 'partnerships', id: args.partnershipId },
		before: {
			isActive: args.partnership.isActive,
			benefit: args.partnership.benefit,
			deactivationReason: args.partnership.deactivationReason
		},
		after: { ...args.partnership, ...after },
		metadata: { reactivated: true, ...args.auditMetadata }
	});
}
