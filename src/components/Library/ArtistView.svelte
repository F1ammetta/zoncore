<script lang="ts">
	import { onMount } from "svelte";
	import { playerStore } from "../../stores/playerStore";
	import {
		getArtist,
		getCoverArtUrl,
		getTopSongs,
		star,
		unstar,
	} from "../../lib/subsonicService";
	import { Link } from "svelte-routing";
	import TrackList from "./TrackList.svelte";

	export let artistId: string;

	let artist: any = null;
	let albums: any[] = [];
	let tracks: any[] = [];
	let loading = true;
	let error = "";
	let isFav = false;

	async function toggleFav() {
		if (isFav) {
			isFav = !(await unstar(artistId, "album"));
		} else {
			isFav = await star(artistId, "album");
		}
	}

	async function playArtist() {
		if (tracks.length > 0) {
			playerStore.setTrack(tracks[0]);
			playerStore.clearQueue();
			if (tracks.length > 1) {
				playerStore.addToQueue(tracks.slice(1));
			}
		}
	}

	function navigateToAlbum(albumId: string) {
		// Would use a router to navigate to the album page
		console.log("Navigate to album:", albumId);
	}

	async function loadArtist() {
		loading = true;
		error = "";

		try {
			artist = await getArtist(artistId);

			isFav = artist.starred;

			albums = artist.album;

			console.log(artist);

			tracks = (await getTopSongs(artist.name)) ?? [];
			tracks = tracks.slice(0, 5);
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

			<div class="h-48">
				<h1 class="text-5xl font-bold mb-4">
					{artist.name}
				</h1>
				<p class="text-text-secondary mb-15">
					{artist.albumCount} albums
				</p>
				<div class="flex gap-4 justify-around mt-auto">
					<button
						class="btn-primary play flex items-center gap-2 cursor-pointer mr-6 text-center align-middle justify-center aspect-square rounded-full"
						on:click={playArtist}
						aria-label="play"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="40"
							height="40"
							fill="#040614ff"
							viewBox="0 0 16 16"
						>
							<path
								d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"
							/>
						</svg>
					</button>

					<button
						class="btn-secondary fav text-text-primary cursor-pointer"
						aria-label="fav"
						on:click={toggleFav}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path
								d={isFav
									? "M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 2.562-3.248 8 1.314z"
									: "M8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"}
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<section class="my-8 mx-15">
			<h2 class="text-2xl flex font-bold mb-4">Popular</h2>
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

<style>
	.play {
		background: cyan;
		width: 3.75rem;
		transition:
			transform 0.2s ease-in,
			background 0.2s ease-in;
	}

	.play:hover {
		transform: scale(1.1); /* Scale the button visually */
	}
	.fav {
		transition:
			transform 0.2s ease-in,
			background 0.2s ease-in;
	}

	.fav:hover {
		transform: scale(1.2); /* Scale the button visually */
	}
</style>
