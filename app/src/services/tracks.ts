import { Track } from '../types';
import { DATA_SOURCE, API_BASE_URL } from '../constants';
import tracksData from '../data/tracks.json';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function fetchTracks(): Promise<Track[]> {
  switch (DATA_SOURCE) {
    case 'local':
      return shuffle(tracksData as Track[]);
    case 'api': {
      const res = await fetch(`${API_BASE_URL}/api/tracks`);
      const json = await res.json();
      return json as Track[];
    }
  }
}
