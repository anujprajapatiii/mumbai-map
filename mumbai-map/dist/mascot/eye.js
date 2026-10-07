import { eyeRestPose } from './eye-pose.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:0));
const mix=(a,b,t)=>a+(b-a)*t;
const r=n=>Math.round(n*1000)/1000;
const smooth=t=>{const v=clamp(t,0,1);return v*v*(3-2*v);};

/** Shared clipping keeps the white, pupil and expression accents behind lids. */
export function eyeMarkup(id){
  return `<g data-part="eye" transform="translate(58 -45)">
    <defs>
      <clipPath id="${id}-ball"><ellipse data-part="eyeBallClip" rx="47" ry="47"/></clipPath>
      <clipPath id="${id}-aperture"><path data-part="eyeClip"/></clipPath>
    </defs>
    <g clip-path="url(#${id}-ball)"><g clip-path="url(#${id}-aperture)">
      <ellipse data-part="eyeWhite" rx="47" ry="47" fill="#fffdf6"/>
      <g data-part="pupil">
        <circle data-part="iris" r="32" fill="#080b08"/>
        <g data-part="eyeShine" fill="#fffdf6">
          <ellipse cx="-10" cy="-13" rx="7" ry="9" transform="rotate(25 -10 -13)"/>
          <circle cx="12" cy="11" r="3.5"/>
        </g>
        <path data-part="eyeSpark" fill="#fff4bf" d="M0-25 6-7 22 0 6 7 0 25-6 7-22 0-6-7Z"/>
      </g>
      <path data-part="eyeSpiral" d="M0 0 C-8-8-14 4-5 9 C10 18 24 2 14-12 C0-33-31-17-27 7 C-22 38 22 42 34 12" fill="none" stroke="#151615" stroke-width="6" stroke-linecap="round"/>
      <path data-part="eyeWater" d="M-43 22 Q0 38 43 22 L43 48 H-43Z" fill="#b9dcd4"/>
    </g></g>
    <path data-part="closedLid" fill="none" stroke="#f4f1df" stroke-width="5.5" stroke-linecap="round"/>
    <path data-part="brow" fill="none" stroke="#7d8374" stroke-width="5" stroke-linecap="round"/>
    <path data-part="eyeTear" d="M34 29 C32 42 25 47 25 54 A9 9 0 0 0 43 54 C43 46 36 40 34 29Z" fill="#b9dcd4"/>
  </g>`;
}

/** Pure geometry makes every still, export and playback frame reproducible. */
export function eyeGeometry(input={}){
  const p={...eyeRestPose,...input};
  const blink=clamp(p.blink,0,1),wide=clamp(p.eyeWide,0,1),sharp=clamp(p.eyeSharp,0,1);
  const curve=clamp(p.eyeCurve,-1,1),rx=47+wide*2,ry=47+wide*4;
  let top=-ry+2*ry*clamp(p.lidTop,0,.9),bottom=ry-2*ry*clamp(p.lidBottom,0,.8);
  // Even conflicting authored lids converge to one line, never invert.
  if(bottom-top<4){const mid=(top+bottom)/2;top=mid-2;bottom=mid+2;}
  let topCurve=sharp*7,bottomCurve=-Math.max(0,curve)*30;
  const gap=bottom-top;
  if(topCurve-bottomCurve>gap*1.7){const scale=gap*1.7/(topCurve-bottomCurve);topCurve*=scale;bottomCurve*=scale;}
  const seam=(top+bottom)/2,seamCurve=(topCurve+bottomCurve)/2;
  top=mix(top,seam,blink);bottom=mix(bottom,seam,blink);
  topCurve=mix(topCurve,seamCurve,blink);bottomCurve=mix(bottomCurve,seamCurve,blink);
  const tilt=Math.tan(clamp(p.lidTilt,-26,26)*Math.PI/180)*.55;
  const path=`M-60 ${r(top-60*tilt)} Q0 ${r(top+topCurve)} 60 ${r(top+60*tilt)} L60 ${r(bottom+60*tilt)} Q0 ${r(bottom+bottomCurve)} -60 ${r(bottom-60*tilt)}Z`;
  const radius=34*clamp(p.pupil,.18,1.13);
  const marginX=rx-radius-1,marginY=ry-radius-1;
  let gx=clamp(p.gazeX,-45,45),gy=clamp(p.gazeY,-45,45);
  const length=Math.hypot(gx/marginX,gy/marginY);
  if(length>1){gx/=length;gy/=length;}
  const visible=smooth((1-blink)/.08),spiral=clamp(p.eyeSpiral,0,1),spark=clamp(p.eyeSpark,0,1);
  const shine=clamp(p.eyeShine,0,1)*(1-spark)*(1-spiral)*clamp((radius-7)/18,0,1);
  const closedOpacity=smooth((blink-.72)/.28);
  const lineY=mix(seam,6,Math.abs(curve));
  const lineCurve=curve>0?-34*curve:18*Math.abs(curve);
  // One topology throughout: split the rounded quadratic in two, then blend
  // its coordinates toward a chevron. No threshold can swap a visible lid.
  const angle=smooth((sharp-.35)/.65)*smooth((curve+.25)/.25);
  const edgeX=mix(33,31,angle),edgeY=lineY+9*angle;
  const controlY=lineY+mix(lineCurve/2,-1,angle);
  const middleY=lineY+mix(lineCurve/2,-11,angle);
  const closedPath=`M${r(-edgeX)} ${r(edgeY)} Q${r(-edgeX/2)} ${r(controlY)} 0 ${r(middleY)} Q${r(edgeX/2)} ${r(controlY)} ${r(edgeX)} ${r(edgeY)}`;
  const sleepy=smooth(-curve/.5);
  const closedStroke=`rgb(${r(mix(244,146,sleepy))},${r(mix(241,152,sleepy))},${r(mix(223,135,sleepy))})`;
  const browLift=clamp(p.browLift,-1,1),browTilt=clamp(p.brow,-25,25);
  const by=-ry-14-browLift*9;
  const browPath=`M-31 ${r(by-browTilt*.5)} Q0 ${r(by-9-Math.abs(browTilt)*.25)} 31 ${r(by+browTilt*.5)}`;
  return {
    rx,ry,aperture:{top,bottom,topCurve,bottomCurve,tilt,path,openness:1-blink},
    pupil:{x:gx,y:gy,radius},whiteOpacity:visible,
    irisOpacity:visible*(1-spiral),shineOpacity:visible*shine,
    sparkOpacity:visible*spark*(1-spiral),spiralOpacity:visible*spiral,
    tearOpacity:visible*clamp(p.eyeTear,0,1),closedOpacity,closedPath,closedStroke,
    browPath,browOpacity:clamp(Math.abs(browTilt)/24+Math.abs(browLift)*.7,0,.9),
  };
}

export function renderEye(parts,pose){
  const g=eyeGeometry(pose),set=(part,key,value)=>parts[part].setAttribute(key,typeof value==='number'?r(value):value);
  for(const part of ['eyeBallClip','eyeWhite']){set(part,'rx',g.rx);set(part,'ry',g.ry);}
  set('eyeClip','d',g.aperture.path);set('eyeWhite','opacity',g.whiteOpacity);
  set('pupil','transform',`translate(${r(g.pupil.x)} ${r(g.pupil.y)})`);
  set('pupil','opacity',g.irisOpacity);set('iris','r',g.pupil.radius);
  set('eyeShine','opacity',g.shineOpacity);set('eyeSpark','opacity',g.sparkOpacity);
  set('eyeShine','transform',`scale(${r(g.pupil.radius/34)})`);
  set('eyeSpark','transform',`scale(${r(g.pupil.radius/36)})`);
  set('eyeSpiral','opacity',g.spiralOpacity);set('eyeWater','opacity',g.tearOpacity*.5);
  set('eyeTear','opacity',g.tearOpacity);set('closedLid','d',g.closedPath);set('closedLid','opacity',g.closedOpacity);
  set('closedLid','transform',`rotate(${r(Math.atan(g.aperture.tilt)*180/Math.PI)})`);
  set('closedLid','stroke',g.closedStroke);
  set('brow','d',g.browPath);set('brow','opacity',g.browOpacity);
  return g;
}
