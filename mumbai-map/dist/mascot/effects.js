const effects = {
  none:'',
  sparkles:'<path d="M710 152v44m-22-22h44M100 293v30m-15-15h30M690 93v24m-12-12h24"/>',
  heart:'<path d="M623 218c-70-42-51-87-17-59 37-37 78 8 17 59Z" fill="#cb7058" stroke="none"/>',
  question:'<path d="M601 164c0-32 48-34 48-7 0 20-23 17-23 38m0 21v2"/>',
  pin:'<path d="M632 238s-35-40-35-65a35 35 0 0 1 70 0c0 25-35 65-35 65Z" fill="currentColor" stroke="none"/><circle cx="632" cy="175" r="12" fill="#fff" stroke="none"/>',
  zzz:'<path d="M595 245h24l-24 28h24m20-82h30l-30 32h30m20-93h36l-36 37h36"/>',
  rain:'<path d="M257 103c-6-30 37-47 56-18 17-38 68-20 66 8 30-7 39 33 8 43H268c-32-2-33-31-11-33Z" fill="#7795a8" stroke="none"/><path d="m270 155-10 25m46-25-10 25m46-25-10 25m46-25-10 25" stroke="#7795a8"/>',
  notes:'<path d="M623 224v-65l40-10v62m-40-32 40-10"/><ellipse cx="613" cy="225" rx="12" ry="9" fill="currentColor"/><ellipse cx="653" cy="213" rx="12" ry="9" fill="currentColor"/>',
  check:'<circle cx="629" cy="192" r="32" fill="currentColor" stroke="none"/><path d="m614 192 11 11 21-24" stroke="#fff"/>',
  sun:'<circle cx="637" cy="185" r="23" fill="currentColor" stroke="none"/><path d="M637 141v-13m0 101v13m44-57h13m-101 0h-13m88-31 9-9m-71 71-9 9m9-79-9-9m71 71 9 9"/>',
  wind:'<path d="M157 318h103c33 0 25-36 6-29M132 342h111m-79 23h93c30 0 27 37 5 29"/>',
};

// A held cup: the near edge is the far wing's grip point (0, 0).
const chai = `<path d="M0-10H64L54 56H10Z" fill="#b77948"/>
  <path d="M48-7H64L54 56H43Z" fill="#955f37"/>
  <ellipse cx="32" cy="-10" rx="32" ry="5" fill="#deb285"/>
  <ellipse cx="32" cy="-10" rx="27" ry="3" fill="#69432b"/>
  <path d="M11 3L17 43" stroke="#e6ae78" stroke-width="3" stroke-linecap="round" opacity=".65"/>
  <path d="M22-26c-12-13 11-16 0-31m20 31c-12-13 11-16 0-31" fill="none" stroke="#b77948" stroke-width="4" stroke-linecap="round" opacity=".65"/>`;

export function setCrowEffect(svg, name = 'none') {
  const effect = svg.querySelector('[data-part="effect"]');
  effect.innerHTML = effects[name] ?? '';
  for (const [attribute, value] of Object.entries({fill:'none',stroke:'#678266',color:'#678266','stroke-width':'7','stroke-linecap':'round','stroke-linejoin':'round'})) effect.setAttribute(attribute, value);
  svg.querySelector('[data-part="heldProp"]').innerHTML = name === 'chai' ? chai : '';
  svg.dataset.effect = name;
}
