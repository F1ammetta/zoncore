<script lang="ts">
  import HomeView from "./components/Library/HomeView.svelte";
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";
  import { playerStore } from "./stores/playerStore";
  import AlbumView from "./components/Library/AlbumView.svelte";
  import PlaylistView from "./components/Library/PlaylistView.svelte";
  import ArtistView from "./components/Library/ArtistView.svelte";
  import Layout from "./components/Layout/Layout.svelte";
  import SearchView from "./components/Library/SearchView.svelte";

  let currentVolume = 0.5;

  let url = "/";

  onMount(() => {
    // Initialize player volume
    playerStore.setVolume(currentVolume);
  });

  function togglePlay() {
    if ($playerStore.isPlaying) {
      playerStore.pause();
    } else {
      playerStore.play();
    }
  }

  const handleVolumeChange = (e: CustomEvent<number>) => {
    const newVolume = e.detail;
    currentVolume = newVolume;
    playerStore.setVolume(newVolume);
  };

  window.addEventListener("popstate", () => {
    console.log(url);
  });

  window.addEventListener("keydown", (e) => {
    console.log(e.key);
    switch (e.key) {
      case " ":
        togglePlay();
    }
  });
</script>

<Router {url}>
  <Layout>
    <div slot="content">
      <Route path="/" component={HomeView} />
      <Route path="/album/:id" let:params>
        <AlbumView albumId={params.id} />
      </Route>
      <Route path="/artist/:id" let:params>
        <ArtistView artistId={params.id} />
      </Route>
      <Route path="/playlist/:id" let:params>
        <PlaylistView playlistId={params.id} />
      </Route>
      <Route path="/search" component={SearchView} />
      <Route path="/search/:query" let:params>
        <SearchView query={params.query} />
      </Route>
    </div>
  </Layout>
</Router>
