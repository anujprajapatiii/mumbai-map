/** Anatomical controls: rigid volumes, joint rotation, planted-foot targets, lids. */
import { eyeRestPose } from './eye-pose.js';
export const restPose = Object.freeze({
  x:0,y:0,angle:0,body:0,crouch:0,head:0,headX:0,headY:0,
  wing:0,wingFold:0,farWing:0,farWingFold:0,farShoulderX:0,flightFan:0,tail:0,
  footLX:0,footLY:0,footLA:0,footRX:0,footRY:0,footRA:0,
  ...eyeRestPose,
  beak:0,opacity:1,effect:0,effectX:0,effectY:0,effectR:0,
});
export const resolvePose = pose => ({...restPose,...pose});
export const easing = {
  linear:t=>t,
  smooth:t=>t*t*(3-2*t),
  sine:t=>(1-Math.cos(Math.PI*t))/2,
  in:t=>t*t*t,
  out:t=>1-(1-t)**3,
  snap:t=>1-(1-t)**5,
  hold:t=>t<1?0:1,
};
export function mixPose(a,b,t){
  return Object.fromEntries(Object.keys(restPose).map(key=>[key,(a[key]??restPose[key])+((b[key]??restPose[key])-(a[key]??restPose[key]))*t]));
}
function sampleFrames(frames,t,defaults){
  let next=frames.findIndex(frame=>frame.at>=t);
  if(next<=0)return {...defaults,...(next===0?frames[0].pose:frames.at(-1).pose)};
  const a=frames[next-1],b=frames[next];
  const fraction=(t-a.at)/(b.at-a.at||1);
  const amount=(easing[b.ease]??easing.smooth)(fraction);
  return Object.fromEntries(Object.keys(defaults).map(key=>[key,
    (a.pose[key]??defaults[key])+((b.pose[key]??defaults[key])-(a.pose[key]??defaults[key]))*amount,
  ]));
}

/** Asymmetric blinks live on the same deterministic clock as the body. */
export function sampleBlink(blinks,time,duration){
  let closure=0;
  for(const blink of blinks??[]){
    const elapsed=time-blink.at*duration;
    const close=blink.close??80,hold=blink.hold??30,open=blink.open??150;
    if(elapsed<0||elapsed>close+hold+open)continue;
    const amount=elapsed<close?easing.sine(elapsed/Math.max(1,close)):
      elapsed<close+hold?1:1-easing.sine((elapsed-close-hold)/Math.max(1,open));
    closure=Math.max(closure,amount);
  }
  return closure;
}

export function samplePose(motion,progress){
  const t=Math.max(0,Math.min(1,Number(progress)||0));
  const pose=sampleFrames(motion.frames,t,restPose);
  if(motion.eyes?.frames?.length){
    Object.assign(pose,sampleFrames(motion.eyes.frames,t,eyeRestPose));
    pose.blink=Math.max(pose.blink,sampleBlink(motion.eyes.blinks,t*motion.duration,motion.duration));
  }
  return pose;
}
