<!-- src/components/Layout/Layout.svelte -->
<script lang="ts">
	import Sidebar from "./Sidebar.svelte";
	import Header from "./Header.svelte";
	import NowPlaying from "../Player/NowPlaying.svelte";
	import AudioControls from "../Player/AudioControls.svelte";
	import ProgressBar from "../Player/ProgressBar.svelte";
	import VolumeControl from "../Player/VolumeControl.svelte";
	import { onMount } from "svelte";
	import { playerStore } from "../../stores/playerStore";

	let currentVolume = 0.5;

	onMount(() => {
		// Initialize player volume
		playerStore.setVolume(currentVolume);
	});

	const handleVolumeChange = (e: CustomEvent<number>) => {
		const newVolume = e.detail;
		currentVolume = newVolume;
		playerStore.setVolume(newVolume);
	};
</script>

<div class="flex flex-col h-screen">
	<!-- Main content -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar -->
		<div
			class="w-64 bg-background-elevated flex-shrink-0 p-4 bg-white/5 select-none cursor-default"
		>
			<Sidebar />
		</div>

		<!-- Main area -->
		<div
			class="flex-1 flex flex-col overflow-hidden select-none cursor-default"
		>
			<!-- Header with search -->
			<Header />

			<!-- Content area -->
			<div
				class="flex-1 overflow-y-auto main-content animate-smooth-slide select-none cursor-default"
			>
				<!-- Router content gets inserted here -->
				<slot name="content"></slot>
			</div>
		</div>
	</div>

	<!-- Now playing bar -->
	<div
		class="h-25 bg-background-elevated border-t border-white/10 flex items-center px-4 bg-white/5 cursor-default select-none"
	>
		<div class="grid grid-cols-3 w-full select-none cursor-default">
			<NowPlaying />

			<div
				class="flex flex-col items-center justify-center select-none cursor-default"
			>
				<AudioControls />
				<ProgressBar />
			</div>

			<div
				class="flex justify-end items-center select-none cursor-default"
			>
				<VolumeControl
					volume={$playerStore.volume}
					on:volumeChange={handleVolumeChange}
				/>
			</div>
		</div>
	</div>
</div>
