# Nagham - Project Plan

A mobile music trivia game for Arabic songs. Players listen to a short preview of a song and try to guess its name before revealing the answer.

---

## Architecture

```
┌──────────────────┐
│   Mobile App      │────GET───▶ iTunes Search API (free, no auth)
│  (Expo/ReactNative)│◀──JSON───  90-second previews, album art
│  plays .aac/mp4   │
└──────────────────┘
```

**No backend, no credentials, no extraction scripts.** The app searches iTunes Search API at runtime for a curated list of 57 Arabic artists, collects tracks with preview URLs, shuffles them, and plays the 90-second AAC previews directly.

---

## Tech Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Mobile framework | Expo (React Native) | Cross-platform (Android + iOS), fast dev, OTA updates |
| Audio playback | expo-audio | Expo's audio module, plays iTunes AAC previews |
| Music data | iTunes Search API | Free, no auth, 90s previews, album art |
| Language | TypeScript | Type safety |
| CI/CD | GitHub Actions | Build APK on tag |

---

## App Flow (Screens)

1. **Home Screen** - App title/logo, "Start Game" button
2. **Game Screen** - Two states:
   - **Playing**: Audio preview plays, animated indicator, "Reveal" button
   - **Revealed**: Shows song name, artist, album art, year. "Next Song" button

---

## Game Logic

- On start, fetches tracks from iTunes API for all configured artists
- Shuffles all tracks with Fisher-Yates algorithm
- Plays a random track's `previewUrl`
- Auto-reveals after 12 seconds, or user taps "Reveal"
- Tracks which songs have been played (avoid repeats until all exhausted)

---

## Project Structure

```
/root/music/
├── .github/
│   └── workflows/
│       ├── ci.yml                  # Lint + typecheck on push/PR
│       └── build-app.yml           # Build APK on tag v*
├── docs/
│   └── README.md                   # This file
├── app/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── GameScreen.tsx
│   │   ├── components/
│   │   │   ├── AudioPlayer.tsx
│   │   │   └── SongReveal.tsx
│   │   ├── services/
│   │   │   └── tracks.ts           # iTunes API client
│   │   ├── hooks/
│   │   │   ├── useAudioPlayer.ts
│   │   │   └── useGameData.ts
│   │   ├── constants.ts            # APP_NAME, ARTIST LIST
│   │   ├── types.ts
│   │   └── theme.ts
│   ├── App.tsx
│   ├── app.json
│   ├── eas.json
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

---

## iTunes API

The app uses the free [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/):

```
GET https://itunes.apple.com/search?term={artist}&country=eg&entity=song&limit=20
```

Each result includes:
- `previewUrl` — 90-second AAC audio preview (free, no auth)
- `artworkUrl100` — album art
- `trackName`, `artistName`, `collectionName`, `releaseDate`, `trackTimeMillis`

57 Arabic artists across 7 regions, yielding ~1000+ songs per game.

---

## GitHub Actions

### ci.yml (On every PR/push)
- Lint and typecheck the app

### build-app.yml (On tag `v*`)
- Set up Node.js + Java 17 + Android SDK
- Generate keystore
- Run `expo prebuild` + `gradlew assembleRelease`
- Upload signed APK as artifact and GitHub Release asset

---

## Testing on Your Phone

Install **Expo Go** from the App Store (iOS) or Play Store (Android):

```bash
cd app
npm install
npx expo start
```

Scan the QR code with Expo Go.

### Building for Distribution

- **Android**: Push a `v*` tag → GitHub Actions builds a signed APK
- **iOS**: Expo Go works for testing; App Store distribution requires Apple Developer account
