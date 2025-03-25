<script lang="ts">
	import { playerStore } from "../../stores/playerStore";

	function addToFavorites() {
		// Would implement adding current track to favorites
	}
</script>

<div class="flex items-center gap-4">
	{#if $playerStore.currentTrack}
		<img
			src={$playerStore.currentTrack.albumArt ||
				"/placeholder-album.png"}
			alt={`${$playerStore.currentTrack.album} cover`}
			class="w-14 h-14 rounded shadow-lg"
		/>

		<div>
			<h4 class="font-medium">
				{$playerStore.currentTrack.title}
			</h4>
			<p class="text-sm text-text-secondary">
				{$playerStore.currentTrack.artist}
			</p>
		</div>

		<button
			class="ml-4 text-text-secondary hover:text-accent transition-colors"
			on:click={addToFavorites}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
				/>
			</svg>
		</button>
	{:else}
		<div
			class="w-14 h-14 bg-white/10 rounded flex items-center justify-center"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				fill="currentColor"
				class="text-text-secondary"
				viewBox="0 0 16 16"
			>
				<path
					d="M8 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0v-9A.5.5 0 0 1 8 3z"
				/>
				<path
					d="M8 0a.5.5 0 0 1 .5.5v.514C12.625 1.238 16 4.22 16 8c0 0 0 .5-.5.5-.149 0-.352-.145-.352-.145l-.004-.004-.025-.023a3.484 3.484 0 0 0-.555-.394A3.166 3.166 0 0 0 13 7.5c-.638 0-1.178.213-1.564.434a3.484 3.484 0 0 0-.555.394l-.025.023-.003.003s-.204.146-.353.146-.352-.145-.352-.145l-.004-.004-.025-.023a3.484 3.484 0 0 0-.555-.394 3.3 3.3 0 0 0-1.064-.39V13.5a.5.5 0 0 1-.5.5C8.149 14 7.5 13.5 7.5 13.5c0 0 0-.5.5-.5a.5.5 0 0 1 .5.5h.001l-.001-.001.002.002a.013.013 0 0 1 .005.007.53.53 0 0 1-.01-.034 3.75 3.75 0 0 1-.435-.761l-.001-.001a2.98 2.98 0 0 1-.156-.622 2.968 2.968 0 0 1 .03-1.143v-.001l.001-.001a2.98 2.98 0 0 1 .156-.621c.047-.125.091-.254.135-.397A6.954 6.954 0 0 0 8 0zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
				/>
			</svg>
		</div>
		<div>
			<h4 class="font-medium">Not Playing</h4>
			<p class="text-sm text-text-secondary">
				Select a track to play
			</p>
		</div>
	{/if}
</div>
