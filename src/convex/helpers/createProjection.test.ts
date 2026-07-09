import { strict as assert } from 'node:assert';
import { v } from 'convex/values';
import { createProjection } from './createProjection.js';

const safe = createProjection({
	_id: v.id('accommodations'),
	name: v.string(),
	latitude: v.optional(v.number())
});

// A doc carrying fields the projection never names.
const row = safe.project({
	_id: 'acc_1' as never,
	name: 'Villa',
	latitude: 44.8,
	scanToken: 'SECRET',
	ownerId: 'u1'
} as never);

assert.deepEqual(Object.keys(row).sort(), ['_id', 'latitude', 'name']);
assert.equal((row as Record<string, unknown>).scanToken, undefined);

// An absent optional field stays absent — Convex rejects explicit `undefined` values.
const noPin = safe.project({ _id: 'acc_2' as never, name: 'Hostel' });
assert.equal('latitude' in noPin, false);

console.log('createProjection: fail-closed OK');
