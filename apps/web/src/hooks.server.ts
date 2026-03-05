import type { Handle } from '@sveltejs/kit';
import { createServerApi } from '$lib/api';

export const handle: Handle = async ({ event, resolve }) => {
	// Check if auth_session cookie exists
	const authSession = event.cookies.get('auth_session');

	if (authSession) {
		// Get the full cookie header to forward to the API
		const cookieHeader = event.request.headers.get('cookie') || '';

		// Create server API instance with cookie forwarding
		const serverApi = createServerApi(cookieHeader);

		// Fetch user data from the API
		const user = await serverApi.getMe();
		event.locals.user = user;
	} else {
		// No auth cookie, user is not authenticated
		event.locals.user = null;
	}

	return resolve(event);
};
