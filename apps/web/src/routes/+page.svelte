<script lang="ts">
	import Dashboard from '../component/dashboard.svelte';

	let { data } = $props();
	const user = $derived(data.user);
</script>

<svelte:head>
	<title>InfinityLoop - Home</title>
</svelte:head>

{#if user}
	<!-- Dashboard for authenticated users -->
	<Dashboard {user} />
{:else}
	<!-- Public landing page -->
	<div class="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100">
		<div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="mb-6 text-5xl font-extrabold text-gray-900">
					Welcome to <span class="text-blue-600">InfinityLoop</span>
				</h1>
				<p class="mx-auto mb-8 max-w-2xl text-xl text-gray-700">
					Your next-generation platform for building amazing applications. Get started today and
					join thousands of developers.
				</p>

				<div class="flex justify-center space-x-4">
					<a
						href="/signup"
						class="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-blue-700"
					>
						Get Started
					</a>
					<a
						href="/login"
						class="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 shadow-md transition duration-300 hover:bg-gray-50"
					>
						Sign In
					</a>
				</div>
			</div>

			<!-- Features Section -->
			<div class="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="rounded-lg bg-white p-8 text-center shadow-lg">
					<div class="mb-4 text-4xl">🚀</div>
					<h3 class="mb-3 text-xl font-bold text-gray-900">Fast Development</h3>
					<p class="text-gray-600">Build and deploy applications quickly with our modern stack</p>
				</div>

				<div class="rounded-lg bg-white p-8 text-center shadow-lg">
					<div class="mb-4 text-4xl">🔒</div>
					<h3 class="mb-3 text-xl font-bold text-gray-900">Secure by Default</h3>
					<p class="text-gray-600">Enterprise-grade security features built into every layer</p>
				</div>

				<div class="rounded-lg bg-white p-8 text-center shadow-lg">
					<div class="mb-4 text-4xl">⚡</div>
					<h3 class="mb-3 text-xl font-bold text-gray-900">Lightning Fast</h3>
					<p class="text-gray-600">Optimized performance for the best user experience</p>
				</div>
			</div>
		</div>
	</div>
{/if}
