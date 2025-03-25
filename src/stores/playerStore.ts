import { writable, derived } from 'svelte/store';
import { getStreamUrl } from '../lib/subsonicService';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId?: string;
  albumArt?: string;
  artistId?: string;
  duration: number;
  streamUrl?: string;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Track[];
  shuffleMode: boolean;
  repeatMode: 'off' | 'all' | 'one';
}


// Create an audio element for playback
let audioElement: HTMLAudioElement;



if (typeof window !== 'undefined') {
  audioElement = new Audio();

  // This ensures the audio element is created only in browser environments
  audioElement.addEventListener('ended', () => {
    playerStore.playNext();
  });

  audioElement.addEventListener('timeupdate', () => {
    playerStore.updateTime(audioElement.currentTime);
  });

  audioElement.addEventListener('loadedmetadata', () => {
    playerStore.update(state => ({
      ...state,
      duration: audioElement.duration
    }));
  });
}

const createPlayerStore = () => {
  const initialState: PlayerState = {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.5,
    queue: [],
    shuffleMode: false,
    repeatMode: "off"
  };

  const { subscribe, set, update } = writable<PlayerState>(initialState);

  return {
    subscribe,

    play: () => {
      if (audioElement) {
        audioElement.play().catch(err => console.error('Error playing audio:', err));
        update(state => ({ ...state, isPlaying: true }));
      }
    },

    pause: () => {
      if (audioElement) {
        audioElement.pause();
        update(state => ({ ...state, isPlaying: false }));
      }
    },

    setTrack: (track: Track) => {
      if (audioElement) {
        // If track has a streamUrl, use it, otherwise get it from the API
        const streamUrl = track.streamUrl || getStreamUrl(track.id);

        audioElement.src = streamUrl;
        audioElement.load();
        audioElement.play().catch(err => console.error('Error playing track:', err));

        update(state => ({
          ...state,
          currentTrack: { ...track, streamUrl },
          duration: track.duration || 0,
          currentTime: 0,
          isPlaying: true
        }));
      }
    },

    updateTime: (time: number) => {
      update(state => ({
        ...state,
        currentTime: time
      }));
    },

    seek: (time: number) => {
      if (audioElement) {
        audioElement.currentTime = time;
      }
    },

    setVolume: (volume: number) => {
      if (audioElement) {
        audioElement.volume = volume;
      }
      update(state => ({ ...state, volume }));
    },

    addToQueue: (tracks: Track[]) => {
      update(state => ({
        ...state,
        queue: [...state.queue, ...tracks]
      }));
    },

    clearQueue: () => update(state => ({ ...state, queue: [] })),

    playNext: () => {
      update(state => {
        if (state.queue.length === 0) {
          if (state.repeatMode === 'all' && state.currentTrack) {
            // If repeat all is on and we have a current track, play it again
            if (audioElement) {
              audioElement.currentTime = 0;
              audioElement.play().catch(err => console.error('Error replaying track:', err));
            }
            return state;
          } else if (state.repeatMode === 'one' && state.currentTrack) {
            // If repeat one is on, just restart the current track
            if (audioElement) {
              audioElement.currentTime = 0;
              audioElement.play().catch(err => console.error('Error replaying track:', err));
            }
            return state;
          } else {
            // No tracks in queue and no repeat, stop playback
            if (audioElement) {
              audioElement.pause();
            }
            return { ...state, isPlaying: false };
          }
        }

        // Get next track from queue (with shuffle if enabled)
        let nextIndex = 0;
        if (state.shuffleMode) {
          nextIndex = Math.floor(Math.random() * state.queue.length);
        }

        const nextTrack = state.queue[nextIndex];
        const newQueue = [...state.queue];
        newQueue.splice(nextIndex, 1);

        // Set the new track
        if (audioElement) {
          const streamUrl = nextTrack.streamUrl || getStreamUrl(nextTrack.id);
          audioElement.src = streamUrl;
          audioElement.load();
          audioElement.play().catch(err => console.error('Error playing next track:', err));
        }

        return {
          ...state,
          currentTrack: nextTrack,
          duration: nextTrack.duration || 0,
          currentTime: 0,
          queue: newQueue,
          isPlaying: true
        };
      });
    },

    toggleShuffle: () => {
      update(state => ({ ...state, shuffleMode: !state.shuffleMode }));
    },

    toggleRepeat: () => {
      update(state => {
        const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(state.repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        return { ...state, repeatMode: modes[nextIndex] };
      });
    }
  };
};

export const playerStore = createPlayerStore();

// Derived stores for specific parts of the state
export const currentTrack = derived(playerStore, $store => $store.currentTrack);
export const isPlaying = derived(playerStore, $store => $store.isPlaying);
export const currentTime = derived(playerStore, $store => $store.currentTime);
export const duration = derived(playerStore, $store => $store.duration);
export const volume = derived(playerStore, $store => $store.volume);

