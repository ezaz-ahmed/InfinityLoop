import type { Actions } from './$types';
import { createServerApi } from '$lib/api';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies, request }) => {
		// Get cookie header for API call
		const cookieHeader = request.headers.get('cookie') || '';

		if (cookieHeader) {
			// Create server API instance with cookie forwarding
			const serverApi = createServerApi(cookieHeader);
			// Call logout API
			await serverApi.logout();
		}

		// Clear the auth_session cookie
		cookies.delete('auth_session', { path: '/' });

		// Redirect to homepage
		throw redirect(303, '/');
	}
} satisfies Actions;
