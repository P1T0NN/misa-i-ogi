// LIBRARIES
import { v, type Infer, type Validator } from 'convex/values';

/**
 * Paraglide message descriptor emitted by mutations/actions.
 * Matches {@link TranslatableMessage} in `src/convex/types/convexTypes.ts`.
 */
export const translatableMessageValidator = v.object({
	key: v.string(),
	params: v.optional(v.record(v.string(), v.union(v.string(), v.float64(), v.boolean())))
});

/**
 * Shared `{ success, message, data? }` return envelope for Convex mutations/actions.
 * Matches {@link ConvexMutationResult} in `src/convex/types/convexTypes.ts`.
 *
 * Use {@link mutationResultWithDataValidator} when a mutation returns typed `data`.
 */
export const mutationResultValidator = v.object({
	success: v.boolean(),
	message: translatableMessageValidator,
	data: v.optional(v.any())
});

export type MutationResult = Infer<typeof mutationResultValidator>;

/** Stricter variant when `data` has a known shape on success paths. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mutationResultWithDataValidator<DataValidator extends Validator<any>>(
	dataValidator: DataValidator
) {
	return v.object({
		success: v.boolean(),
		message: translatableMessageValidator,
		data: v.optional(dataValidator)
	});
}
