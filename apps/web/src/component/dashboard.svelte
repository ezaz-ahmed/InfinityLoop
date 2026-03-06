<script>
	let { user } = $props();
</script>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="overflow-hidden rounded-lg bg-white shadow">
		<div class="px-4 py-5 sm:p-6">
			<h1 class="mb-4 text-3xl font-bold text-gray-900">
				Welcome back, {user.name}!
			</h1>
			<p class="mb-6 text-gray-600">
				This is your personal dashboard. You're logged in as <strong>{user.email}</strong>
			</p>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				<!-- Dashboard Cards -->
				<div class="rounded-lg border border-blue-200 bg-blue-50 p-6">
					<h3 class="mb-2 text-lg font-semibold text-blue-900">Profile</h3>
					<p class="text-sm text-blue-700">Manage your account settings and preferences</p>
				</div>

				<div class="rounded-lg border border-green-200 bg-green-50 p-6">
					<h3 class="mb-2 text-lg font-semibold text-green-900">Projects</h3>
					<p class="text-sm text-green-700">View and manage your projects</p>
				</div>

				<div class="rounded-lg border border-purple-200 bg-purple-50 p-6">
					<h3 class="mb-2 text-lg font-semibold text-purple-900">Activity</h3>
					<p class="text-sm text-purple-700">Recent activity and notifications</p>
				</div>
			</div>
		</div>
	</div>
</div>
	