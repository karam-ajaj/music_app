import { Track } from '../types';
import { ITUNES_ARABIC_ARTISTS } from '../constants';

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

async function searchArtist(artist: string): Promise<Track[]> {
  const query = encodeURIComponent(artist);
  const url = `https://itunes.apple.com/search?term=${query}&country=eg&entity=song&limit=20`;
  const res = await fetch(url);
  const json = await res.json();
  const results = (json.results || []) as iTunesResult[];
  return results
    .filter((r) => r.previewUrl && r.trackName && r.artistName)
    .map(toTrack);
}

export async function fetchTracks(): Promise<Track[]> {
  const artistPromises = ITUNES_ARABIC_ARTISTS.map(searchArtist);
  const artistResults = await Promise.all(artistPromises);
  const allTracks = artistResults.flat();
  const unique = allTracks.filter(
    (track, idx, self) => self.findIndex((t) => t.id === track.id) === idx
  );
  return shuffle(unique);
}
