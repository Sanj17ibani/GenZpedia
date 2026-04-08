# GenZpedia Mobile Setup

This frontend is configured as an Expo app and can now be run on Android with either Expo Go or a standalone Android build.

## Configure the API

1. In `Backend/.env`, make sure the API listens on a public interface:

   ```env
   PORT=5001
   HOST=0.0.0.0
   ```

2. Start the backend:

   ```bash
   cd Backend
   npm start
   ```

3. Expose the backend with ngrok:

   ```bash
   ngrok http 5001
   ```

4. Copy the HTTPS forwarding URL from ngrok and place it in `frontend/.env`:

   ```env
   EXPO_PUBLIC_API_URL=https://your-ngrok-subdomain.ngrok-free.dev
   ```

## Run on Android

For Expo Go:

```bash
cd frontend
npm install
npx expo start
```

Scan the QR code from the Expo Go app on your Android phone.

For a local Android build:

```bash
cd frontend
npx expo run:android
```

For a shareable APK or AAB with EAS:

```bash
cd frontend
npx eas build -p android --profile preview
```

## Notes

- The app reads `EXPO_PUBLIC_API_URL` for all API requests.
- ngrok-specific requests include the `ngrok-skip-browser-warning` header.
- Android package id: `com.genzpedia.app`
- The backend health check is available at `/health`.
