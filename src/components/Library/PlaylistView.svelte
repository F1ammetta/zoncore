<script lang="ts">
	import { onMount } from "svelte";
	import { getPlaylist, getCoverArtUrl } from "../../lib/subsonicService";
	import TrackList from "./TrackList.svelte";
	import { playerStore } from "../../stores/playerStore";
	import type { PlaylistWithSongs } from "subsonic-api";

	export let playlistId: string;

	let playlist: PlaylistWithSongs;
	let tracks: any[] = [];
	let loading = true;
	let error = "";

	async function loadAlbum() {
		loading = true;
		error = "";
		try {
			// Call the API to retrieve album details.
			const playlistData = await getPlaylist(playlistId);

			if (playlistData) {
				playlist = playlistData;
				console.log(playlist);
				// Check your API response format. Typically, songs might be in albumData.song.
				if (
					playlistData.entry &&
					Array.isArray(playlistData.entry)
				) {
					tracks = playlistData.entry.map(
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

	function playList() {
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
{:else if playlist}
	<div
		class="flex flex-col md:flex-row gap-8 mb-8 select-none cursor-default"
	>
		<div class="md:w-64 flex-shrink-0 ml-10">
			<img
				src={getCoverArtUrl(playlist.id)}
				alt={`${playlist.name} cover`}
				class="w-full aspect-square object-cover rounded-md shadow-lg select-none"
			/>
		</div>

		<div class="flex flex-col justify-end">
			<h1 class="text-4xl font-bold mb-2">
				{playlist.name}
			</h1>
			<p class="text-xl mb-2">{playlist.owner}</p>
			<div class="text-text-secondary mb-4">
				<span
					>{playlist.created
						.toString()
						.split("-")[0]}</span
				>
				<span class="mx-1">•</span>
				<span
					>{playlist.songCount || tracks.length} songs</span
				>
			</div>

			<div class="flex gap-4 mt-4">
				<button
					class="btn-primary flex items-center gap-2"
					on:click={playList}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"
						/>
					</svg>
					Play
				</button>

				<button class="btn-secondary text-text-primary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<div class="mt-8 px-10 select-none cursor-default">
		<TrackList
			{tracks}
			showAlbum={true}
			showArtist={true}
			showHeader={true}
		/>
	</div>
{:else}
	<div class="bg-white/5 p-8 rounded-md text-center select-none">
		<h2 class="text-2xl mb-4">Playlist not found</h2>
		<p class="text-text-secondary">
			The Playlist you're looking for doesn't exist or you
			don't have access to it.
		</p>
	</div>
{/if}
