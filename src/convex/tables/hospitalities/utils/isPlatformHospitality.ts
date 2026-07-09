// TYPES
import type { Doc } from '@/convex/_generated/dataModel';

export function isPlatformHospitality(
	hospitality: Pick<Doc<'hospitalities'>, 'createType'>
): boolean {
	return (hospitality.createType ?? 'platform') === 'platform';
}
