<script lang="ts">
	import { playerStore } from "../../stores/playerStore";

	function togglePlay() {
		if ($playerStore.isPlaying) {
			playerStore.pause();
		} else {
			playerStore.play();
		}
	}

	function skipNext() {
		playerStore.playNext();
	}

	function skipPrevious() {
		// Would implement logic to go to previous track or restart current track
		// For now, just restart the current track
		if ($playerStore.currentTrack) {
			playerStore.updateTime(0);
		}
	}

	function toggleShuffle() {
		// Would toggle shuffle mode in the player store
	}

	function toggleRepeat() {
		// Would cycle through repeat modes (off, all, one) in the player store
	}
</script>

<div class="flex flex-col items-center">
	<div class="flex items-center gap-4 mb-2">
		<button
			class="text-text-secondary hover:text-text-primary transition-colors"
			on:click={toggleShuffle}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					fill-rule="evenodd"
					d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"
				/>
				<path
					d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"
				/>
			</svg>
		</button>

		<button
			class="text-text-secondary hover:text-text-primary transition-colors"
			on:click={skipPrevious}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="28"
				height="28"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
				/>
			</svg>
		</button>

		<button
			class=" rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transition-transform"
			on:click={togglePlay}
		>
			{#if $playerStore.isPlaying}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="30"
					height="30"
					fill="currentColor"
					viewBox="0 0 16 16"
				>
					<path
						d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="30"
					height="30"
					fill="currentColor"
					viewBox="0 0 16 16"
				>
					<path
						d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"
					/>
				</svg>
			{/if}
		</button>

		<button
			class="text-text-secondary hover:text-text-primary transition-colors"
			on:click={skipNext}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="28"
				height="28"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
				/>
			</svg>
		</button>

		<button
			class="text-text-secondary hover:text-text-primary transition-colors"
			on:click={toggleRepeat}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
				/>
				<path
					fill-rule="evenodd"
					d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
				/>
			</svg>
		</button>
	</div>
</div>
