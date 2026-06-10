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

type ArtistEntry = { en: string; ar: string };

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DECADE_RANGE: Record<DecadeKey, [number, number]> = {
  '70s': [1970, 1979],
  '80s': [1980, 1989],
  '90s': [1990, 1999],
};

async function fetchFromItunes(term: string): Promise<iTunesResult[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const query = encodeURIComponent(term);
    const url = `https://itunes.apple.com/search?term=${query}&country=eg&entity=song&limit=30`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    const json = await res.json();
    return (json.results || []) as iTunesResult[];
  } catch {
    return [];
  }
}

async function searchArtist(artist: ArtistEntry): Promise<Track[]> {
  const [enResults, arResults] = await Promise.all([
    fetchFromItunes(artist.en),
    fetchFromItunes(artist.ar),
  ]);

  const arNameByUrl = new Map<string, string>();
  for (const r of arResults) {
    if (r.previewUrl && r.trackName) {
      arNameByUrl.set(r.previewUrl, r.trackName);
    }
  }

  const trackMap = new Map<string, Track>();
  for (const r of enResults) {
    if (!r.previewUrl || !r.trackName || !r.artistName) continue;
    const id = String(r.trackId);
    if (trackMap.has(id)) continue;
    const arName = arNameByUrl.get(r.previewUrl) || r.trackName;
    trackMap.set(id, {
      id,
      name: r.trackName,
      nameAr: arName,
      artists: [artist.en],
      artistsAr: [artist.ar],
      album: r.collectionName,
      albumArt: (r.artworkUrl100 || '').replace('100x100', '600x600'),
      year: (r.releaseDate || '').slice(0, 4),
      durationMs: r.trackTimeMillis,
      previewUrl: r.previewUrl,
    });
  }

  for (const r of arResults) {
    if (!r.previewUrl || !r.trackName || !r.artistName) continue;
    const id = String(r.trackId);
    if (trackMap.has(id)) continue;
    if ([...trackMap.values()].some((t) => t.previewUrl === r.previewUrl)) continue;
    trackMap.set(id, {
      id,
      name: r.trackName,
      nameAr: r.trackName,
      artists: [artist.en],
      artistsAr: [artist.ar],
      album: r.collectionName,
      albumArt: (r.artworkUrl100 || '').replace('100x100', '600x600'),
      year: (r.releaseDate || '').slice(0, 4),
      durationMs: r.trackTimeMillis,
      previewUrl: r.previewUrl,
    });
  }

  return [...trackMap.values()];
}

async function searchBatched(artists: ArtistEntry[], batchSize: number): Promise<Track[]> {
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

function artistsForRegions(regions: RegionKey[]): ArtistEntry[] {
  if (regions.length === ALL_REGIONS.length) return ALL_ARTISTS;
  const map = new Map<string, ArtistEntry>();
  for (const r of regions) {
    const data = REGIONS.find((rd) => rd.key === r);
    if (data) data.artists.forEach((a) => map.set(a.en, a));
  }
  return [...map.values()];
}

export async function fetchTracks(decades: DecadeKey[], regions: RegionKey[]): Promise<Track[]> {
  console.log('fetchTracks — decades:', decades, 'regions:', regions);
  const artists = artistsForRegions(regions);
  console.log('artists for regions:', artists.length);
  const allTracks = await searchBatched(artists, 3);
  console.log('allTracks from API:', allTracks.length);
  const unique = allTracks.filter(
    (track, idx, self) => self.findIndex((t) => t.id === track.id) === idx
  );
  console.log('unique tracks:', unique.length);
  const filtered = filterByDecades(unique, decades);
  console.log('after decade filter:', filtered.length);
  return shuffle(filtered);
}
