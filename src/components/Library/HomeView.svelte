<script lang="ts">
	import { onMount } from "svelte";
	import {
		getRecentAlbums,
		getRandomAlbums,
		getCoverArtUrl,
		getStarred,
	} from "../../lib/subsonicService";
	import { connectionStatus } from "../../lib/subsonicService";
	import { Link } from "svelte-routing";
	import { playerStore, type Track } from "../../stores/playerStore";

	let recentAlbums: any[] = [];
	let randomAlbums: any[] = [];
	let favSongs: any[];
	let favAlbums: any[];
	let favArtists: any[];
	let loading = true;

	let refs: any = [];

	async function loadData() {
		loading = true;
		try {
			recentAlbums = await getRecentAlbums(14);
			randomAlbums = await getRandomAlbums(14);
			const favs = await getStarred();
			favSongs = favs.song!.map((x: any) => {
				x.albumArt = getCoverArtUrl(x.id);
				return x;
			});
			favAlbums = favs.album!;
			favArtists = favs.artist!;
		} catch (error) {
			console.error("Error loading data:", error);
		} finally {
			loading = false;
		}
	}

	function playTrack(track: Track, index: number) {
		playerStore.setTrack(track);
		const remainingTracks = favSongs.slice(index + 1);
		playerStore.clearQueue();
		if (remainingTracks.length > 0) {
			playerStore.addToQueue(remainingTracks);
		}
	}

	function scrollContainer(container: any, direction: any) {
		const scrollAmount = 300; // Adjust this value for how much to scroll
		container.scroll({
			left:
				direction === "left"
					? -scrollAmount
					: scrollAmount,
			behavior: "smooth",
		});
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
		{#if favSongs || favArtists || favAlbums}
			<section class="mb-8 mx-10">
				{#if favSongs}
					<div
						class="flex items-center justify-between mb-4"
					>
						<h3
							class="text-2xl font-bold cursor-default"
						>
							Favorite Songs
						</h3>
						<div class="flex gap-2">
							<button
								class="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center w-10 h-10"
								on:click={() =>
									scrollContainer(
										refs.favSongsContainer,
										"left",
									)}
							>
								◀
							</button>
							<button
								class="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center w-10 h-10"
								on:click={() =>
									scrollContainer(
										refs.favSongsContainer,
										"right",
									)}
							>
								▶
							</button>
						</div>
					</div>
					<div
						class="flex overflow-x-auto gap-4 scrollbar-hide"
						bind:this={
							refs.favSongsContainer
						}
					>
						{#each favSongs as song, i}
							<button
								class="flex-shrink-0 w-36 p-2 bg-white/5 rounded-md scrollbat-hide hover:bg-white/10 transition-all cursor-pointer mb-4"
								on:click={() =>
									playTrack(
										song as Track,
										i,
									)}
							>
								<div
									class="aspect-square overflow-hidden rounded-md mb-2 bg-white/5"
								>
									<img
										src={getCoverArtUrl(
											song.id,
										)}
										alt={song.title}
										class="w-full h-full object-cover transition-all hover:scale-105"
									/>
								</div>
								<h3
									class="font-medium truncate"
								>
									{song.title}
								</h3>
								<p
									class="text-sm text-text-secondary truncate"
								>
									{song.artist}
								</p>
							</button>
						{/each}
					</div>
				{/if}

				{#if favArtists}
					<div
						class="flex items-center justify-between mb-4"
					>
						<h3
							class="text-2xl font-bold cursor-default"
						>
							Favorite Artists
						</h3>
						<div class="flex gap-2">
							<button
								class="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center w-10 h-10"
								on:click={() =>
									scrollContainer(
										refs.favArtistsContainer,
										"left",
									)}
							>
								◀
							</button>
							<button
								class="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center w-10 h-10"
								on:click={() =>
									scrollContainer(
										refs.favArtistsContainer,
										"right",
									)}
							>
								▶
							</button>
						</div>
					</div>
					<div
						class="flex overflow-x-auto gap-4 scrollbar-hide"
						bind:this={
							refs.favArtistsContainer
						}
					>
						{#each favArtists as artist}
							<Link
								to={`/artist/${artist.id}`}
							>
								<div
									class="flex-shrink-0 w-36 p-2 bg-white/5 rounded-md hover:bg-white/10 transition-all cursor-pointer mb-4"
								>
									<div
										class="aspect-square overflow-hidden rounded-md mb-2 bg-white/5"
									>
										<img
											src={getCoverArtUrl(
												artist.id,
											)}
											alt={artist.name}
											class="w-full h-full object-cover transition-all hover:scale-105"
										/>
									</div>
									<h3
										class="font-medium truncate"
									>
										{artist.name}
									</h3>
								</div>
							</Link>
						{/each}
					</div>
				{/if}

				{#if favAlbums}
					<div
						class="flex items-center justify-between mb-4"
					>
						<h3
							class="text-2xl font-bold cursor-default"
						>
							Favorite Albums
						</h3>
						<div class="flex gap-2">
							<button
								class="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center w-10 h-10"
								on:click={() =>
									scrollContainer(
										refs.favAlbumsContainer,
										"left",
									)}
							>
								◀
							</button>
							<button
								class="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center w-10 h-10"
								on:click={() =>
									scrollContainer(
										refs.favAlbumsContainer,
										"right",
									)}
							>
								▶
							</button>
						</div>
					</div>
					<div
						class="flex overflow-x-auto gap-4 scrollbar-hide"
						bind:this={
							refs.favAlbumsContainer
						}
					>
						{#each favAlbums as album}
							<Link
								to={`/album/${album.id}`}
							>
								<div
									class="flex-shrink-0 w-36 p-2 bg-white/5 rounded-md hover:bg-white/10 transition-all cursor-pointer mb-4"
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
				{/if}
			</section>
		{/if}
		<!-- Recent Albums -->
		<section class="mb-8 mx-10">
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
		<section class="mb-8 mx-10">
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
