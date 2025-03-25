<script lang="ts">
	import { onMount } from "svelte";
	import { playerStore } from "../../stores/playerStore";
	import {
		getArtist,
		getCoverArtUrl,
		getTopSongs,
	} from "../../lib/subsonicService";
	import { Link } from "svelte-routing";
	import TrackList from "./TrackList.svelte";

	export let artistId: string;

	let artist: any = null;
	let albums: any[] = [];
	let tracks: any[] = [];
	let loading = true;
	let error = "";

	function navigateToAlbum(albumId: string) {
		// Would use a router to navigate to the album page
		console.log("Navigate to album:", albumId);
	}

	async function loadArtist() {
		loading = true;
		error = "";

		try {
			// This would be implemented in the SubsonicClient
			// artist = await client.getArtist(artistId);
			// albums = await client.getArtistAlbums(artistId);
			// topTracks = await client.getArtistTopSongs(artistId);
			// Placeholder data

			artist = await getArtist(artistId);

			albums = artist.album;

			console.log(artist);

			tracks = await getTopSongs(artist.name);
			tracks = tracks.map((track) => {
				track.albumArt = getCoverArtUrl(track.id);
				return track;
			});
		} catch (err) {
			console.error("Failed to load artist:", err);
			error = "Failed to load artist. Please try again.";
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadArtist();
	});
</script>

<div class="w-full">
	{#if loading}
		<div class="flex justify-center items-center py-20">
			<div
				class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"
			></div>
		</div>
	{:else if error}
		<div class="bg-red-500/20 text-red-200 p-4 rounded-md">
			{error}
		</div>
	{:else if artist}
		<div class="flex items-center gap-8 mb-8 mx-15">
			<div class="flex-shrink-0">
				<img
					src={getCoverArtUrl(artist.id) ||
						"https://via.placeholder.com/300"}
					alt={`${artist.name}`}
					class="w-48 h-48 object-cover rounded-full shadow-lg"
				/>
			</div>

			<div>
				<h1 class="text-5xl font-bold mb-2">
					{artist.name}
				</h1>
				<p class="text-text-secondary">
					{artist.albumCount} albums
				</p>
			</div>
		</div>

		<section class="my-8 mx-15">
			<h2 class="text-2xl flex font-bold mb-4">Popular</h2>
			<!-- <div class="grid grid-cols-1 gap-2"> -->
			<!-- 	{#each topTracks as track, i} -->
			<!-- 		<div -->
			<!-- 			class="flex items-center gap-4 p-2 hover:bg-white/5 rounded-md cursor-pointer transition-colors" -->
			<!-- 			on:click={() => { -->
			<!-- 				playerStore.setTrack({ -->
			<!-- 					id: track.id, -->
			<!-- 					title: track.title, -->
			<!-- 					artist: artist.name, -->
			<!-- 					album: track.album, -->
			<!-- 					albumArt: getCoverArtUrl( -->
			<!-- 						track.id, -->
			<!-- 					), -->
			<!-- 					duration: track.duration, -->
			<!-- 				}); -->
			<!-- 			}} -->
			<!-- 		> -->
			<!-- 			<div -->
			<!-- 				class="w-8 text-center text-text-secondary" -->
			<!-- 			> -->
			<!-- 				{i + 1} -->
			<!-- 			</div> -->
			<!-- 			<img -->
			<!-- 				src={getCoverArtUrl( -->
			<!-- 					track.id, -->
			<!-- 				)} -->
			<!-- 				alt={track.album} -->
			<!-- 				class="w-12 h-12 rounded" -->
			<!-- 			/> -->
			<!-- 			<div class="flex-1"> -->
			<!-- 				<div>{track.title}</div> -->
			<!-- 				<div -->
			<!-- 					class="text-sm text-text-secondary" -->
			<!-- 				> -->
			<!-- 					{track.album} -->
			<!-- 				</div> -->
			<!-- 			</div> -->
			<!-- 			<div -->
			<!-- 				class="text-text-secondary" -->
			<!-- 			> -->
			<!-- 				{Math.floor( -->
			<!-- 					track.duration / -->
			<!-- 						60, -->
			<!-- 				)}:{( -->
			<!-- 					track.duration % -->
			<!-- 					60 -->
			<!-- 				) -->
			<!-- 					.toString() -->
			<!-- 					.padStart( -->
			<!-- 						2, -->
			<!-- 						"0", -->
			<!-- 					)} -->
			<!-- 			</div> -->
			<!-- 		</div> -->
			<!-- 	{/each} -->
			<!-- </div> -->
			<div class="mt-8 select-none cursor-default">
				<TrackList
					{tracks}
					showHeader={false}
					showArtist={false}
				/>
			</div>
		</section>

		<section class="my-8 mx-15">
			<h2 class="text-2xl flex font-bold mb-4">Albums</h2>
			<div
				class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4"
			>
				{#each albums as album}
					<Link to={`/album/${album.id}`}>
						<div
							class="p-4 bg-white/5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
						>
							<img
								src={getCoverArtUrl(
									album.id,
								)}
								alt={album.name}
								class="w-full aspect-square object-cover rounded-md shadow-md mb-2"
							/>
							<h3
								class="font-medium truncate"
							>
								{album.name}
							</h3>
							<p
								class="text-sm text-text-secondary"
							>
								{album.year}
							</p>
						</div>
					</Link>
				{/each}
			</div>
		</section>
	{:else}
		<div class="bg-white/5 p-8 rounded-md text-center">
			<h2 class="text-2xl mb-4">Artist not found</h2>
			<p class="text-text-secondary">
				The artist you're looking for doesn't exist or
				you don't have access to it.
			</p>
		</div>
	{/if}
</div>
