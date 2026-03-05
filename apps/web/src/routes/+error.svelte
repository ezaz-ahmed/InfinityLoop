<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error {$page.status} - InfinityLoop</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
	<div class="text-center">
		<h1 class="mb-4 text-9xl font-bold text-gray-900">{$page.status}</h1>
		<h2 class="mb-6 text-3xl font-semibold text-gray-700">
			{#if $page.status === 404}
				Page Not Found
			{:else if $page.status === 500}
				Internal Server Error
			{:else}
				Something went wrong
			{/if}
		</h2>
		<p class="mb-8 text-lg text-gray-600">
			{$page.error?.message || "The page you're looking for doesn't exist or an error occurred."}
		</p>
		<div class="flex justify-center space-x-4">
			<a
				href="/"
				class="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-blue-700"
			>
				Go Home
			</a>
			<button
				onclick={() => history.back()}
				class="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-900 shadow-md transition duration-300 hover:bg-gray-300"
			>
				Go Back
			</button>
		</div>
	</div>
</div>
