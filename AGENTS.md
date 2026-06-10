# AGENTS.md — Nagham (Arabic Music Trivia)

## Overview

Nagham is a cross-platform mobile music trivia game built with **Expo (React Native) + TypeScript**. Players listen to a 30-second iTunes preview and guess the song. The app searches iTunes Search API at runtime for Arabic artists across 5 regions, fetches track previews, and runs a guessing game with decade/region filtering.

- **No backend, no credentials, no extraction scripts** — everything runs client-side via free iTunes API
- **Bilingual** — English/Arabic UI toggle + Arabic song/artist names displayed in Arabic mode
- **GitHub Actions** builds a signed release APK on every `v*` tag

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Expo SDK 56 + React Native 0.85 |
| Language | TypeScript 6 |
| Audio | expo-audio (SDK 56 native audio module) |
| Music data | iTunes Search API (free, no auth) |
| CI/CD | GitHub Actions |
| Build | `expo prebuild` → `gradlew assembleRelease` |

## Directory Structure

```
/
├── AGENTS.md                # This file
├── app/                     # Expo mobile app
│   ├── App.tsx              # Root: language context, screen routing
│   ├── app.json             # Expo config: app name, package, plugins
│   ├── eas.json             # EAS Build config (unused; we use Gradle directly)
│   ├── package.json         # Dependencies + scripts
│   ├── tsconfig.json        # TypeScript config
│   ├── assets/              # App icons and splash
│   └── src/
│       ├── constants.ts     # APP_NAME, regions, artists (EN+AR names), decade/region types
│       ├── types.ts         # Track interface, GamePhase, GameState
│       ├── theme.ts         # Colors, spacing, fonts
│       ├── i18n.ts          # Translation map (en/ar) + t() function
│       ├── screens/
│       │   ├── HomeScreen.tsx    # Decade + region multi-select chips, language toggle
│       │   └── GameScreen.tsx    # Game UI: play, reveal, back-to-home
│       ├── components/
│       │   ├── AudioPlayer.tsx   # Play/pause, progress bar, status text
│       │   └── SongReveal.tsx    # Album art, song name, artist (language-aware)
│       ├── hooks/
│       │   ├── useAudioPlayer.ts  # Wraps expo-audio for play/pause/replace
│       │   └── useGameData.ts    # Game state: queue, shuffle, reveal, next
│       └── services/
│           └── tracks.ts         # iTunes API: batched search, decade/region filter, dedup
├── docs/
│   └── README.md            # Full project plan
└── .github/
    └── workflows/
        ├── ci.yml           # Typecheck on push/PR
        └── build-app.yml    # Build signed APK on v* tag
```

## Key Architecture Decisions

### Why iTunes API instead of Spotify?
Spotify Web API requires Premium + registered developer app. iTunes Search API is completely free, no auth, provides 30-second AAC previews + album art. Downside: song data depends on what's listed on iTunes Egypt store.

### Batching API calls
Fetching 57 artists in parallel saturated mobile network connections, causing audio stutter. The app now fetches artists in **batches of 3** with **8-second timeouts**. Failed artists are silently skipped so one dead query doesn't kill the whole game.

### Language flow
- `App.tsx` provides `LangContext` (en/ar) to all components
- `useT()` hook returns translated UI strings from `i18n.ts`
- `constants.ts` stores both `{ en, ar }` names for every artist
- iTunes is searched with **both** English and Arabic terms per artist
- Arabic iTunes results provide Arabic track names stored in `track.nameAr`
- `SongReveal.tsx` picks `name`/`nameAr` and `artists`/`artistsAr` based on current language

### Multi-select filters
Users can select any combination of decades (70s/80s/90s) and regions (Egypt/Levant/Gulf/Iraq/Maghreb). "All" toggles everything on/off. Filters apply client-side after fetching — decade filtering by `releaseDate`, region filtering by which artists are fetched.

## Common Tasks

### Running locally
```bash
cd app
npm install
npx expo start
```
Scan QR with Expo Go on your phone.

### Adding new artists
Edit `app/src/constants.ts` → find the appropriate `REGIONS` entry → add `{ en: 'Name', ar: 'الاسم' }` to its `artists` array. Both English and Arabic terms will be used for iTunes searches.

### Adding a new region
1. Add the region key to `RegionKey` type in `constants.ts`
2. Add it to `ALL_REGIONS` array
3. Add a new entry to the `REGIONS` array with artists
4. Add region translations to the `en`/`ar` maps in `i18n.ts`

### Adding new UI translations
Add key-value pairs to the `en` and `ar` objects in `app/src/i18n.ts`. Use via `const __ = useT(); __('keyName')`.

### Publishing a new release (APK)
```bash
# After making changes:
git add -A && git commit -m "description"
git push

# Create a version tag to trigger APK build:
git tag v2.X.Y && git push origin v2.X.Y
```
The tag triggers `.github/workflows/build-app.yml` which:
1. Sets up Node 22 + Java 17 + Android SDK
2. Generates a keystore, runs `expo prebuild`, builds with Gradle
3. Uploads the signed APK as a build artifact + GitHub Release asset

The APK will be on https://github.com/karam-ajaj/music_app/releases

### Type checking
```bash
cd app && npx tsc --noEmit
```

### Common pitfalls
- **"Failed to load tracks"**: Check internet on device. The iTunes API is geo-restricted to some regions.
- **Duplicate content in files**: When using the `edit` tool on this codebase, always verify the edit didn't append duplicate code by reading the file after.
- **expo-audio API**: We use SDK 56's `expo-audio` (not `expo-av`). Imports: `useAudioPlayer`, `useAudioPlayerStatus`. Methods: `player.replace(url)`, `player.play()`, `player.pause()`, `player.seekTo(0)`.
- **Android signing**: The CI workflow auto-generates a keystore. The alias is `nagham`, passwords are `android`. Not for production Play Store use — swap with a proper keystore for store submission.
