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
    const url = `https://itunes.apple.com/search?term=${query}&country=eg&entity=song&limit=10`;
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

  const enWithPreview = enResults.filter((r) => r.previewUrl && r.trackName);
  const arWithPreview = arResults.filter((r) => r.previewUrl && r.trackName);
  console.log(`${artist.en}: EN=${enWithPreview.length} AR=${arWithPreview.length}`);

  const trackMap = new Map<string, Track>();

  // First: add Arabic results (these get Arabic names)
  for (const r of arWithPreview) {
    const id = String(r.trackId);
    trackMap.set(id, makeTrack(r, artist, r.trackName));
  }

  // Build URL → Arabic name map for matching English results
  const arNameByUrl = new Map<string, string>();
  for (const r of arWithPreview) arNameByUrl.set(r.previewUrl, r.trackName);

  // Second: add English results, overwriting name to English for URL matches
  for (const r of enWithPreview) {
    const id = String(r.trackId);
    const existing = trackMap.get(id);
    const arName = arNameByUrl.get(r.previewUrl);

    if (existing) {
      existing.name = r.trackName;
      if (arName) existing.nameAr = arName;
    } else {
      // Check if this English track matches an Arabic track by preview URL
      const arMatch = [...trackMap.values()].find((t) => t.previewUrl === r.previewUrl);
      if (arMatch) {
        arMatch.name = r.trackName;
        if (!arMatch.nameAr) arMatch.nameAr = r.trackName;
      } else {
        trackMap.set(id, makeTrack(r, artist, arName || r.trackName));
      }
    }
  }

  return [...trackMap.values()];
}

function makeTrack(r: iTunesResult, artist: ArtistEntry, nameAr: string): Track {
  return {
    id: String(r.trackId),
    name: r.trackName,
    nameAr,
    artists: [artist.en],
    artistsAr: [artist.ar],
    album: r.collectionName,
    albumArt: (r.artworkUrl100 || '').replace('100x100', '600x600'),
    year: (r.releaseDate || '').slice(0, 4),
    durationMs: r.trackTimeMillis,
    previewUrl: r.previewUrl,
  };
}

async function searchBatched(artists: ArtistEntry[], batchSize: number): Promise<Track[]> {
  const allTracks: Track[] = [];
  let totalFromBatches = 0;
  for (let i = 0; i < artists.length; i += batchSize) {
    const batch = artists.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((a) => searchArtist(a).catch(() => [])));
    const batchTracks = results.flat();
    totalFromBatches += batchTracks.length;
    allTracks.push(...batchTracks);
    console.log(`batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(artists.length / batchSize)}: ${batch.length} artists → ${batchTracks.length} tracks (total: ${allTracks.length})`);
  }
  console.log('searchBatched done:', allTracks.length, 'tracks from', artists.length, 'artists');
  return allTracks;
}

function filterByDecades(tracks: Track[], decades: DecadeKey[]): Track[] {
  if (decades.length === ALL_DECADES.length) return tracks;
  let noYear = 0;
  let kept = 0;
  const result = tracks.filter((t) => {
    const y = parseInt(t.year, 10);
    if (isNaN(y)) { noYear++; return true; }
    const match = decades.some((d) => {
      const [start, end] = DECADE_RANGE[d];
      return y >= start && y <= end;
    });
    if (match) kept++;
    return match;
  });
  console.log('filterByDecades — no year:', noYear, 'matched:', kept, 'total filtered:', result.length);
  return result;
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
  console.log('artists:', artists.length);
  const allTracks = await searchBatched(artists, 5);
  console.log('allTracks from API:', allTracks.length);
  const unique = allTracks.filter(
    (track, idx, self) => self.findIndex((t) => t.id === track.id) === idx
  );
  console.log('unique tracks:', unique.length);
  const filtered = filterByDecades(unique, decades);
  console.log('after decade filter:', filtered.length);
  return shuffle(filtered);
}
