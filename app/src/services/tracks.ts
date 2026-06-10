import { Track } from '../types';
import { ITUNES_ARABIC_ARTISTS, Decade } from '../constants';

interface iTunesResult {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl: string;
  trackTimeMillis: number;
  releaseDate: string;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toTrack(item: iTunesResult): Track {
  return {
    id: String(item.trackId),
    name: item.trackName,
    artists: [item.artistName],
    album: item.collectionName,
    albumArt: item.artworkUrl100?.replace('100x100', '600x600') || '',
    year: (item.releaseDate || '').slice(0, 4),
    durationMs: item.trackTimeMillis,
    previewUrl: item.previewUrl,
  };
}

const DECADE_RANGE: Record<Decade, [number, number]> = {
  '70s': [1970, 1979],
  '80s': [1980, 1989],
  '90s': [1990, 1999],
  all: [0, 9999],
};

async function searchArtist(artist: string): Promise<Track[]> {
  const query = encodeURIComponent(artist);
  const url = `https://itunes.apple.com/search?term=${query}&country=eg&entity=song&limit=30`;
  const res = await fetch(url);
  const json = await res.json();
  const results = (json.results || []) as iTunesResult[];
  return results
    .filter((r) => r.previewUrl && r.trackName && r.artistName)
    .map(toTrack);
}

async function searchBatched(artists: string[], batchSize: number): Promise<Track[]> {
  const allTracks: Track[] = [];
  for (let i = 0; i < artists.length; i += batchSize) {
    const batch = artists.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(searchArtist));
    allTracks.push(...results.flat());
  }
  return allTracks;
}

function filterByDecade(tracks: Track[], decade: Decade): Track[] {
  const [start, end] = DECADE_RANGE[decade];
  return tracks.filter((t) => {
    const y = parseInt(t.year, 10);
    return !isNaN(y) && y >= start && y <= end;
  });
}

export async function fetchTracks(decade: Decade = 'all'): Promise<Track[]> {
  const allTracks = await searchBatched(ITUNES_ARABIC_ARTISTS, 5);
  const unique = allTracks.filter(
    (track, idx, self) => self.findIndex((t) => t.id === track.id) === idx
  );
  return shuffle(filterByDecade(unique, decade));
}
