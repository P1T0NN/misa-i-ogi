// LIBRARIES
import { v } from 'convex/values';

/**
 * Field validators for `uploadedFilesR2` — Cloudflare R2 file reference + cached download URL.
 */
export const uploadedFilesR2Fields = {
	ownerId: v.string(),
	key: v.string(),
	url: v.string()
};
