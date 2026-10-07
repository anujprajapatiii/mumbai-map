// Local Google Maps Demo Key connection. Keep the credential in this tab only.
const SESSION_KEY = 'butter-google-demo-key-v1';
const DEMO_KEY_URL = 'https://console.cloud.google.com/google/maps-hosted/tos?ref=https%3A%2F%2Fdevelopers.google.com%2Fmaps%2F';
const STYLESHEET_URL = new URL('./google-demo.css', import.meta.url).href;
const ICON_SPRITE_URL = new URL('./assets/icons/phosphor.svg', import.meta.url).href;
const KEY_PATTERN = /^AIza[A-Za-z0-9_-]{35}$/;
let loadPromise;
let sdkAttempted = false;
let sdkReady = false;
let resolveReady;
let dialog;
let form;
let keyInput;
let confirmation;
let connectButton;
let forgetButton;
let message;
let busy = false;
let returnFocus;

function savedKey() {
  try {
    const key = sessionStorage.getItem(SESSION_KEY);
    return KEY_PATTERN.test(key || '') ? key : null;
  } catch { return null; }
}

function forgetKey() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* Session may be blocked. */ }
}

function rememberKey(key) {
  try { sessionStorage.setItem(SESSION_KEY, key); return true; }
  catch { return false; }
}

function dismissSetup() {
  dialog.close();
  returnFocus?.focus();
}

function setStatus(text = '', isError = false) {
  message.textContent = text;
  message.hidden = !text;
  message.classList.toggle('is-error', isError);
  message.setAttribute('role', isError ? 'alert' : 'status');
}

function setBusy(value) {
  busy = value;
  form.setAttribute('aria-busy', String(value));
  keyInput.disabled = value;
  confirmation.disabled = value;
  connectButton.disabled = value;
  forgetButton.disabled = value;
  connectButton.textContent = value ? 'Connecting…' : (sdkAttempted ? 'Connect & reload' : 'Connect');
}

function ensureDialog() {
  if (dialog) return;
  if (![...document.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === STYLESHEET_URL)) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = STYLESHEET_URL;
    stylesheet.dataset.googleDemoStyle = '';
    document.head.append(stylesheet);
  }
  dialog = document.createElement('dialog');
  dialog.id = 'google-demo-setup';
  dialog.className = 'google-demo-setup';
  dialog.setAttribute('aria-labelledby', 'google-demo-title');
  dialog.innerHTML = `
    <div class="dialog-header">
      <h2 id="google-demo-title">Google Maps preview</h2>
      <button type="button" class="icon-button" data-google-close aria-label="Close Google Maps settings"><svg class="icon" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><use href="${ICON_SPRITE_URL}#x"></use></svg></button>
    </div>
    <a class="google-demo-get-key" href="${DEMO_KEY_URL}" target="_blank" rel="noopener noreferrer">Get a Demo Key<svg class="icon" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><use href="${ICON_SPRITE_URL}#arrow-up-right"></use></svg></a>
    <form>
      <label class="field" for="google-demo-key">Demo Key
        <input id="google-demo-key" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" required maxlength="100" placeholder="Paste your Demo Key" aria-describedby="google-demo-privacy google-demo-status" autofocus>
      </label>
      <p id="google-demo-privacy" class="google-demo-privacy">Kept only in this tab’s session. Sent only to Google.</p>
      <label class="check google-demo-confirm"><input id="google-demo-confirm" type="checkbox" required><span>This is a Demo Key with billing disabled</span></label>
      <p id="google-demo-status" class="google-demo-status" role="status" hidden></p>
      <div class="google-demo-actions"><button class="secondary" type="button" data-google-close>Cancel</button><button class="primary" type="submit">Connect</button></div>
      <button type="button" class="inline-link google-demo-forget" hidden>Forget key</button>
    </form>`;
  document.body.append(dialog);
  form = dialog.querySelector('form');
  keyInput = dialog.querySelector('#google-demo-key');
  confirmation = dialog.querySelector('#google-demo-confirm');
  connectButton = form.querySelector('[type=submit]');
  forgetButton = dialog.querySelector('.google-demo-forget');
  message = dialog.querySelector('#google-demo-status');
  dialog.querySelectorAll('[data-google-close]').forEach(button => button.addEventListener('click', dismissSetup));
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    dismissSetup();
  });
  keyInput.addEventListener('input', () => keyInput.setCustomValidity(''));
  forgetButton.addEventListener('click', () => {
    forgetKey();
    location.reload();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    const key = keyInput.value.trim();
    if (!KEY_PATTERN.test(key)) {
      keyInput.setCustomValidity('Paste the complete Google Demo Key.');
      keyInput.reportValidity();
      return;
    }
    if (!form.reportValidity()) return;
    const persisted = rememberKey(key);
    if (sdkAttempted) {
      if (!persisted) {
        setStatus('Session storage is unavailable. Allow it in this browser, then reconnect.', true);
        return;
      }
      keyInput.value = '';
      setBusy(true);
      setStatus('Reconnecting…');
      location.reload();
      return;
    }
    keyInput.value = '';
    await connect(key);
  });
}

/** Opens the setup dialog without reading or exposing the saved credential. */
export function openGoogleSetup({ error = '' } = {}) {
  ensureDialog();
  if (!dialog.open) returnFocus = document.activeElement;
  keyInput.value = '';
  keyInput.setCustomValidity('');
  confirmation.checked = false;
  forgetButton.hidden = !savedKey();
  if (error) busy = false;
  setBusy(busy);
  setStatus(busy ? 'Loading Google Maps…' : error, !!error);
  if (!dialog.open) dialog.showModal();
  keyInput.focus();
}

function loadSDK(key) {
  sdkAttempted = true;
  return new Promise((resolve, reject) => {
    const callbackName = '__butterGoogleDemoReady';
    let settled = false;
    const script = document.createElement('script');
    const timeout = setTimeout(() => fail('Google Maps took too long to load. Check your connection and try again.'), 20000);
    function cleanup() {
      clearTimeout(timeout);
      script.onerror = null;
      delete window[callbackName];
    }
    function fail(text) {
      if (settled) return;
      settled = true;
      cleanup();
      script.remove();
      reject(new Error(text));
    }
    // Google can reject a credential after the map instance is created.
    window.gm_authFailure = () => {
      const text = 'Google rejected this key or its access. Check your Demo Key and reconnect.';
      forgetKey();
      if (!settled) fail(text);
      else {
        sdkReady = false;
        openGoogleSetup({ error: text });
        window.dispatchEvent(new CustomEvent('google-demo-auth-error'));
      }
    };
    window[callbackName] = async () => {
      try {
        await google.maps.importLibrary('maps');
        if (settled) return;
        settled = true;
        cleanup();
        resolve();
      } catch {
        fail('Google Maps could not finish loading. Check your connection and Demo Key.');
      }
    };
    script.async = true;
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    script.onerror = () => fail('Google Maps could not load. Check your connection and try again.');
    const url = new URL('https://maps.googleapis.com/maps/api/js');
    url.searchParams.set('key', key);
    url.searchParams.set('v', 'weekly');
    url.searchParams.set('loading', 'async');
    url.searchParams.set('callback', callbackName);
    url.searchParams.set('region', 'IN');
    url.searchParams.set('language', 'en');
    script.src = url.href;
    document.head.append(script);
  });
}

async function connect(key) {
  setBusy(true);
  setStatus('Loading Google Maps…');
  try {
    await loadSDK(key);
    sdkReady = true;
    setBusy(false);
    dialog.close();
    resolveReady?.();
  } catch (error) {
    forgetKey();
    openGoogleSetup({ error: error.message });
  }
}

/** Resolves only after SDK libraries load. The map must still render and pass authentication. */
export function loadGoogleDemo() {
  if (sdkReady) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise(resolve => { resolveReady = resolve; });
  openGoogleSetup();
  const key = savedKey();
  if (key) connect(key);
  return loadPromise;
}
