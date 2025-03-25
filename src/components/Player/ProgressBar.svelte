<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { playerStore } from "../../stores/playerStore";

	let progressInterval: number;
	let progressValue = 0;

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	}

	function handleProgressChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const newTime = parseFloat(input.value) * $playerStore.duration;
		playerStore.updateTime(newTime);

		// In a real implementation, you would seek the audio to this position
	}

	onMount(() => {
		// Update progress every second when playing
		progressInterval = window.setInterval(() => {
			if (
				$playerStore.isPlaying &&
				$playerStore.currentTrack
			) {
				const newTime = Math.min(
					$playerStore.currentTime + 1,
					$playerStore.duration,
				);
				playerStore.updateTime(newTime);

				// If we've reached the end, play the next track
				if (newTime >= $playerStore.duration) {
					playerStore.playNext();
				}
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(progressInterval);
	});

	$: progressValue =
		$playerStore.duration > 0
			? $playerStore.currentTime / $playerStore.duration
			: 0;
</script>

<div class="flex items-center gap-2 w-full pt-2">
	<span class="text-xs text-text-secondary w-10 text-right">
		{formatTime($playerStore.currentTime)}
	</span>

	<div class="relative w-full group">
		<input
			type="range"
			min="0"
			max="1"
			step="0.001"
			value={progressValue}
			on:input={handleProgressChange}
			class="w-full accent-accent cursor-pointer appearance-none bg-white/20 h-1 rounded-full outline-none
             group-hover:h-1.5 transition-all"
		/>
	</div>

	<span class="text-xs text-text-secondary w-10">
		{formatTime($playerStore.duration)}
	</span>
</div>
