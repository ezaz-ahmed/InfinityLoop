<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
	const user = $derived(data.user);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Navigation -->
	<nav class="bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<a href="/" class="text-xl font-bold text-gray-900">InfinityLoop</a>
				</div>
				<div class="flex items-center space-x-4">
					{#if user}
						<span class="text-gray-700">Hello, {user.name}</span>
						<form method="POST" action="/logout">
							<button
								type="submit"
								class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
							>
								Logout
							</button>
						</form>
					{:else}
						<a
							href="/login"
							class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
						>
							Login
						</a>
						<a
							href="/signup"
							class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							Sign Up
						</a>
					{/if}
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main>
		{@render children()}
	</main>
</div>
