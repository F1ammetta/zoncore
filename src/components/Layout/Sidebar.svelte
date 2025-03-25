<script lang="ts">
	import {
		subsonicSettings,
		connectionStatus,
		connectionError,
		testConnection,
		getPlaylists,
	} from "../../lib/subsonicService";
	import { Link } from "svelte-routing";

	let serverUrl = "";
	let username = "";
	let password = "";
	let useSalt = true;
	let loading = false;
	let playlists: any[] = [];

	let autoConnectAttempted = false;

	async function connect() {
		if (!serverUrl || !username || !password) return;
		loading = true;
		const success = await testConnection({
			serverUrl,
			username,
			password,
			useSalt,
		});

		if (success) {
			await loadPlaylists();
		}
		loading = false;
	}

	async function loadPlaylists() {
		try {
			playlists = await getPlaylists();
		} catch (error) {
			console.error("Failed to load playlists:", error);
			playlists = [];
		}
	}

	$: if ($subsonicSettings && !autoConnectAttempted) {
		serverUrl = $subsonicSettings.serverUrl;
		username = $subsonicSettings.username;
		password = $subsonicSettings.password;
		useSalt = $subsonicSettings.useSalt ?? true;

		connect().then(() => {
			autoConnectAttempted = true;
		});
	}
</script>

<div class="h-full flex flex-col select-none">
	<div class="mb-6 ml-2 mt-1">
		<h1 class="text-xl flex font-bold mb-6 text-accent">Soncore</h1>

		{#if $connectionStatus != "connected" && $connectionStatus != "connecting"}
			<div class="mb-4 p-3 bg-background rounded-md">
				<h3 class="text-sm font-semibold mb-2">
					Connect to Server
				</h3>
				<input
					type="text"
					bind:value={serverUrl}
					placeholder="Server URL"
					class="w-full mb-2 px-3 py-2 bg-white/5 rounded-md
            focus:outline-none focus:ring-1 focus:ring-accent"
				/>
				<input
					type="text"
					bind:value={username}
					placeholder="Username"
					class="w-full mb-2 px-3 py-2 bg-white/5 rounded-md
            focus:outline-none focus:ring-1 focus:ring-accent"
				/>
				<input
					type="password"
					bind:value={password}
					placeholder="Password"
					class="w-full mb-2 px-3 py-2 bg-white/5 rounded-md
            focus:outline-none focus:ring-1 focus:ring-accent"
				/>
				<div class="flex items-center mb-3">
					<input
						type="checkbox"
						id="useSalt"
						bind:checked={useSalt}
						class="mr-2"
					/>
					<label for="useSalt" class="text-sm"
						>Use salt (recommended)</label
					>
				</div>
				<button
					on:click={connect}
					class="w-full btn-primary text-sm"
					disabled={loading}
				>
					{#if loading}
						Connecting...
					{:else}
						Connect
					{/if}
				</button>

				{#if $connectionError}
					<div
						class="mt-2 p-2 bg-red-900/30 text-red-200 text-sm rounded"
					>
						{$connectionError}
					</div>
				{/if}
			</div>
		{/if}

		<nav>
			<ul class="space-y-2">
				<li>
					<Link
						to="/"
						class="flex items-center gap-3 text-text-secondary
                   hover:text-text-primary py-2 transition-colors"
					>
						<span
							class="material-symbols-outlined"
							>Home</span
						>
						Home
					</Link>
				</li>
				<li></li>
			</ul>
		</nav>
	</div>

	<div class="mt-6 ml-4 items-start flex flex-col">
		<h3
			class="uppercase text-xs font-bold text-text-secondary mb-4"
		>
			Playlists
		</h3>
		{#if $connectionStatus === "connected" && playlists.length > 0}
			{#each playlists as playlist}
				<Link
					to={`/playlist/${playlist.id}`}
					class="text-text-secondary hover:text-text-primary block py-2 transition-colors truncate"
				>
					{playlist.name.trim()}
				</Link>
			{/each}
		{:else if $connectionStatus === "connected"}
			<p class="text-text-secondary text-sm">
				No playlists found
			</p>
		{:else}
			<p class="text-text-secondary text-sm">
				Connect to server to see playlists
			</p>
		{/if}
	</div>

	<div class="mt-auto pt-4">
		<button
			class="flex items-center gap-2 text-text-secondary
             hover:text-text-primary transition-colors"
		>
			<span class="material-symbols-outlined">Settings</span>
			Settings
		</button>
	</div>
</div>
