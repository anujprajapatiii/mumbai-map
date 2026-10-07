import { loadGoogleDemo, openGoogleSetup } from './google-demo.js';
import { Crow } from './mascot/crow.js';

// The old atlas has been deliberately removed. Keep only the Google credential.
try {
  for (const key of ['butter.mumbai.atlas.v1', 'butter.mumbai.atlas.v1.recovery', 'butter-mumbai-overlays-v1']) {
    localStorage.removeItem(key);
  }
} catch { /* The bare map does not require local storage. */ }

const status = document.querySelector('#map-status');

new Crow(document.querySelector('#mascot'), { motion: 'wing-wave', autoplay: true });

async function startMap() {
  try {
    await loadGoogleDemo();
    const { Map } = await google.maps.importLibrary('maps');
    new Map(document.querySelector('#map'), {
      center: { lat: 19.076, lng: 72.8777 },
      zoom: 11,
    });
  } catch {
    status.textContent = 'Google Maps couldn’t load.';
    status.hidden = false;
    openGoogleSetup({ error: 'Check your connection and reconnect.' });
  }
}
startMap();
