/**
 * The Mumbai crow's articulated drawing.
 *
 * Every visible feather is authored SVG geometry. Body, head, beak, tail and
 * wing segments are rigid volumes. Wings overlap a complete torso; nothing in
 * the torso depends on a wing covering a hole. The independent eye rig clips
 * pupils, highlights and anime accents inside its curved eyelid aperture.
 * Two-bone legs keep the toes on their authored floor targets while crouching.
 */
import { resolvePose } from './pose.js';
import { setCrowEffect } from './effects.js';
import { eyeMarkup, renderEye } from './eye.js';

const NS = 'http://www.w3.org/2000/svg';
const ink = '#151615';
const feather = '#1b1c1b';
let nextCrow = 0;
const rigs = new WeakMap();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const round = n => Math.round(n * 1000) / 1000;
const rotate = (x,y,degrees) => {
  const r = degrees * Math.PI / 180;
  return [x*Math.cos(r)-y*Math.sin(r), x*Math.sin(r)+y*Math.cos(r)];
};

// Flight reveals folded primary feathers. Each blade is a rigid drawing;
// articulation rotates the fan instead of stretching a wing or morphing it.
function primaries(side) {
  const near=side==='near';
  const blades=near?[[24,178],[36,196],[48,204],[60,186]]:[[-23,211],[-32,235],[-41,245],[-50,230]];
  return blades.map(([angle,length])=>`<g transform="rotate(${angle})">
    <path fill="${near?feather:'#101210'}" d="M-15 8 C-30 53 -27 ${length*.67} 0 ${length} C24 ${length*.7} 30 56 15 9 Q5-11-15 8Z"/>
    <path d="M0 29 Q-2 ${length*.46} 0 ${length*.77}" fill="none" stroke="#30332e" stroke-width="2.5" stroke-linecap="round"/>
  </g>`).join('');
}

export function createCrowSVG({ label = 'Mumbai crow', decorative = false, effect = 'none' } = {}) {
  const svg = document.createElementNS(NS, 'svg');
  const id = `crow-eye-${++nextCrow}`;
  svg.setAttribute('xmlns', NS);
  svg.setAttribute('viewBox', '0 0 800 800');
  svg.setAttribute('class', 'crow-svg');
  svg.setAttribute('focusable', 'false');
  if (decorative) svg.setAttribute('aria-hidden', 'true');
  else {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', String(label));
  }

  svg.innerHTML = `
    <g data-part="shadow" fill="#171c19" opacity=".10"><ellipse cx="418" cy="691" rx="153" ry="12"/></g>
    <g data-part="rig">
      <g data-part="legs" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path data-part="legR" stroke="#3d403c" stroke-width="17"/>
        <path data-part="legL" stroke="#51544f" stroke-width="18"/>
      </g>
      <g data-part="body">
        <g data-part="farWing">
          <path fill="#101210" d="M -22 -17 C 7 -34 28 -21 38 6 C 50 32 55 52 40 74 C 23 91 -4 77 -16 54 C -30 30 -35 0 -22 -17 Z"/>
          <g data-part="farWingTip">
            <g data-part="flightFar">${primaries('far')}</g>
            <path fill="#101210" d="M -22 -22 C 5 -30 27 -14 34 8 C 49 35 61 56 74 69 Q 56 77 40 66 L 52 88 Q 33 88 20 77 L 25 101 C 3 94 -14 77 -24 57 C -40 29 -39 0 -22 -22 Z"/>
            <path d="M 14 19 Q 26 46 41 63 M 1 26 Q 11 61 20 76" fill="none" stroke="#2f322e" stroke-width="3.5" stroke-linecap="round"/>
          </g>
        </g>
        <g data-part="tail">
          <path fill="#101210" d="M 20 -39 C -24 -23 -54 6 -93 31 Q -75 41 -51 37 C -78 60 -105 77 -129 86 Q -99 101 -58 94 L -96 113 C -42 119 21 96 57 65 C 80 44 82 10 62 -19 Z"/>
          <path d="M -60 90 Q -25 67 12 35" fill="none" stroke="#282b27" stroke-width="3.5" stroke-linecap="round"/>
        </g>
        <!-- Complete closed torso: the wing's white crease is never a cutout. -->
        <path data-part="torso" fill="${ink}" d="M -64 -150 C -111 -145 -124 -78 -137 -40 C -155 -3 -148 48 -125 85 C -103 117 -59 130 -3 130 C 66 129 121 103 149 57 C 176 11 152 -35 133 -74 C 119 -101 124 -138 90 -164 C 39 -187 -19 -181 -64 -150 Z"/>
        <g data-part="heldProp" pointer-events="none"></g>
        <g data-part="head">
          <path fill="${ink}" d="M -67 -199 C -16 -178 39 -168 96 -145 C 146 -125 162 -97 168 -64 C 180 -27 157 26 139 63 C 126 88 112 105 106 121 C 75 140 12 134 -35 110 L -109 71 L -110 17 Q -128 28 -147 23 C -123 -4 -108 -39 -96 -72 Q -118 -76 -134 -92 Q -98 -102 -72 -119 Q -110 -134 -120 -164 L -32 -159 Q -61 -177 -67 -199 Z"/>
          ${eyeMarkup(id)}
          <path data-part="mouth" fill="#040604" d="M 129 18 L 281 27 Q 238 58 159 66 L 128 43 Z"/>
          <g data-part="jaw">
            <path fill="#2e312d" d="M 129 20 L 281 27 C 251 34 214 44 160 57 Q 137 57 129 43 Z"/>
          </g>
          <path data-part="beak" fill="#444742" d="M 166 -76 C 196 -66 244 -38 265 -11 C 277 4 283 18 282 27 Q 282 31 274 30 L 139 30 Q 127 30 129 19 C 134 -15 145 -53 158 -70 Q 162 -76 166 -76 Z"/>
          <path d="M 151 28 L 274 28" fill="none" stroke="#242722" stroke-width="2.5" stroke-linecap="round"/>
        </g>
        <g data-part="wing">
          <!-- Rounded shoulder overlaps the torso through the whole swing. -->
          <path fill="${feather}" d="M -17 -36 C 17 -49 61 -13 63 26 C 65 62 37 104 1 123 C -27 137 -61 112 -65 78 C -68 36 -46 -24 -17 -36 Z"/>
          <g data-part="wingTip">
            <g data-part="flightNear">${primaries('near')}</g>
            <path fill="${feather}" d="M -31 -29 C 0 -48 42 -29 50 -2 C 57 22 43 46 19 68 C -9 92 -35 106 -66 113 Q -75 105 -71 98 L -97 107 Q -89 85 -73 68 L -107 80 Q -99 56 -78 34 L -107 43 C -88 18 -61 -12 -31 -29 Z"/>
            <path data-part="wingFeathers" d="M -68 94 Q -27 75 2 41 M -75 63 Q -39 46 -12 15" fill="none" stroke="#30332e" stroke-width="3.5" stroke-linecap="round"/>
          </g>
          <path data-part="wingCrease" d="M 27 -9 C 56 24 33 71 0 101" fill="none" stroke="#f2f1e7" stroke-width="8" stroke-linecap="round"/>
        </g>
      </g>
      <g data-part="footR" fill="none" stroke="#41453f" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
        <path d="M -8 -13 Q -3 -3 8 0 L 35 2 M 8 0 L 29 -14 M -8 -11 L -20 -1"/>
      </g>
      <g data-part="footL" fill="none" stroke="#565a53" stroke-width="17" stroke-linecap="round" stroke-linejoin="round">
        <path d="M -8 -13 Q -3 -3 8 0 L 35 2 M 8 0 L 29 -14 M -8 -11 L -20 -1"/>
      </g>
    </g>
    <g data-part="effect" pointer-events="none"></g>`;

  const parts = Object.fromEntries([...svg.querySelectorAll('[data-part]')].map(node => [node.dataset.part, node]));
  rigs.set(svg, parts);
  setCrowEffect(svg, effect);
  renderPose(svg, {});
  return svg;
}

/** A rigid two-segment leg. The bend always faces backward, toward the tail. */
function legPath(hip, foot) {
  const upper = 73, lower = 82;
  const dx=foot[0]-hip[0], dy=foot[1]-hip[1];
  const rawDistance = Math.hypot(dx,dy);
  const distance=clamp(rawDistance, 10, upper+lower-.1);
  const ux=dx/(rawDistance||1), uy=dy/(rawDistance||1);
  const along=(upper*upper-lower*lower+distance*distance)/(2*distance);
  const across=Math.sqrt(Math.max(0,upper*upper-along*along));
  const knee=[hip[0]+ux*along-uy*across,hip[1]+uy*along+ux*across];
  return `M ${round(hip[0])} ${round(hip[1])} L ${round(knee[0])} ${round(knee[1])} L ${round(foot[0])} ${round(foot[1])}`;
}

/** Render one anatomical pose. Timelines and scheduling live outside this file. */
export function renderPose(svg, input) {
  const p=resolvePose(input);
  const parts=rigs.get(svg) || Object.fromEntries([...svg.querySelectorAll('[data-part]')].map(node=>[node.dataset.part,node]));
  const transform=(name,value)=>parts[name].setAttribute('transform',value);
  const cy=510+clamp(p.crouch,-.45,1.25)*58;
  transform('rig',`translate(${round(p.x)} ${round(p.y)}) rotate(${round(p.angle)} 400 660)`);
  parts.rig.setAttribute('opacity',clamp(p.opacity,0,1));
  transform('body',`translate(400 ${round(cy)}) rotate(${round(p.body)})`);
  transform('head',`translate(${round(16+p.headX)} ${round(-166+p.headY)}) rotate(${round(p.head)})`);
  transform('tail',`translate(-107 39) rotate(${round(p.tail)})`);
  transform('wing',`translate(-65 -59) rotate(${round(p.wing)})`);
  transform('wingTip',`translate(-22 82) rotate(${round(p.wingFold)})`);
  // A presenting shoulder can slide forward while remaining under the torso.
  // Keep the rigid wing volumes intact; the default preserves resting anatomy.
  const farShoulderX=66+clamp(p.farShoulderX,0,58);
  transform('farWing',`translate(${round(farShoulderX)} -47) rotate(${round(17-p.farWing)})`);
  transform('farWingTip',`translate(23 49) rotate(${round(-p.farWingFold)})`);
  const flightFan=clamp(p.flightFan,0,1);
  const fanOpacity=clamp(flightFan*6,0,1);
  transform('flightNear',`translate(-10 14) rotate(${round(-180*(1-flightFan))})`);
  transform('flightFar',`translate(8 12) rotate(${round(-100*(1-flightFan))})`);
  parts.flightNear.setAttribute('opacity',fanOpacity);
  parts.flightFar.setAttribute('opacity',fanOpacity);
  // The cup stays in the far wing's grip, rather than floating on the stage.
  const gripTip=rotate(74,69,-p.farWingFold);
  const grip=rotate(23+gripTip[0],49+gripTip[1],17-p.farWing);
  transform('heldProp',`translate(${round(farShoulderX+grip[0])} ${round(-47+grip[1])}) rotate(${round(-p.body)})`);
  parts.heldProp.setAttribute('opacity',svg.dataset.effect==='chai'?clamp(p.effect,0,1):0);
  parts.wingCrease.setAttribute('opacity',round(1-clamp(Math.abs(p.wing)/75,0,1)*.88));
  parts.wingFeathers.setAttribute('opacity',round(.4+clamp(Math.abs(p.wing)/70,0,1)*.6));
  transform('jaw',`rotate(${round(clamp(p.beak,0,35))} 135 24)`);
  parts.mouth.setAttribute('opacity',p.beak>1?1:0);

  const left=[380+p.footLX,680+p.footLY];
  const right=[480+p.footRX,680+p.footRY];
  const hipL=rotate(-15,55,p.body), hipR=rotate(70,50,p.body);
  const ankleL=rotate(-8,-12,p.footLA), ankleR=rotate(-8,-12,p.footRA);
  parts.legL.setAttribute('d',legPath([400+hipL[0],cy+hipL[1]],[left[0]+ankleL[0],left[1]+ankleL[1]]));
  parts.legR.setAttribute('d',legPath([400+hipR[0],cy+hipR[1]],[right[0]+ankleR[0],right[1]+ankleR[1]]));
  transform('footL',`translate(${round(left[0])} ${round(left[1])}) rotate(${round(p.footLA)})`);
  transform('footR',`translate(${round(right[0])} ${round(right[1])}) rotate(${round(p.footRA)})`);

  renderEye(parts,p);

  const height=clamp(-p.y,0,290);
  const shadowScale=1-height/620;
  transform('shadow',`translate(${round(p.x)} 0) translate(418 691) scale(${round(shadowScale)} 1) translate(-418 -691)`);
  parts.shadow.setAttribute('opacity',round((.1-height/4000)*clamp(p.opacity,0,1)));
  parts.effect.setAttribute('opacity',clamp(p.effect,0,1));
  transform('effect',`translate(${round(p.effectX)} ${round(p.effectY)}) rotate(${round(p.effectR)} 610 200)`);
  return svg;
}
