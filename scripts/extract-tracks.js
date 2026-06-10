const https = require('https');
const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PLAYLIST_ID = process.env.PLAYLIST_ID || '37i9dQZF1DXaHuo0R6jTxZ';
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'f0fb00b73e3b4158bbabc7c3287866d1';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:8888/callback';
const OUTPUT_PATH = process.env.OUTPUT_PATH || '../app/src/data/tracks.json';

function request(method, url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const mod = u.protocol === 'https:' ? https : http;
    const reqOpts = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: method,
      headers: options.headers || {},
    };
    if (options.body) {
      reqOpts.headers['Content-Length'] = Buffer.byteLength(options.body);
    }
    const req = mod.request(reqOpts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function randomString(length) {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

async function getAccessTokenClientCredentials() {
  if (!SPOTIFY_CLIENT_SECRET) return null;
  const body = `grant_type=client_credentials&client_id=${encodeURIComponent(SPOTIFY_CLIENT_ID)}&client_secret=${encodeURIComponent(SPOTIFY_CLIENT_SECRET)}`;
  const { data } = await request('POST', 'https://accounts.spotify.com/api/token', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = JSON.parse(data);
  if (json.error) {
    console.error('Client credentials error:', json.error_description || json.error);
    return null;
  }
  return json.access_token;
}

async function getAccessTokenPKCE() {
  const codeVerifier = randomString(64);
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    scope: '',
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params}`;

  console.log('\n--- Spotify Login Required ---');
  console.log('Open this URL in your browser:');
  console.log(`\n${authUrl}\n`);

  try { exec(`xdg-open "${authUrl}" 2>/dev/null || open "${authUrl}" 2>/dev/null`); } catch {}

  const code = await new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:8888`);
      const authCode = url.searchParams.get('code');
      if (authCode) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Success!</h1><p>You can close this tab.</p></body></html>');
        server.close();
        resolve(authCode);
      } else {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Error</h1><p>No authorization code received.</p></body></html>');
      }
    });
    server.listen(8888, () => console.log('Waiting for login on http://localhost:8888/callback ...'));
  });

  const body = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  }).toString();

  const { data } = await request('POST', 'https://accounts.spotify.com/api/token', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const json = JSON.parse(data);
  if (json.error) throw new Error(`PKCE error: ${json.error_description || json.error}`);
  return json.access_token;
}

async function getAccessToken() {
  if (SPOTIFY_CLIENT_SECRET) {
    const token = await getAccessTokenClientCredentials();
    if (token) return token;
  }
  return getAccessTokenPKCE();
}

async function fetchPlaylistTracks(token) {
  let allTracks = [];
  let url = `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks?limit=50&fields=next,items(track(id,name,artists,album(name,images,release_date),duration_ms,preview_url,external_urls))`;

  while (url) {
    console.log(`Fetching page...`);
    const { data } = await request('GET', url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = JSON.parse(data);
    if (json.error) throw new Error(`API error: ${json.error.message}`);
    const tracks = (json.items || [])
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
    console.log(`  ${tracks.length} tracks this page, ${allTracks.length} total`);
  }

  return allTracks;
}

async function main() {
  console.log('Authenticating with Spotify...');
  const token = await getAccessToken();
  if (!token) throw new Error('Could not get access token');

  console.log('Fetching playlist tracks...');
  const tracks = await fetchPlaylistTracks(token);

  if (tracks.length === 0) {
    console.error('No tracks with preview URLs found in this playlist.');
    process.exit(1);
  }

  const outputPath = path.resolve(__dirname, OUTPUT_PATH);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(tracks, null, 2));
  console.log(`\nSaved ${tracks.length} tracks to ${outputPath}`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
