<script lang="ts">
	import { onMount } from "svelte";
	import { getCoverArtUrl, search } from "../../lib/subsonicService";
	import { Link } from "svelte-routing";
	import TrackList from "./TrackList.svelte";
	import type { AlbumID3, ArtistID3, Child } from "subsonic-api";

	export let query: string = "";

	// Keep the search results in one object:
	let results: {
		artists: ArtistID3[];
		albums: AlbumID3[];
		songs: any[];
	} = {
		artists: [],
		albums: [],
		songs: [],
	};

	let loading = false;

	async function performSearch() {
		if (!query.trim()) return;
		loading = true;
		try {
			// Call our service's search method
			results = await search(query);
			// Optionally, if you need to massage the song objects, do it here.
			// For example, you could map the results with a helper function.
		} catch (error) {
			console.error("Search error:", error);
		} finally {
			results.songs = results.songs.map((song: any) => ({
				id: song.id,
				title: song.title,
				artist: song.artist,
				album: song.album,
				// Use getCoverArtUrl to form the URL dynamically.
				albumArt: song.coverArt
					? getCoverArtUrl(song.coverArt)
					: null,
				duration: song.duration,
			}));
			loading = false;
		}
	}

	// Run search whenever the query changes
	$: if (query) {
		performSearch();
	}

	onMount(() => {
		if (query) {
			performSearch();
		}
	});
</script>

<div class="p-6">
	<h1 class="text-3xl font-bold mb-6">
		{#if !query}
			Search
		{/if}
	</h1>

	{#if loading}
		<div class="flex justify-center items-center py-10">
			<div
				class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"
			></div>
		</div>
	{:else if query && !results.artists.length && !results.albums.length && !results.songs.length}
		<p class="text-center text-text-secondary py-10">
			No results found for "{query}"
		</p>
	{:else if query}
		<!-- Songs -->
		{#if results.songs.length}
			<section class="my-8">
				<h2 class="text-2xl flex font-bold mb-4">
					Songs
				</h2>
				<!-- Use the existing TrackList component -->
				<TrackList
					tracks={results.songs}
					showAlbum={true}
					showArtist={true}
				/>
			</section>
		{/if}
		<!-- Artists -->
		{#if results.artists.length}
			<section class="mb-8">
				<h2 class="text-2xl flex font-bold mb-4">
					Artists
				</h2>
				<div
					class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
				>
					{#each results.artists as artist}
						<Link
							to={`/artist/${artist.id}`}
							class="text-center p-4 bg-white/5 rounded-md hover:bg-white/10 transition-all"
						>
							<div
								class="w-24 h-24 mx-auto rounded-full overflow-hidden bg-white/10 mb-2"
							>
								<img
									src={getCoverArtUrl(
										artist.id,
									)}
									alt={artist.name}
									class="w-full h-full object-cover"
								/>
							</div>
							<p class="truncate">
								{artist.name}
							</p>
						</Link>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Albums -->
		{#if results.albums.length}
			<section class="mb-8">
				<h2 class="text-2xl flex font-bold mb-4">
					Albums
				</h2>
				<div
					class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4"
				>
					{#each results.albums as album}
						<Link
							to={`/album/${album.id}`}
							class="p-4 bg-white/5 rounded-md hover:bg-white/10 transition-all"
						>
							<div
								class="aspect-square overflow-hidden rounded-md mb-2 bg-white/5"
							>
								{#if album.coverArt}
									<img
										src={getCoverArtUrl(
											album.id,
										)}
										alt={album.name}
										class="w-full h-full object-cover"
									/>
								{:else}
									<div
										class="w-full h-full flex items-center justify-center text-text-secondary"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="48"
											height="48"
											fill="currentColor"
											viewBox="0 0 16 16"
										>
											<path
												d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z"
											/>
											<path
												fill-rule="evenodd"
												d="M12 3v10h-1V3h1z"
											/>
											<path
												d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z"
											/>
										</svg>
									</div>
								{/if}
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
						</Link>
					{/each}
				</div>
			</section>
		{/if}
	{:else}
		<div class="text-center py-10 text-text-secondary">
			<p>Enter a search term to find music</p>
		</div>
	{/if}
</div>
