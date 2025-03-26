import { SubsonicAPI } from 'subsonic-api';
import { writable, get } from 'svelte/store';

export interface SubsonicSettings {
  serverUrl: string;
  username: string;
  password: string;
  useSalt?: boolean;
}

export const sorts = [
  "alphabeticalByName",
  "alphabeticalByArtist",
  "frequent",
  "recent",
  "newest",
  "highest",
  "random",
];

export const sortOptions = [
  "Name",
  "Artist",
  "Frequently Played",
  "Recently Played",
  "Newest",
  "Highest Rated",
  "Random",
];

// Persistent settings store
export const subsonicSettings = writable<SubsonicSettings | null>(
  JSON.parse(localStorage.getItem('subsonicSettings') || 'null')
);

// Subscribe to changes and save to localStorage
subsonicSettings.subscribe(value => {
  if (value) {
    localStorage.setItem('subsonicSettings', JSON.stringify(value));
  }
});

// Connection status store
export const connectionStatus = writable<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
export const connectionError = writable<string | null>(null);

let apiInstance: SubsonicAPI | null = null;

export function getApi() {
  if (!apiInstance) {
    const settings = get(subsonicSettings);
    if (!settings) {
      throw new Error('No Subsonic settings available');
    }
    initializeApi(settings);
  }
  return apiInstance;
}

export function initializeApi(settings: SubsonicSettings) {
  apiInstance = new SubsonicAPI({
    url: settings.serverUrl,
    auth: {
      username: settings.username,
      password: settings.password,
    },
    reuseSalt: settings.useSalt ?? true,
  });

  return apiInstance;
}

export async function testConnection(settings: SubsonicSettings): Promise<boolean> {
  connectionStatus.set('connecting');
  connectionError.set(null);

  try {
    const testApi = initializeApi(settings);
    const response = await testApi?.ping();

    if (response?.status === 'ok') {
      connectionStatus.set('connected');
      subsonicSettings.set(settings);
      return true;
    } else {
      connectionStatus.set('error');
      connectionError.set(response?.error?.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    connectionStatus.set('error');
    connectionError.set(error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

// --- Album Methods ---
export async function getAlbums(type = 'alphabeticalByName', size = 50, offset = 0) {
  const api = getApi();
  const response = await api?.getAlbumList2({ type, size, offset });
  return response?.albumList2?.album || [];
}

export async function getAlbum(id: string) {
  const api = getApi();
  const response = await api?.getAlbum({ id });
  return response?.album;
}

export async function getRandomAlbums(size = 10) {
  const api = getApi();
  const response = await api?.getAlbumList2({ type: 'random', size });
  return response?.albumList2?.album || [];
}

export async function getRecentAlbums(size = 10) {
  const api = getApi();
  const response = await api?.getAlbumList2({ type: 'newest', size });

  return response?.albumList2?.album || [];
}

// --- Artist Methods ---
export async function getArtists() {
  const api = getApi();
  const response = await api?.getArtists();
  return response?.artists?.index?.flatMap(index => index.artist || []) || [];
}

export async function getArtist(id: string) {
  const api = getApi();
  const response = await api?.getArtist({ id });
  return response?.artist;
}

// --- Playlist Methods ---
export async function getPlaylists() {
  const api = getApi();
  const response = await api?.getPlaylists();
  return response?.playlists?.playlist || [];
}

export async function getPlaylist(id: string) {
  const api = getApi();
  const response = await api?.getPlaylist({ id });
  return response?.playlist;
}

// --- Track Methods ---
export async function getRandomSongs(size = 20) {
  const api = getApi();
  const response = await api?.getRandomSongs({ size });
  return response?.randomSongs?.song || [];
}

export async function getSongArtistId(id: string) {
  const api = getApi();
  const response = await api?.getSong({ id });
  return response?.song.artistId!;
}

export async function getSongAlbumId(id: string) {
  const api = getApi();
  const response = await api?.getSong({ id });
  return response?.song.albumId!;
}

export async function getTopSongs(artist: string) {
  const api = getApi();
  const response = await api?.getTopSongs({ artist: artist });
  return response?.topSongs.song;
}

// --- General Methods ---
export async function getStarred() {
  const api = getApi();
  const response = await api?.getStarred2();
  return response?.starred2!;
}

export async function star(id: string, type: "song" | "album" | "artist") {
  const api = getApi();
  const response = await api?.star({
    id: (type == "song" ? id : undefined),
    albumId: (type == "album" ? id : undefined),
    artistId: (type == "artist" ? id : undefined),
  }
  );
  return !!response;
}

export async function unstar(id: string, type: "song" | "album" | "artist") {
  const api = getApi();
  const response = await api?.unstar({
    id: (type == "song" ? id : undefined),
    albumId: (type == "album" ? id : undefined),
    artistId: (type == "artist" ? id : undefined),
  }
  );
  return !!response;
}

// --- URL Helpers ---
export function getStreamUrl(id: string) {
  const api = getApi();
  // The SubsonicAPI class doesn't have a direct getStreamUrl method, so we craft the URL
  const settings = get(subsonicSettings);

  if (!settings) throw new Error('No Subsonic settings available');

  // Construct a basic URL for streaming
  // Note: This is a simplified approach and might need to be customized
  return `${settings.serverUrl}/rest/stream?id=${id}&u=${settings.username}&p=${settings.password}&v=1.16.1&c=CyanPlayer&f=json`;
}

export function getCoverArtUrl(id: string) {
  const api = getApi();
  // The SubsonicAPI class doesn't have a direct getCoverArtUrl method, so we craft the URL
  const settings = get(subsonicSettings);

  if (!settings) throw new Error('No Subsonic settings available');

  // Construct a basic URL for cover art
  return `${settings.serverUrl}/rest/getCoverArt?id=${id}&u=${settings.username}&p=${settings.password}&v=1.16.1&c=CyanPlayer&f=json`;
}

// --- Search Methods ---
export async function search(query: string) {
  const api = getApi();
  const response = await api?.search3({ query });
  return {
    artists: response?.searchResult3?.artist || [],
    albums: response?.searchResult3?.album || [],
    songs: response?.searchResult3?.song || []
  };
}

// --- Mapping Methods ---
export function mapTrack(track: any) {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    albumId: track.albumId,
    duration: track.duration,
    albumArt: track.coverArt ? getCoverArtUrl(track.coverArt) : null,
    streamUrl: getStreamUrl(track.id),
    track: track.track,
    year: track.year,
    genre: track.genre,
    size: track.size,
    contentType: track.contentType,
    suffix: track.suffix,
    bitRate: track.bitRate,
  };
}

