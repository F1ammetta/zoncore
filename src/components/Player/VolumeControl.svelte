<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let volume: number = 0.5;

	const dispatch = createEventDispatcher<{ volumeChange: number }>();
	const root: any = document.querySelector(":root");

	function handleVolumeChange(e: Event) {
		const input = e.target as HTMLInputElement;

		const newVolume = parseFloat(input.value);
		dispatch("volumeChange", newVolume);
	}

	$: {
		const volStr = `${Math.floor(volume * 100)}%`;
		root.style.setProperty("--range-progress", volStr);
	}

	function toggleMute() {
		if (volume > 0) {
			dispatch("volumeChange", 0);
		} else {
			dispatch("volumeChange", 0.5);
		}
	}
</script>

<div class="flex items-center gap-2 select-none cursor-default">
	<button
		class="text-text-secondary hover:text-text-primary transition-colors"
		on:click={toggleMute}
	>
		{#if volume === 0}
			<span
				class="material-symbols-outlined self-center align-middle"
			>
				Volume_Off
			</span>
		{:else if volume < 0.5}
			<span
				class="material-symbols-outlined self-center align-middle"
			>
				Volume_Down
			</span>
		{:else}
			<span
				class="material-symbols-outlined self-center align-middle"
			>
				Volume_Up
			</span>
		{/if}
	</button>

	<div class="volume-slider-container w-30 mr-5">
		<div
			class="volume-slider-progress"
			style="width: {volume * 100}%;"
		></div>
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			bind:value={volume}
			on:input={handleVolumeChange}
			class="volume-slider select-none"
		/>
	</div>
</div>

<style>
	.volume-slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: cyan;
		outline: none;
		position: relative;
		z-index: 2;
	}

	input[type="range"] {
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
	}

	input[type="range"]::-moz-range-track {
		height: 6px;
		border-radius: 3px;
		background: rgba(255, 255, 255, 100);
	}

	input[type="range"]::-webkit-slider-runnable-track {
		height: 6px;
		background: rgb(107, 107, 107);
		background: linear-gradient(
			to right,
			cyan 0%,
			cyan var(--range-progress),
			rgba(107, 107, 107, 0.65) var(--range-progress),
			rgba(107, 107, 107, 0.65) 100%
		);
		border-radius: 3px;
	}

	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: cyan;
		margin-top: -4px;
		cursor: pointer;
	}

	input[type="range"]::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: cyan;
		border: none;
		cursor: pointer;
	}

	input[type="range"]::-moz-range-track {
		background: rgba(255, 255, 255, 0);
	}

	input[type="range"]::-moz-range-progress {
		background: cyan;
	}
</style>
