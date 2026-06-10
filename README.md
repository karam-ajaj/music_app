# اسمع — Arabic Music Trivia

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

## Publishing a new release (APK)

```bash
git tag vX.Y.Z && git push origin vX.Y.Z
```

The APK appears at https://github.com/karam-ajaj/music_app/releases

## Google Play Store

### 1. Create Google Play Console account
Go to https://play.google.com/console — $25 one-time fee.

### 2. Generate your permanent keystore
Run once on your machine. Save the file and passwords **forever** — if lost, you cannot update the app.

```bash
keytool -genkey -v -keystore nagham.keystore -alias nagham \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD \
  -dname "CN=Karam Ajaj, OU=Dev, O=Nagham, L=City, S=State, C=US"
```

### 3. Add secrets to GitHub
Repo → Settings → Secrets → Actions → add:

| Secret | Value |
|--------|-------|
| `KEYSTORE_BASE64` | `base64 -w0 nagham.keystore` |
| `KEYSTORE_PASSWORD` | Your store password |
| `KEYSTORE_KEY_PASSWORD` | Your key password |
| `KEYSTORE_ALIAS` | `nagham` |

### 4. Build the AAB
Actions → Build Android → Run workflow → select `aab` → run. Download the AAB artifact.

### 5. Upload to Play Console
In Play Console:
1. Create app — name: اسمع, language: Arabic
2. Fill in app details (description, screenshots, icon)
3. Production → Create new release → upload the AAB
4. Content rating, privacy policy URL
5. Submit for review

## Documentation

See [docs/README.md](docs/README.md) for the full project plan.
