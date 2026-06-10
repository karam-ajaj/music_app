const https = require('https');

const PLAYLIST_ID = process.env.PLAYLIST_ID || '37i9dQZF1DXaHuo0R6jTxZ';
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const OUTPUT_PATH = process.env.OUTPUT_PATH || '../app/src/data/tracks.json';

function fetch(url, opts = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
      res.on('error', reject);
    });
  });
}

async function getAccessToken() {
  const body = `grant_type=client_credentials&client_id=${encodeURIComponent(SPOTIFY_CLIENT_ID)}&client_secret=${encodeURIComponent(SPOTIFY_CLIENT_SECRET)}`;

  const { data } = await fetch(`https://accounts.spotify.com/api/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return JSON.parse(data).access_token;
}

async function fetchPlaylistTracks(token) {
  let allTracks = [];
  let url = `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks?limit=50&fields=next,items(track(id,name,artists,album(name,images),duration_ms,preview_url,external_urls,album.album_type,album.release_date))`;

  while (url) {
    const { data } = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = JSON.parse(data);
    const tracks = json.items
      .filter((item) => item.track && item.track.preview_url)
      .map((item) => {
        const t = item.track;
        const album = t.album;
        return {
          id: t.id,
          name: t.name,
          artists: t.artists.map((a) => a.name),
          album: album.name,
          albumArt: album.images?.[0]?.url || '',
          year: (album.release_date || '').slice(0, 4),
          durationMs: t.duration_ms,
          previewUrl: t.preview_url,
          spotifyUrl: t.external_urls?.spotify || `https://open.spotify.com/track/${t.id}`,
        };
      });
    allTracks = allTracks.concat(tracks);
    url = json.next;
  }

  return allTracks;
}

async function fetchViaEmbed() {
  console.log('Attempting to fetch via Spotify embed API (no auth needed)...');

  const { data } = await fetch(`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}`);
  const tracks = [];

  const previewRegex = /"preview_url":"(https:\\\/\\\/p\.scdn\.co\\\/mp3-preview\\\/[^"]+)"/g;
  const nameRegex = /"name":"([^"]+)"/g;
  const idRegex = /"id":"([^"]+)"/g;
  const imageRegex = /"url":"(https:\\\/\\\/i\.scdn\.co\\\/image\\\/[^"]+)"/g;
  const spotifyUrlRegex = /"spotify":"(https:\\\/\\\/open\.spotify\.com\\\/track\\\/[^"]+)"/g;

  const previews = [...data.matchAll(previewRegex)].map((m) => m[1].replace(/\\\//g, '/'));

  if (previews.length === 0) {
    console.log('No preview URLs found in embed. Tracks may not have previews.');
    return [];
  }

  const names = [...data.matchAll(/"name":"([^"]+?)"/g)]
    .map((m) => m[1])
    .filter((n) => !['Premium', 'Spotify', 'playlist', 'tracks', 'Playlist'].includes(n));

  const ids = [...data.matchAll(/"id":"([a-zA-Z0-9]{22})"/g)].map((m) => m[1]);
  const images = [...data.matchAll(/"url":"(https:\/\/i\.scdn\.co\/image\/[^"]+)"/g)].map((m) => m[1]);
  const spotifyUrls = [...data.matchAll(/"spotify":"(https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]{22})"/g)].map((m) => m[1]);

  console.log(`Found: ${previews.length} previews, ${names.length} names, ${ids.length} ids`);

  for (let i = 0; i < previews.length; i++) {
    tracks.push({
      id: ids[i] || `track-${i}`,
      name: names[i] || `Track ${i + 1}`,
      artists: ['Unknown Artist'],
      album: '',
      albumArt: images[i] || '',
      year: '',
      durationMs: 30000,
      previewUrl: previews[i],
      spotifyUrl: spotifyUrls[i] || '',
    });
  }

  return tracks;
}

async function main() {
  let tracks = [];

  if (SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET) {
    try {
      console.log('Using Spotify Client Credentials flow...');
      const token = await getAccessToken();
      tracks = await fetchPlaylistTracks(token);
      console.log(`Fetched ${tracks.length} tracks from Spotify API`);
    } catch (err) {
      console.error('Spotify API failed:', err.message);
    }
  }

  if (tracks.length === 0) {
    tracks = await fetchViaEmbed();
  }

  if (tracks.length === 0) {
    console.error('Could not extract any tracks. Please provide SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET');
    process.exit(1);
  }

  const fs = require('fs');
  const path = require('path');
  const outputPath = path.resolve(__dirname, OUTPUT_PATH);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(tracks, null, 2));
  console.log(`Saved ${tracks.length} tracks to ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
