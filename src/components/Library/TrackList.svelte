<script lang="ts">
	import { Link } from "svelte-routing";
	import { playerStore, type Track } from "../../stores/playerStore";

	export let tracks: Track[] = [];
	export let showAlbum = true;
	export let showArtist = true;
	export let showHeader = true;
	export let showCover = true;

	function formatDuration(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}

	function playTrack(track: Track, index: number) {
		playerStore.setTrack(track);
		const remainingTracks = tracks.slice(index + 1);
		playerStore.clearQueue();
		if (remainingTracks.length > 0) {
			playerStore.addToQueue(remainingTracks);
		}
	}
</script>

<div class="w-full select-none cursor-default">
	<table class="w-full text-left">
		{#if showHeader}
			<thead
				class="border-b border-white/10 top-0 bg-background z-10"
			>
				<tr>
					<th class="py-2 w-12 text-center">#</th>
					<th class="py-2 pl-2">Title</th>
					{#if showArtist}
						<th class="py-2">Artist</th>
					{/if}
					{#if showAlbum}
						<th class="py-2">Album</th>
					{/if}
					<th class="py-2 text-right pr-4">
						<span
							class="material-symbols-outlined icon-nofill"
						>
							schedule
						</span>
					</th>
				</tr>
			</thead>
		{/if}
		<tbody>
			{#each tracks as track, i}
				<tr
					class="hover:bg-white/5 cursor-pointer group h-12 transition-colors rounded-lg"
					on:click={() => playTrack(track, i)}
				>
					<td
						class="text-center rounded-l-lg w-14"
					>
						<span class="group-hover:hidden"
							>{i + 1}</span
						>
						<span
							class="hidden group-hover:inline text-accent"
						>
							<span
								class="material-symbols-outlined icon icon-fill self-center align-middle"
							>
								Play_Arrow
							</span>
						</span>
					</td>
					<td class="py-2 pl-2">
						<div
							class="flex items-center gap-3"
						>
							{#if (track.albumArt && !showHeader) || showCover}
								<img
									src={track.albumArt}
									alt="Album art"
									class="w-10 h-10 rounded shadow"
								/>
							{/if}
							<span
								>{track.title}</span
							>
						</div>
					</td>
					{#if showArtist}
						<td
							class="self-center align-middle hover:underline text-text-secondary"
						>
							<Link
								to={`/artist/${track.artistId}`}
							>
								{track.artist}
							</Link>
						</td>
					{/if}
					{#if showAlbum}
						<td
							class="self-center align-middle hover:underline text-text-secondary"
						>
							<Link
								to={`/album/${track.albumId}`}
							>
								{track.album}
							</Link>
						</td>
					{/if}
					<td
						class="py-2 text-text-secondary text-right pr-4 rounded-r-lg"
					>
						{formatDuration(track.duration)}
					</td>
				</tr>
			{/each}
			{#if tracks.length === 0}
				<tr>
					<td
						colspan={showAlbum && showArtist
							? 5
							: showAlbum ||
								  showArtist
								? 4
								: 3}
						class="py-8 text-center text-text-secondary"
					>
						No tracks found
					</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
