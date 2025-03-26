<script lang="ts">
	import { onMount } from "svelte";
	import {
		getCoverArtUrl,
		getAlbums,
		sorts,
		sortOptions,
	} from "../../lib/subsonicService";
	import { connectionStatus } from "../../lib/subsonicService";
	import { Link } from "svelte-routing";
	// import { playerStore, type Track } from "../../stores/playerStore";

	let albums: any[] = [];
	let offset = 0;
	let pageSize = 28;
	let loading = true;

	let dropdown: Element;
	let dropdownButton: Element;

	let showDropdown = false;

	let sortType: string = "alphabeticalByName";

	async function handleSort(i: number) {
		if (sorts[i] == sortType) {
			sortType = sorts[sorts.length - i];
		}
		sortType = sorts[i];
		showDropdown = false;
	}

	async function loadData() {
		loading = true;
		try {
			albums = await getAlbums(sortType, pageSize, offset);
		} catch (error) {
			console.error("Error loading data:", error);
		} finally {
			loading = false;
		}
	}

	function getAlbumUrl(albumId: string) {
		return `/album/${albumId}`;
	}

	onMount(() => {
		window.addEventListener("mousedown", (e) => {
			if (showDropdown) {
				const { x, y, width, height } =
					dropdown.getBoundingClientRect();
				if (
					e.x < x ||
					e.x > x + width ||
					e.y < y ||
					e.y > y + height
				) {
					const { x, y, width, height } =
						dropdownButton.getBoundingClientRect();
					if (
						e.x < x ||
						e.x > x + width ||
						e.y < y ||
						e.y > y + height
					) {
						showDropdown = false;
					}
				}
			}
		});
		if ($connectionStatus === "connected") {
			loadData();
		}
	});

	// Reload data when connection status changes to connected
	$: if ($connectionStatus === "connected" || sortType) {
		loadData();
	}
</script>

<div class="p-4 select-none">
	{#if loading}
		<div class="flex justify-center items-center py-20">
			<div
				class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"
			></div>
		</div>
	{:else if $connectionStatus !== "connected"}
		<div class="p-8 text-center">
			<h2 class="text-2xl font-bold mb-4">Not Connected</h2>
			<p class="text-text-secondary mb-4">
				Connect to a Subsonic server to start listening
				to music.
			</p>
		</div>
	{:else}
		<!-- Recent Albums -->
		<section class="mb-8 mx-10">
			<div class="flex flex-row justify-between">
				<h2
					class="text-2xl flex font-bold mb-6 cursor-default"
				>
					Albums
				</h2>

				<div class="relative">
					<button
						class="rounded-md p-2 pb-0.5 hover:bg-gray-700"
						on:click={() =>
							(showDropdown =
								!showDropdown)}
						title="Sort"
						bind:this={dropdownButton}
					>
						<span
							class="material-symbols-outlined"
							>sort</span
						>
					</button>
					{#if showDropdown}
						<div
							class="absolute z-10 right-0 mt-2 w-48 rounded-lg border border-gray-700 bg-gray-800 shadow-lg"
							bind:this={dropdown}
						>
							<div class="py-1">
								{#each sortOptions as option, i}
									<div
										class="cursor-pointer px-4 py-2 text-sm hover:bg-white/5"
										on:click={() =>
											handleSort(
												i,
											)}
										on:keypress={() => {}}
										role="button"
										tabindex="0"
									>
										Sort
										by
										{option}
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
			<div
				class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4"
			>
				{#each albums as album}
					<Link to={getAlbumUrl(album.id)}>
						<div
							class="p-4 bg-white/5 rounded-md hover:bg-white/10 transition-all cursor-pointer"
						>
							<div
								class="aspect-square overflow-hidden rounded-md mb-2 bg-white/5"
							>
								<img
									src={getCoverArtUrl(
										album.id,
									)}
									alt={album.name}
									class="w-full h-full object-cover transition-all hover:scale-105"
								/>
							</div>
							<h3
								class="font-medium truncate"
							>
								{album.name}
							</h3>
							<p
								class="text-sm text-text-secondary truncate"
							>
								{album.artist}
							</p>
						</div>
					</Link>
				{/each}
			</div>
		</section>
	{/if}
</div>
