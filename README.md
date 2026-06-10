# Arabic Hitster

A mobile music guessing game for Arabic songs (80s & 90s). Listen to a preview, guess the song, reveal the answer.

Built with Expo (React Native) + TypeScript.

## Quick Start

### 1. Extract real track data (required)

You must first extract the track data from the Spotify playlist using your Spotify Developer credentials:

```bash
# Set your Spotify credentials
export SPOTIFY_CLIENT_ID="your-client-id"
export SPOTIFY_CLIENT_SECRET="your-client-secret"

# Run the extraction script
node scripts/extract-tracks.js
```

This generates `app/src/data/tracks.json` with actual song previews. Without this step, the app has only placeholder data with no audio.

**Note:** Your existing Spotify app credentials work for the Client Credentials flow - no redirect URI changes needed.

### 2. Install & run the app

```bash
cd app
npm install
npx expo start
```

Scan the QR code with Expo Go app to test on your device.

## Documentation

See [docs/README.md](docs/README.md) for the full project plan.