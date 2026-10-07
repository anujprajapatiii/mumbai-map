# Mumbai Map

A simple Google map of Mumbai with a yellow frame and an interactive SVG crow.

[Open Mumbai Map](https://anujprajapatiii.github.io/mumbai-map/)

## Local preview

```sh
cd mumbai-map
npm start
```

Open http://127.0.0.1:4173/. No dependency installation is needed.

## Google connection

The app asks for a [Google Maps Demo Key](https://developers.google.com/maps/documentation/javascript/demo-key). It stays in the current browser tab's session storage and is sent only to Google, never stored in this repository or a deployment artifact. A new browser origin or session needs its own connection. Demo keys are for testing and prototyping; no billing is enabled by this app.

## Publish

GitHub Pages serves `mumbai-map/dist`. Publishing is manual: run **Actions → Publish Mumbai Map → Run workflow** after pushing a revision intended for publication. Ordinary pushes do not deploy the site.

Google provides the native map controls and attribution. Phosphor icons include their MIT license in `mumbai-map/dist/assets/icons/LICENSE.txt`.
