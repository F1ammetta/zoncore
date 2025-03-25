<script lang="ts">
	import { onMount } from "svelte";
	import {
		getRecentAlbums,
		getRandomAlbums,
		getCoverArtUrl,
	} from "../../lib/subsonicService";
	import { connectionStatus } from "../../lib/subsonicService";
	import { Link } from "svelte-routing";

	let recentAlbums: any[] = [];
	let randomAlbums: any[] = [];
	let loading = true;

	async function loadData() {
		loading = true;
		try {
			recentAlbums = await getRecentAlbums(14);
			randomAlbums = await getRandomAlbums(14);
		} catch (error) {
			console.error("Error loading data:", error);
		} finally {
			loading = false;
		}
	}

	function getAlbumUrl(albumId: string) {
		return `/album/${albumId}`;
	}

	onMount(() => {
		if ($connectionStatus === "connected") {
			loadData();
		}
	});

	// Reload data when connection status changes to connected
	$: if ($connectionStatus === "connected") {
		loadData();
	}
</script>

<div class="p-4 select-none">
	{#if loading}
		<div class="flex justify-center items-center py-20">
			<div
				class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"
			></div>
		</div>
	{:else if $connectionStatus !== "connected"}
		<div class="p-8 text-center">
			<h2 class="text-2xl font-bold mb-4">Not Connected</h2>
			<p class="text-text-secondary mb-4">
				Connect to a Subsonic server to start listening
				to music.
			</p>
		</div>
	{:else}
		<!-- Recent Albums -->
		<section class="mb-8">
			<h2 class="text-2xl flex font-bold mb-4 cursor-default">
				Recent Additions
			</h2>
			<div
				class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4"
			>
				{#each recentAlbums as album}
					<Link to={getAlbumUrl(album.id)}>
						<div
							class="p-4 bg-white/5 rounded-md hover:bg-white/10 transition-all cursor-pointer"
						>
							<div
								class="aspect-square overflow-hidden rounded-md mb-2 bg-white/5"
							>
								<img
									src={getCoverArtUrl(
										album.id,
									)}
									alt={album.name}
									class="w-full h-full object-cover transition-all hover:scale-105"
								/>
							</div>
							<h3
								class="font-medium truncate"
							>
								{album.name}
							</h3>
							<p
								class="text-sm text-text-secondary truncate"
							>
								{album.artist}
							</p>
						</div>
					</Link>
				{/each}
			</div>
		</section>

		<!-- Random Albums -->
		<section class="mb-8">
			<h2 class="text-2xl flex font-bold mb-4 cursor-default">
				Discover
			</h2>
			<div
				class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4"
			>
				{#each randomAlbums as album}
					<Link to={getAlbumUrl(album.id)}>
						<div
							class="p-4 bg-white/5 rounded-md hover:bg-white/10 transition-all cursor-pointer"
						>
							<div
								class="aspect-square overflow-hidden rounded-md mb-2 bg-white/5"
							>
								<img
									src={getCoverArtUrl(
										album.id,
									)}
									alt={album.name}
									class="w-full h-full object-cover transition-all hover:scale-105"
								/>
							</div>
							<h3
								class="font-medium truncate"
							>
								{album.name}
							</h3>
							<p
								class="text-sm text-text-secondary truncate"
							>
								{album.artist}
							</p>
						</div>
					</Link>
				{/each}
			</div>
		</section>
	{/if}
</div>
