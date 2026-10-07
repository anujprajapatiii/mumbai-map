import { createCrowSVG, renderPose } from './crow-svg.js';
import { animations } from './animations.js';
import { resolvePose, samplePose, mixPose, easing } from './pose.js';
import { setCrowEffect } from './effects.js';
export { animations, samplePose };

const byId = new Map(animations.map(motion => [motion.id, motion]));


/** Deterministic pose playback. Geometry belongs to the anatomical SVG rig. */
export class Crow {
  constructor(host,{motion='streetwise',autoplay=true,reducedMotion='system',facing='right',onUpdate,onComplete}={}) {
    if(!(host instanceof Element))throw new TypeError('Crow needs a host element.');
    this.svg=createCrowSVG({decorative:true});
    this.trigger=document.createElement('button');
    this.trigger.type='button';this.trigger.className='crow-trigger';
    this.trigger.setAttribute('aria-label','Animate Mumbai crow');
    this.trigger.append(this.svg);host.append(this.trigger);
    this.activationListener=()=>this.play(this.motion.id,{loop:this.loop});
    this.trigger.addEventListener('click',this.activationListener);
    this.onUpdate=onUpdate;this.onComplete=onComplete;
    this.rate=1;this.time=0;this.playing=false;this.wantsToPlay=false;
    this.currentPose=resolvePose({});this.generation=0;
    this.preference=matchMedia('(prefers-reduced-motion: reduce)');this.reducedMotion=reducedMotion;
    this.preferenceListener=()=>this.setReducedMotion(this.reducedMotion);
    this.preference.addEventListener('change',this.preferenceListener);
    this.visibilityListener=()=>{
      if(document.hidden){this.stopClock();this.notify();}
      else if(this.wantsToPlay&&!this.reduced){this.startClock();}
    };
    document.addEventListener('visibilitychange',this.visibilityListener);
    this.setFacing(facing);
    this.play(byId.has(motion)?motion:animations[0].id,{autoplay,transition:false});
  }
  get reduced(){return this.preference.matches||this.reducedMotion===true;}
  get progress(){return Math.max(0,Math.min(1,this.time/(this.motion?.duration||1)));}
  paint(pose){
    this.currentPose=resolvePose(pose);renderPose(this.svg,this.currentPose);
    // DOM-visible pose allows the studio to inspect frames without a hidden driver.
    this.svg.dataset.pose=JSON.stringify(this.currentPose);
  }
  setEffect(motion){setCrowEffect(this.svg,motion.effect);}
  play(id,{loop,autoplay=true,transition=true}={}){
    if(this.destroyed)return this;
    const motion=byId.get(id);if(!motion)throw new RangeError(`Unknown crow motion: ${id}`);
    const previous={...this.currentPose};const start=samplePose(motion,0);
    // Invisible poses are authored entry/exit boundaries. Blending across one
    // would invent a backwards arrival before the requested performance.
    const canBlend=autoplay&&transition&&this.motion&&!this.reduced&&previous.opacity>.001&&start.opacity>.001;
    this.cancel();this.motion=motion;this.loop=loop??motion.loop;this.time=0;this.wantsToPlay=autoplay;
    this.appliedReduced=this.reduced;this.setEffect(motion);this.svg.setAttribute('aria-label',`Mumbai crow: ${motion.name}`);
    this.handover=canBlend?{from:{...previous,effect:0},to:start,elapsed:0}:null;
    this.paint(this.reduced?motion.hero:this.handover?.from??start);
    if(this.reduced&&autoplay&&!this.loop){
      this.time=motion.duration;this.wantsToPlay=false;
      const generation=this.generation;
      queueMicrotask(()=>{if(!this.destroyed&&generation===this.generation)this.onComplete?.(motion.id);});
    }
    if(autoplay&&!this.reduced&&!document.hidden)this.startClock();else this.notify();
    return this;
  }
  startClock(){
    if(this.destroyed||this.reduced||document.hidden)return;
    cancelAnimationFrame(this.raf);this.playing=true;this.lastTime=null;
    const generation=this.generation;
    const tick=now=>{
      if(this.destroyed||generation!==this.generation||!this.playing)return;
      const delta=this.lastTime==null?0:Math.min(80,Math.max(0,now-this.lastTime))*this.rate;
      this.lastTime=now;
      if(this.handover){
        this.handover.elapsed+=delta;
        const t=Math.min(1,this.handover.elapsed/280);
        this.paint(mixPose(this.handover.from,this.handover.to,easing.sine(t)));
        if(t===1)this.handover=null;
      }else{
        this.time+=delta;
        if(this.time>=this.motion.duration){
          if(this.loop)this.time%=this.motion.duration;
          else{
            this.time=this.motion.duration;this.paint(samplePose(this.motion,1));
            this.playing=false;this.wantsToPlay=false;this.notify();
            if(generation===this.generation&&!this.destroyed)this.onComplete?.(this.motion.id);
            return;
          }
        }
        this.paint(samplePose(this.motion,this.progress));
      }
      this.notify();
      if(generation===this.generation&&this.playing)this.raf=requestAnimationFrame(tick);
    };
    this.raf=requestAnimationFrame(tick);this.notify();
  }
  stopClock(){cancelAnimationFrame(this.raf);this.playing=false;this.lastTime=null;}
  pause(){
    // Pause cancels deferred completions too, including the reduced-motion
    // microtask queued before the caller had a chance to pause the player.
    this.generation++;this.wantsToPlay=false;this.stopClock();this.notify();return this;
  }
  resume(){
    if(this.destroyed)return this;this.wantsToPlay=true;
    if(this.reduced)return this.play(this.motion.id,{loop:this.loop,autoplay:true,transition:false});
    if(this.progress>=1){this.time=0;this.handover=null;}
    if(!this.reduced&&!document.hidden)this.startClock();else this.notify();return this;
  }
  seek(progress){
    if(this.destroyed||this.reduced)return this;
    this.handover=null;this.time=Math.max(0,Math.min(1,Number(progress)||0))*this.motion.duration;
    this.paint(samplePose(this.motion,this.progress));this.lastTime=null;this.notify();return this;
  }
  setSpeed(rate){this.rate=Math.max(.25,Math.min(2,Number(rate)||1));return this;}
  setLoop(loop){this.loop=Boolean(loop);this.notify();return this;}
  setFacing(facing){this.svg.style.transform=facing==='left'?'scaleX(-1)':'';this.svg.style.transformOrigin='50% 50%';return this;}
  setReducedMotion(value){
    if(this.destroyed)return this;const wanted=this.wantsToPlay;
    this.reducedMotion=value;
    if(this.appliedReduced!==this.reduced)this.play(this.motion.id,{loop:this.loop,autoplay:wanted,transition:false});
    else this.notify();return this;
  }
  notify(){if(!this.destroyed)this.onUpdate?.({id:this.motion?.id,playing:this.playing,progress:this.progress,reduced:this.reduced,loop:this.loop});}
  cancel(){this.generation++;this.stopClock();this.handover=null;this.wantsToPlay=false;}
  destroy(){this.cancel();this.destroyed=true;this.preference.removeEventListener('change',this.preferenceListener);document.removeEventListener('visibilitychange',this.visibilityListener);this.trigger.removeEventListener('click',this.activationListener);this.trigger.remove();}
  exportSVG(){
    const clone=this.svg.cloneNode(true);
    const sources=[this.svg,...this.svg.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
    sources.forEach((source,index)=>{
      const computed=getComputedStyle(source);
      ['fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','opacity','color'].forEach(property=>copies[index].style.setProperty(property,computed.getPropertyValue(property)));
    });
    clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width','800');clone.setAttribute('height','800');
    clone.style.width='800px';clone.style.height='800px';clone.style.transformOrigin='50% 50%';
    clone.removeAttribute('data-pose');
    // The embedded drawing is decorative inside its named replay button.
    // An exported SVG stands alone and needs its own accessible identity.
    const label=`Mumbai crow: ${this.motion.name}`;
    clone.removeAttribute('aria-hidden');clone.setAttribute('role','img');clone.setAttribute('aria-label',label);
    const title=document.createElementNS('http://www.w3.org/2000/svg','title');
    title.textContent=label;clone.prepend(title);
    return new XMLSerializer().serializeToString(clone);
  }
}
