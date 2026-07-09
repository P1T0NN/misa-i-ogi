// LIBRARIES
import { pick } from 'convex-helpers';
import { v } from 'convex/values';

// TYPES
import type { ObjectType, PropertyValidators } from 'convex/values';

/**
 * One field list → a validator, a TS type, and a runtime projector that copies exactly
 * those fields and nothing else.
 *
 * The alternative most codebases land on is three parallel declarations of the same
 * shape: an `Omit<Doc<'t'>, …>` type, a `v.object({…})` validator, and a hand-written
 * `{ _id: doc._id, name: doc.name, … }` literal. Nothing links them, so they drift —
 * and because most schema fields are `v.optional`, a projector that forgets a field
 * still typechecks against its own return type. Worse, `Omit` is fail-open: a new
 * column added to the table joins every "safe" type automatically.
 *
 * `createProjection` is fail-closed. `project` returns `ObjectType<Fields>` exactly, so
 * a new schema column is invisible until it is added here on purpose, and a field named
 * here that the source doc lacks is a compile error. Pass `validator` as a query's
 * `returns` and Convex re-proves the same shape server-side on every response.
 *
 * @example
 *   export const accommodationStaySafe = createProjection({
 *     _id: v.id('accommodations'),
 *     ...pick(accommodationFields, ['name', 'city'])
 *   });
 *
 *   export type AccommodationStaySafe = ProjectionType<typeof accommodationStaySafe>;
 *   // in a query:  returns: accommodationStaySafe.validator
 *   // in a helper: return accommodationStaySafe.project(doc);
 */
export function createProjection<Fields extends PropertyValidators>(fields: Fields) {
	const keys = Object.keys(fields) as (keyof ObjectType<Fields>)[];

	return {
		fields,
		validator: v.object(fields),
		/**
		 * Copy the projected fields off a doc. The parameter type demands the source
		 * carries every field, and the return type admits nothing else — absent optional
		 * fields stay absent (no `undefined` values, which Convex rejects).
		 */
		// `pick` returns a mapped `Pick<…>` that TS won't collapse back to `ObjectType<Fields>`
		// while `Fields` is still generic — the two are identical once instantiated.
		project: (doc: ObjectType<Fields>): ObjectType<Fields> => pick(doc, keys) as ObjectType<Fields>
	};
}

/** The row type a projection produces — `ProjectionType<typeof someProjection>`. */
export type ProjectionType<P extends { project: (doc: never) => unknown }> = ReturnType<
	P['project']
>;
