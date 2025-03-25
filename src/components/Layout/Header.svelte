<script lang="ts">
	import { onMount } from "svelte";
	import { navigate } from "svelte-routing";

	let searchTerm = "";
	let isScrolled = false;

	function handleSearch() {
		if (searchTerm.trim()) {
			navigate(
				`/search/${encodeURIComponent(searchTerm.trim())}`,
			);
		} else {
			navigate("/search");
		}
	}
	onMount(() => {
		const mainContent = document.querySelector(".main-content");
		if (mainContent) {
			mainContent.addEventListener("scroll", () => {
				isScrolled = mainContent.scrollTop > 10;
			});
		}
	});
</script>

<header
	class={`sticky select-none top-0 z-10 px-8 cursor-default py-4 transition-all ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
>
	<div class="flex items-center justify-center">
		<div class="flex items-center gap-4">
			<div class="relative ml-4">
				<div
					class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
				>
					<span class="material-symbols-outlined">
						Search
					</span>
				</div>
				<input
					type="search"
					bind:value={searchTerm}
					on:keydown={(e) =>
						e.key === "Enter" &&
						handleSearch()}
					placeholder="Search for songs, albums, or artists..."
					class="pl-10 pr-4 py-2 md:min-w-lg bg-white/10 rounded-full focus:outline-none focus:ring-1 focus:ring-accent focus:bg-white/20 transition-all"
				/>
			</div>
		</div>
	</div>
</header>
