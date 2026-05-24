// SVELTEKIT IMPORTS
import { json } from '@sveltejs/kit';

// LIBRARIES
import { api } from '@/convex/_generated/api';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';

// TYPES
import type { RequestHandler } from './$types';

/** Public JWKS proxy — keys are generated and stored in Convex env. */
export const GET: RequestHandler = async () => {
	const client = createConvexHttpClient();
	const jwks = await client.query(
		api.tables.guests.queries.fetchGuestConvexJwks.fetchGuestConvexJwks,
		{}
	);

	return json(jwks, {
		headers: {
			'cache-control': 'public, max-age=300, stale-while-revalidate=300'
		}
	});
};
