import { Track } from '../types';
import { ALL_ARTISTS, REGIONS, ALL_DECADES, ALL_REGIONS, DecadeKey, RegionKey } from '../constants';

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

const DECADE_RANGE: Record<DecadeKey, [number, number]> = {
  '70s': [1970, 1979],
  '80s': [1980, 1989],
  '90s': [1990, 1999],
};

async function searchArtist(artist: string): Promise<Track[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const query = encodeURIComponent(artist);
    const url = `https://itunes.apple.com/search?term=${query}&country=eg&entity=song&limit=30`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    const json = await res.json();
    const results = (json.results || []) as iTunesResult[];
    return results
      .filter((r) => r.previewUrl && r.trackName && r.artistName)
      .map(toTrack);
  } catch {
    return [];
  }
}

async function searchBatched(artists: string[], batchSize: number): Promise<Track[]> {
  const allTracks: Track[] = [];
  for (let i = 0; i < artists.length; i += batchSize) {
    const batch = artists.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((a) => searchArtist(a).catch(() => [])));
    allTracks.push(...results.flat());
  }
  return allTracks;
}

function filterByDecades(tracks: Track[], decades: DecadeKey[]): Track[] {
  if (decades.length === ALL_DECADES.length) return tracks;
  return tracks.filter((t) => {
    const y = parseInt(t.year, 10);
    if (isNaN(y)) return false;
    return decades.some((d) => {
      const [start, end] = DECADE_RANGE[d];
      return y >= start && y <= end;
    });
  });
}

function artistsForRegions(regions: RegionKey[]): string[] {
  if (regions.length === ALL_REGIONS.length) return ALL_ARTISTS;
  const set = new Set<string>();
  for (const r of regions) {
    const data = REGIONS.find((rd) => rd.key === r);
    if (data) data.artists.forEach((a) => set.add(a));
  }
  return [...set];
}

export async function fetchTracks(decades: DecadeKey[], regions: RegionKey[]): Promise<Track[]> {
  const artists = artistsForRegions(regions);
  const allTracks = await searchBatched(artists, 3);
  const unique = allTracks.filter(
    (track, idx, self) => self.findIndex((t) => t.id === track.id) === idx
  );
  return shuffle(filterByDecades(unique, decades));
}
