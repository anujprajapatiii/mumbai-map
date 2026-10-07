# Mumbai Map

Run `npm start` and open http://127.0.0.1:4173/.

The app contains a native Google Maps map centred on Mumbai and a yellow header with a bold “Mumbai Map” heading and the clickable crow. Google provides the normal map controls. The Butter logos and header connection button are removed.

## Google connection

Connects automatically at startup through the existing no-billing [Google Maps Demo Key](https://developers.google.com/maps/documentation/javascript/demo-key) flow. The setup dialog appears when a key is needed or the connection fails. The key remains in tab session storage and is sent only to Google; it is never written to project files. Demo keys are for evaluation and testing, and quota limits can pause access. No billing was enabled.

## Files

- `dist/app.js`: native map setup, automatic connection and crow placement.
- `dist/style.css`: yellow frame and connection dialog primitives.
- `dist/google-demo.js`: session-only SDK connection.
- `dist/mascot/`: unchanged character rig, eye animation, and motion library. The crow greets once and replays on click, Enter or Space; reduced motion uses its existing still pose.
- `dist/assets/icons/`: Phosphor Bold sprite and favicon, MIT license included.

The old planning app, custom overlays, drawing tools, storage model, studio/review pages, tests, previous versions, and screenshots were deleted at the user's request. Startup removes the former atlas data and overlay settings without retaining a backup. The Google credential is preserved. There is no alternate map provider or custom map styling.

`npm run check` checks syntax. [Live GitHub Pages preview](https://anujprajapatiii.github.io/mumbai-map/). Publishing uses the manually triggered **Publish Mumbai Map** workflow; ordinary pushes do not deploy.

Reference: [Google Maps default controls](https://developers.google.com/maps/documentation/javascript/controls).
