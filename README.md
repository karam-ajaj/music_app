# Nagham — Arabic Music Trivia

A mobile music guessing game. Listen to a preview, guess the song, reveal the answer. Features 57 Arabic artists from 7 regions with real audio previews.

Built with Expo (React Native) + TypeScript. Powered by iTunes API.

## Quick Start

```bash
cd app
npm install
npx expo start
```

Scan the QR code with Expo Go app to test on your device.

No credentials, no extraction script, no backend — audio previews work immediately via iTunes API.

## How it works

- On start, searches iTunes for 57 Arabic artists across Egypt, Lebanon, Syria, Iraq, Gulf, North Africa, and Jordan/Palestine
- Collects ~1000+ songs with 90-second audio previews
- Shuffles randomly with Fisher-Yates
- Plays the preview, you guess, then reveal the answer

## Documentation

See [docs/README.md](docs/README.md) for the full project plan.
