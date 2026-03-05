// API client for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface User {
	id: string;
	email: string;
	name: string;
}

export interface SignupData {
	email: string;
	password: string;
	name: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	details?: any[];
}

/**
 * Client-side fetch that includes credentials (cookies) automatically.
 * Only works in the browser.
 */
async function fetchWithCredentials(url: string, options: RequestInit = {}) {
	const response = await fetch(`${API_BASE_URL}${url}`, {
		...options,
		credentials: 'include', // Important for cookies in browser
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		}
	});

	return response;
}

/**
 * Server-side fetch that manually forwards cookies from the incoming request.
 * Used in hooks.server.ts and server load functions.
 */
function createServerFetch(cookieHeader: string) {
	return async (url: string, options: RequestInit = {}) => {
		const response = await fetch(`${API_BASE_URL}${url}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				Cookie: cookieHeader,
				...options.headers
			}
		});

		return response;
	};
}

/**
 * Client-side API - uses credentials: 'include' for automatic cookie handling
 * Use this from Svelte components and client-side code
 */
export const api = {
	async signup(data: SignupData): Promise<ApiResponse<{ user: User }>> {
		try {
			const response = await fetchWithCredentials('/auth/signup', {
				method: 'POST',
				body: JSON.stringify(data)
			});

			const result = await response.json();

			if (!response.ok) {
				return {
					success: false,
					error: result.error || 'Signup failed',
					details: result.details
				};
			}

			return {
				success: true,
				data: result
			};
		} catch (error) {
			console.error('[API] Signup error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Network error'
			};
		}
	},

	async login(data: LoginData): Promise<ApiResponse<{ user: User }>> {
		try {
			const response = await fetchWithCredentials('/auth/login', {
				method: 'POST',
				body: JSON.stringify(data)
			});

			const result = await response.json();

			if (!response.ok) {
				return {
					success: false,
					error: result.error || 'Login failed'
				};
			}

			return {
				success: true,
				data: result
			};
		} catch (error) {
			console.error('[API] Login error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Network error'
			};
		}
	},

	async logout(): Promise<ApiResponse<void>> {
		try {
			const response = await fetchWithCredentials('/auth/logout', {
				method: 'POST'
			});

			if (!response.ok) {
				return {
					success: false,
					error: 'Logout failed'
				};
			}

			return {
				success: true
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Network error'
			};
		}
	}
};

/**
 * Server-side API - requires cookie header to be passed explicitly
 * Use this from hooks.server.ts, +page.server.ts, and +layout.server.ts
 */
export function createServerApi(cookieHeader: string) {
	const serverFetch = createServerFetch(cookieHeader);

	return {
		async getMe(): Promise<User | null> {
			try {
				const response = await serverFetch('/auth/me', {
					method: 'GET'
				});

				if (!response.ok) {
					return null;
				}

				const result = await response.json();
				return result.user || null;
			} catch (error) {
				console.error('[API] getMe error:', error);
				return null;
			}
		},

		async logout(): Promise<ApiResponse<void>> {
			try {
				const response = await serverFetch('/auth/logout', {
					method: 'POST'
				});

				if (!response.ok) {
					return {
						success: false,
						error: 'Logout failed'
					};
				}

				return {
					success: true
				};
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Network error'
				};
			}
		}
	};
}
