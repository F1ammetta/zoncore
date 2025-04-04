<script lang="ts">
	import { onMount } from "svelte";
	import {
		getAlbum,
		getCoverArtUrl,
		star,
		unstar,
	} from "../../lib/subsonicService";
	import TrackList from "./TrackList.svelte";
	import { playerStore } from "../../stores/playerStore";
	import { Link } from "svelte-routing";

	export let albumId: string;

	let album: any = null;
	let tracks: any[] = [];
	let loading = true;
	let error = "";

	let isFav = false;

	async function toggleFav() {
		if (isFav) {
			isFav = !(await unstar(albumId, "album"));
		} else {
			isFav = await star(albumId, "album");
		}
	}

	async function loadAlbum() {
		loading = true;
		error = "";
		try {
			// Call the API to retrieve album details.
			const albumData = await getAlbum(albumId);

			if (albumData) {
				album = albumData;
				// Check your API response format. Typically, songs might be in albumData.song.
				if (
					albumData.song &&
					Array.isArray(albumData.song)
				) {
					isFav = !!albumData.starred;
					tracks = albumData.song.map(
						(song: any) => ({
							id: song.id,
							title: song.title,
							artist: song.artist,
							album: song.album,
							// Use getCoverArtUrl to form the URL dynamically.
							albumArt: song.coverArt
								? getCoverArtUrl(
										song.coverArt,
									)
								: null,
							duration: song.duration,
						}),
					);
				}
			}
		} catch (err) {
			console.error("Failed to load album:", err);
			error = "Failed to load album. Please try again.";
		} finally {
			loading = false;
		}
	}

	// Start loading the album when the component mounts
	onMount(() => {
		loadAlbum();
	});

	function playAlbum() {
		if (tracks.length > 0) {
			playerStore.setTrack(tracks[0]);
			playerStore.clearQueue();
			if (tracks.length > 1) {
				playerStore.addToQueue(tracks.slice(1));
			}
		}
	}
</script>

{#if loading}
	<div class="flex justify-center items-center py-20 select-none">
		<div
			class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"
		></div>
	</div>
{:else if error}
	<div class="bg-red-500/20 text-red-200 p-4 rounded-md select-none">
		{error}
	</div>
{:else if album}
	<div
		class="flex flex-col md:flex-row gap-8 mb-8 select-none cursor-default"
	>
		<div class="md:w-64 flex-shrink-0 ml-10">
			<img
				src={tracks[0].albumArt}
				alt={`${album.name} cover`}
				class="w-full aspect-square object-cover rounded-md shadow-lg select-none"
			/>
		</div>

		<div class="flex flex-col justify-end">
			<h1 class="text-4xl font-bold mb-2">
				{album.name}
			</h1>
			<Link to={`/artist/${album.artistId}`}
				><p class="text-xl mb-2">
					{album.artist}
				</p></Link
			>
			<div class="text-text-secondary mb-4">
				<span>{album.year}</span>
				<span class="mx-1">•</span>
				<span
					>{album.songCount || tracks.length} songs</span
				>
				{#if album.genre}
					<span class="mx-1">•</span>
					<span>{album.genre}</span>
				{/if}
			</div>

			<div class="flex gap-4">
				<button
					class="btn-primary play flex items-center gap-2 cursor-pointer mr-6 text-center align-middle justify-center aspect-square rounded-full"
					on:click={playAlbum}
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
					class="btn-secondary fav text-text-primary"
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

	<div class="mt-8 px-10 select-none cursor-default">
		<TrackList {tracks} showAlbum={false} showArtist={false} />
	</div>
{:else}
	<div class="bg-white/5 p-8 rounded-md text-center select-none">
		<h2 class="text-2xl mb-4">Album not found</h2>
		<p class="text-text-secondary">
			The album you're looking for doesn't exist or you don't
			have access to it.
		</p>
	</div>
{/if}

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
