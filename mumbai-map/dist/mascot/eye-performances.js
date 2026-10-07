import { eyePose } from './eye-pose.js';

// Eye decisions have their own clock positions. Repeating a pose before a dart
// holds its focus instead of slowly drifting toward the next thought.
const E=(at,expression='neutral',overrides={},ease='smooth')=>({at,pose:eyePose(expression,overrides),ease});
const B=(at,overrides={})=>({at,close:80,hold:30,open:150,...overrides});
const T=(hero,frames,blinks=[])=>({hero,frames,blinks});

const performances={
  'streetwise':T(eyePose('smug',{gazeX:9}),[
    E(0),E(.10),E(.116,'alert',{gazeX:10},'snap'),E(.285,'alert',{gazeX:10}),
    E(.318,'focus',{gazeX:-10},'snap'),E(.46,'focus',{gazeX:-10}),
    E(.495,'focus',{gazeX:9},'snap'),E(.535,'smug',{gazeX:9},'out'),
    E(.73,'smug',{gazeX:9}),E(.80,'pleased',{gazeX:6},'out'),
    E(.845,'pleased',{gazeX:6}),E(.86,'neutral',{},'snap'),E(1),
  ],[B(.305),B(.875)]),

  'proper-strut':T(eyePose('smug',{gazeX:10}),[
    E(0),E(.035),E(.06,'focus',{gazeX:10},'snap'),E(.10,'smug',{gazeX:10},'out'),
    E(.78,'smug',{gazeX:10}),E(.83,'pleased',{gazeX:10},'out'),
    E(.86,'pleased',{gazeX:6},'snap'),E(.92,'pleased',{gazeX:6}),
    E(.96,'smug',{gazeX:5},'out'),E(1,'smug',{gazeX:5}),
  ],[B(.075),B(.855)]),

  'late-for-the-local':T(eyePose('focus',{gazeX:13}),[
    E(0),E(.012),E(.03,'startled',{gazeX:14},'snap'),
    E(.064,'surprise',{gazeX:14},'snap'),E(.09,'surprise',{gazeX:14}),
    E(.12,'focus',{gazeX:13},'snap'),E(.705,'focus',{gazeX:13}),
    E(.742,'startled',{gazeX:12},'snap'),E(.765,'startled',{gazeX:12}),
    E(.79,'deadpan',{gazeX:-11},'snap'),E(.87,'deadpan',{gazeX:-11}),
    E(.92,'smug',{gazeX:-7},'snap'),E(.96,'smug',{gazeX:6},'snap'),E(1,'smug',{gazeX:6}),
  ],[B(.885)]),

  'sneaky-steps':T(eyePose('focus',{gazeX:11}),[
    E(0),E(.018),E(.038,'suspicious',{gazeX:-12},'snap'),E(.16,'suspicious',{gazeX:-12}),
    E(.182,'focus',{gazeX:11},'snap'),E(.73,'focus',{gazeX:11}),
    E(.755,'startled',{gazeX:-13},'snap'),E(.84,'suspicious',{gazeX:-13},'out'),
    E(.887,'suspicious',{gazeX:-13}),E(.912,'neutral',{gazeX:4,pupil:1.04},'snap'),
    E(.96,'pleased',{gazeX:4},'out'),E(1,'pleased',{gazeX:4}),
  ],[B(.875)]),

  'curiosity-hop':T(eyePose('curious',{gazeX:12}),[
    E(0),E(.016),E(.04,'curious',{gazeX:12},'snap'),E(.29,'curious',{gazeX:12}),
    E(.385,'focus',{gazeX:12,lidTop:.12},'out'),E(.45,'curious',{gazeX:12},'out'),
    E(.642,'curious',{gazeX:12}),E(.66,'squeeze',{},'in'),E(.681,'squeeze'),
    E(.72,'curious',{gazeX:12},'out'),E(.9,'curious',{gazeX:12}),
    E(.925,'pleased',{gazeX:8},'snap'),E(1,'pleased',{gazeX:8}),
  ]),

  'take-off':T(eyePose('alert',{gazeX:12,gazeY:-8}),[
    E(0),E(.018),E(.047,'alert',{gazeY:-13},'snap'),E(.215,'alert',{gazeY:-13}),
    E(.265,'focus',{gazeY:-13},'snap'),E(.305,'focus',{gazeY:-13}),
    E(.36,'alert',{gazeY:-12},'out'),E(.4,'alert',{gazeX:12,gazeY:-8},'snap'),
    E(.77,'alert',{gazeX:12,gazeY:-8}),E(.82,'focus',{gazeX:12,gazeY:-8},'out'),
    E(1,'focus',{gazeX:12,gazeY:-8}),
  ],[B(.27)]),

  'rowing-flight':T(eyePose('focus',{gazeX:11,gazeY:-5,lidTop:.15,eyeSharp:.6}),[
    E(0,'focus',{gazeX:11,gazeY:-5,lidTop:.15,eyeSharp:.6}),
    E(.42,'focus',{gazeX:11,gazeY:-5,lidTop:.15,eyeSharp:.6}),
    E(.465,'alert',{gazeX:11,gazeY:-5},'out'),E(.58,'alert',{gazeX:11,gazeY:-5}),
    E(.635,'focus',{gazeX:11,gazeY:-5,lidTop:.15,eyeSharp:.6},'out'),
    E(1,'focus',{gazeX:11,gazeY:-5,lidTop:.15,eyeSharp:.6}),
  ],[B(.43)]),

  'soft-landing':T(eyePose('focus',{gazeX:10,gazeY:11}),[
    E(0,'focus',{gazeX:10,gazeY:-4}),E(.13,'focus',{gazeX:10,gazeY:-4}),
    E(.15,'focus',{gazeX:10,gazeY:11},'snap'),E(.49,'focus',{gazeX:10,gazeY:11}),
    E(.515,'squeeze',{},'in'),E(.60,'squeeze'),
    E(.64,'pleased',{gazeX:7},'out'),E(.82,'pleased',{gazeX:7}),
    E(.85,'smug',{gazeX:6},'snap'),E(1,'smug',{gazeX:6}),
  ]),

  'double-take':T(eyePose('surprise',{gazeX:14}),[
    E(0),E(.018),E(.045,'curious',{gazeX:10},'snap'),E(.20,'curious',{gazeX:10}),
    E(.237,'deadpan',{gazeX:-10},'snap'),E(.39,'deadpan',{gazeX:-10}),
    E(.407,'surprise',{gazeX:14},'snap'),E(.56,'surprise',{gazeX:14}),
    E(.63,'startled',{gazeX:13},'out'),E(.845,'startled',{gazeX:13}),
    E(.875,'suspicious',{gazeX:9},'snap'),E(1,'suspicious',{gazeX:9}),
  ],[B(.25),B(.818)]),

  'suspicious':T(eyePose('suspicious',{gazeX:13}),[
    E(0),E(.014),E(.037,'alert',{gazeX:13},'snap'),
    E(.125,'suspicious',{gazeX:13},'smooth'),E(.61,'suspicious',{gazeX:13}),
    E(.68,'deadpan',{gazeX:13},'out'),E(.70,'deadpan',{gazeX:13}),
    E(.722,'suspicious',{gazeX:10},'snap'),E(.90,'suspicious',{gazeX:10}),
    E(.95,'neutral',{},'snap'),E(1),
  ],[B(.647,{hold:30})]),

  'told-you-so':T(eyePose('smug',{gazeX:9}),[
    E(0),E(.02),E(.05,'smug',{gazeX:9},'snap'),E(.454,'smug',{gazeX:9}),
    E(.47,'happy',{},'in'),E(.53,'happy'),E(.563,'smug',{gazeX:8},'out'),
    E(.86,'smug',{gazeX:8}),E(.90,'pleased',{gazeX:4},'snap'),E(1,'pleased',{gazeX:4}),
  ]),

  'belly-laugh':T(eyePose('happy'),[
    E(0),E(.045),E(.10,'pleased',{gazeX:4},'out'),E(.18,'pleased',{gazeX:4}),
    E(.197,'happy',{},'in'),E(.66,'happy'),
    E(.735,'pleased',{gazeX:4},'out'),E(.86,'pleased',{gazeX:4}),
    E(.90,'pleased',{},'snap'),E(1,'pleased'),
  ]),

  'big-gasp':T(eyePose('surprise',{gazeX:12}),[
    E(0),E(.018),E(.048,'alert',{gazeX:12},'snap'),E(.105,'alert',{gazeX:12}),
    E(.135,'squeeze',{},'in'),E(.175,'squeeze'),E(.21,'surprise',{gazeX:12},'snap'),
    E(.69,'surprise',{gazeX:12}),E(.75,'startled',{gazeX:10},'out'),
    E(.8,'startled',{gazeX:10}),E(.89,'curious',{gazeX:5},'out'),E(1,'curious',{gazeX:5}),
  ],[B(.805)]),

  'victory-jig':T(eyePose('sparkle',{gazeX:5}),[
    E(0),E(.04),E(.05366,'pleased',{},'out'),E(.085,'squeeze',{},'in'),E(.115,'squeeze'),
    E(.15,'sparkle',{gazeX:5},'snap'),E(.25,'sparkle',{gazeX:5}),
    E(.285,'happy',{},'out'),E(.49,'happy'),E(.51,'squeeze',{},'in'),E(.54,'squeeze'),
    E(.58,'pleased',{gazeX:4},'out'),E(.65,'pleased',{gazeX:4}),
    E(.68,'squeeze',{},'in'),E(.72,'squeeze'),E(.755,'happy',{},'out'),
    E(.80,'pleased',{gazeX:4},'out'),E(.84,'smug',{gazeX:6},'snap'),E(1,'smug',{gazeX:6}),
  ]),

  'victory-leap':T(eyePose('sparkle',{gazeY:-5}),[
    E(0),E(.04),E(.078,'pleased',{},'out'),E(.105,'squeeze',{},'in'),E(.16,'squeeze'),
    E(.195,'alert',{gazeY:-8},'snap'),E(.34,'alert',{gazeY:-8}),
    E(.36,'sparkle',{gazeY:-5},'snap'),E(.48,'sparkle',{gazeY:-5}),
    E(.52,'pleased',{gazeX:4},'out'),E(.60,'pleased',{gazeX:4}),
    E(.62,'squeeze',{},'in'),E(.67,'squeeze'),E(.71,'happy',{},'out'),
    E(.80,'pleased',{gazeX:5},'out'),E(1,'pleased',{gazeX:5}),
  ]),

  'wing-wave':T(eyePose('pleased',{gazeX:4,eyeCurve:.8}),[
    E(0),E(.012),E(.035,'curious',{gazeX:4},'snap'),
    E(.10,'pleased',{gazeX:4,eyeCurve:.8},'out'),E(.802,'pleased',{gazeX:4,eyeCurve:.8}),
    E(.82,'happy',{},'in'),E(.87,'happy'),
    E(.903,'pleased',{gazeX:3,eyeCurve:.8},'out'),E(1,'pleased',{gazeX:3,eyeCurve:.8}),
  ],[B(.18)]),

  'this-way':T(eyePose('pleased',{gazeX:12,gazeY:8}),[
    E(0),E(.015),E(.04,'focus',{gazeX:12,gazeY:8},'snap'),E(.15,'focus',{gazeX:12,gazeY:8}),
    E(.21,'pleased',{gazeX:12,gazeY:8},'out'),E(.60,'pleased',{gazeX:12,gazeY:8}),
    E(.628,'curious',{gazeX:-9},'snap'),E(.84,'curious',{gazeX:-9}),
    E(.89,'pleased',{gazeX:4},'snap'),E(1,'pleased',{gazeX:4}),
  ],[B(.87)]),

  'found-it':T(eyePose('sparkle',{gazeX:12,gazeY:9}),[
    E(0),E(.012),E(.04,'focus',{gazeX:-10,gazeY:9},'snap'),E(.20,'focus',{gazeX:-10,gazeY:9}),
    E(.226,'alert',{gazeX:12,gazeY:9},'snap'),E(.40,'alert',{gazeX:12,gazeY:9}),
    E(.427,'squeeze',{},'in'),E(.458,'squeeze'),
    E(.488,'sparkle',{gazeX:12,gazeY:9},'snap'),E(.57,'sparkle',{gazeX:12,gazeY:9}),
    E(.607,'pleased',{gazeX:12,gazeY:9},'out'),E(.84,'pleased',{gazeX:12,gazeY:9}),
    E(.867,'pleased',{gazeX:4},'snap'),E(1,'pleased',{gazeX:4}),
  ]),

  'saved-for-later':T(eyePose('tender',{gazeX:8,gazeY:8,eyeTear:0}),[
    E(0),E(.016),E(.047,'curious',{gazeX:10,gazeY:8},'snap'),E(.18,'curious',{gazeX:10,gazeY:8}),
    E(.225,'tender',{gazeX:8,gazeY:8,eyeTear:0},'out'),E(.43,'tender',{gazeX:8,gazeY:8,eyeTear:0}),
    E(.46,'happy',{},'in'),E(.57,'happy'),E(.61,'pleased',{gazeX:3},'out'),
    E(.84,'pleased',{gazeX:3}),E(.90,'pleased',{},'snap'),E(1,'pleased'),
  ]),

  'the-shrug':T(eyePose('deadpan',{gazeX:4}),[
    E(0),E(.017),E(.044,'curious',{gazeX:-11},'snap'),E(.175,'curious',{gazeX:-11}),
    E(.205,'curious',{gazeX:11},'snap'),E(.315,'curious',{gazeX:11}),
    E(.355,'deadpan',{gazeX:4},'snap'),E(.72,'deadpan',{gazeX:4}),
    E(.775,'smug',{gazeX:4},'out'),E(.94,'smug',{gazeX:4}),
    E(.963,'neutral',{},'snap'),E(1),
  ],[B(.357)]),

  'facepalm':T(eyePose('squeeze',{eyeCurve:-.15}),[
    E(0),E(.02),E(.08,'deadpan',{gazeX:11},'out'),E(.265,'deadpan',{gazeX:11}),
    E(.279,'squeeze',{eyeCurve:-.15},'in'),E(.765,'squeeze',{eyeCurve:-.15}),
    E(.808,'deadpan',{gazeX:4},'out'),E(1,'deadpan',{gazeX:4}),
  ]),

  'sleepy-sit':T(eyePose('asleep'),[
    E(0),E(.05),E(.145,'sleepy',{gazeY:3},'smooth'),E(.24,'sleepy',{gazeY:3}),
    E(.285,'asleep',{},'smooth'),E(.40,'asleep'),E(.435,'sleepy',{gazeY:3},'out'),
    E(.505,'sleepy',{gazeY:3}),E(.54,'asleep',{},'smooth'),E(.568,'asleep'),
    E(.588,'startled',{gazeX:4},'snap'),E(.61,'startled',{gazeX:4}),
    E(.675,'sleepy',{},'out'),E(.73,'sleepy'),E(.805,'asleep',{},'smooth'),E(1,'asleep'),
  ]),

  'wake-up':T(eyePose('squeeze',{eyeCurve:.5}),[
    E(0,'asleep'),E(.075,'asleep'),E(.125,'sleepy',{gazeX:8},'out'),E(.22,'sleepy',{gazeX:8}),
    E(.32,'squeeze',{eyeCurve:.5},'smooth'),E(.595,'squeeze',{eyeCurve:.5}),
    E(.625,'sleepy',{gazeX:5},'out'),E(.735,'sleepy',{gazeX:5}),
    E(.76,'alert',{gazeX:7},'snap'),E(.86,'pleased',{gazeX:4},'out'),E(1,'pleased',{gazeX:4}),
  ],[B(.78)]),

  'feather-preen':T(eyePose('focus',{gazeX:7,gazeY:11,lidTop:.3,lidBottom:.18}),[
    E(0),E(.016),E(.046,'focus',{gazeX:7,gazeY:11},'snap'),E(.255,'focus',{gazeX:7,gazeY:11}),
    E(.295,'squeeze',{},'in'),E(.35,'squeeze'),E(.385,'focus',{gazeX:7,gazeY:11},'out'),
    E(.445,'focus',{gazeX:7,gazeY:11}),E(.477,'squeeze',{},'in'),E(.52,'squeeze'),
    E(.55,'focus',{gazeX:7,gazeY:11},'out'),E(.67,'focus',{gazeX:7,gazeY:11}),
    E(.705,'pleased',{gazeX:4},'snap'),E(.88,'pleased',{gazeX:4}),E(1,'smug',{gazeX:4},'out'),
  ]),

  'monsoon-shake':T(eyePose('squeeze',{eyeCurve:-.1}),[
    E(0),E(.015),E(.036,'alert',{gazeY:-13},'snap'),E(.125,'deadpan',{gazeY:-12},'out'),
    E(.235,'deadpan',{gazeY:-12}),E(.275,'squeeze',{eyeCurve:-.1},'in'),
    E(.61,'squeeze',{eyeCurve:-.1}),E(.665,'deadpan',{gazeX:4},'out'),
    E(.74,'deadpan',{gazeX:4}),E(.80,'smug',{gazeX:6},'out'),E(1,'smug',{gazeX:6}),
  ]),

  'sea-breeze':T(eyePose('happy',{eyeCurve:.65}),[
    E(0),E(.02),E(.07,'curious',{gazeX:-8,gazeY:-4},'snap'),
    E(.16,'pleased',{gazeX:-8,gazeY:-4},'out'),E(.265,'pleased',{gazeX:-8,gazeY:-4}),
    E(.295,'happy',{eyeCurve:.65},'smooth'),E(.73,'happy',{eyeCurve:.65}),
    E(.785,'pleased',{gazeX:5},'out'),E(1,'pleased',{gazeX:5}),
  ]),

  'chai-break':T(eyePose('focus',{gazeX:8,gazeY:9,lidTop:.16,eyeSharp:.45}),[
    E(0),E(.012),E(.035,'curious',{gazeX:9,gazeY:11},'snap'),E(.22,'curious',{gazeX:9,gazeY:11}),
    E(.27,'focus',{gazeX:8,gazeY:9,lidTop:.16,eyeSharp:.45},'out'),
    E(.36,'focus',{gazeX:8,gazeY:9,lidTop:.16,eyeSharp:.45}),
    E(.375,'pleased',{gazeX:8,gazeY:9},'out'),E(.417,'pleased',{gazeX:8,gazeY:9}),
    E(.44,'startled',{gazeX:9},'snap'),E(.525,'startled',{gazeX:9}),
    E(.56,'worried',{gazeX:6},'out'),E(.64,'pleased',{gazeX:4},'out'),
    E(.68,'happy',{},'smooth'),E(.77,'happy'),E(.81,'pleased',{gazeX:4},'out'),E(1,'pleased',{gazeX:4}),
  ]),

  'toe-tap':T(eyePose('smug',{gazeX:6,lidTop:.26}),[
    E(0,'smug',{gazeX:6,lidTop:.26}),E(.60,'smug',{gazeX:6,lidTop:.26}),
    E(.63,'deadpan',{gazeX:6},'out'),E(.745,'deadpan',{gazeX:6}),
    E(.78,'smug',{gazeX:6,lidTop:.26},'out'),E(1,'smug',{gazeX:6,lidTop:.26}),
  ],[B(.74)]),

  'peekaboo':T(eyePose('curious',{gazeX:13}),[
    E(0),E(.018),E(.044,'pleased',{gazeX:6},'snap'),E(.125,'pleased',{gazeX:6}),
    E(.142,'squeeze',{},'in'),E(.31,'squeeze'),E(.335,'curious',{gazeX:13},'snap'),
    E(.46,'curious',{gazeX:13}),E(.482,'squeeze',{},'in'),E(.55,'squeeze'),
    E(.575,'surprise',{gazeX:5},'snap'),E(.675,'surprise',{gazeX:5}),
    E(.71,'happy',{},'out'),E(.86,'happy'),E(.905,'pleased',{gazeX:4},'out'),E(1,'pleased',{gazeX:4}),
  ]),

  'little-bow':T(eyePose('happy',{eyeCurve:.65}),[
    E(0),E(.02),E(.064,'pleased',{gazeX:5},'out'),E(.20,'pleased',{gazeX:5}),
    E(.26,'happy',{eyeCurve:.65},'smooth'),E(.60,'happy',{eyeCurve:.65}),
    E(.645,'pleased',{gazeX:4},'out'),E(1,'pleased',{gazeX:4}),
  ]),

  'tiny-tantrum':T(eyePose('angry',{gazeX:12}),[
    E(0),E(.016),E(.047,'deadpan',{gazeX:12},'snap'),E(.10,'deadpan',{gazeX:12}),
    E(.14,'angry',{gazeX:12},'snap'),E(.66,'angry',{gazeX:12}),
    E(.705,'worried',{gazeX:-11,eyeTear:.12},'snap'),E(.84,'worried',{gazeX:-11,eyeTear:.12}),
    E(.895,'worried',{gazeX:-6,brow:-10,eyeTear:.1},'snap'),
    E(1,'worried',{gazeX:-6,brow:-10,eyeTear:.1}),
  ],[B(.85)]),

  'blown-away':T(eyePose('surprise',{gazeX:-4,gazeY:-3}),[
    E(0),E(.015),E(.045,'alert',{gazeX:-11},'snap'),E(.12,'alert',{gazeX:-11}),
    E(.147,'focus',{gazeX:-10},'snap'),E(.275,'focus',{gazeX:-10}),
    E(.31,'startled',{gazeX:-8},'snap'),E(.38,'startled',{gazeX:-8}),
    E(.407,'surprise',{gazeX:-4,gazeY:-3},'snap'),E(.615,'surprise',{gazeX:-4,gazeY:-3}),
    E(.638,'squeeze',{},'in'),E(.68,'squeeze'),
    E(.705,'dizzy',{},'out'),E(.765,'dizzy'),
    E(.79,'deadpan',{gazeX:-10},'snap'),E(.87,'deadpan',{gazeX:-10}),
    E(.91,'smug',{gazeX:5},'snap'),E(1,'smug',{gazeX:5}),
  ]),
};

const changedControls=(a,b)=>Object.keys(b).filter(key=>a[key]!==b[key]);

/**
 * Compile authored eye beats once, in milliseconds. Full expressions need time
 * to read; only isolated gaze changes keep a shorter dart. A preceding hold can
 * give up time, retaining up to 120ms of its authored pause. Short opening rest
 * holds may be consumed. Any remaining expansion moves the expression later;
 * the next long hold absorbs it, without changing the body clock or clip length.
 * The result is ordinary keyframe data: seek, reverse and export sample exactly
 * the same timeline as playback, with no history-dependent smoothing.
 */
function paceEyePerformance(track,duration) {
  const source=track.frames;
  const frames=source.map(frame=>({...frame,at:frame.at*duration}));
  for(let i=1;i<frames.length;i++) {
    const a=frames[i-1],b=frames[i];
    const controls=changedControls(a.pose,b.pose);
    const original=(source[i].at-source[i-1].at)*duration;
    if(controls.length) {
      const minimum=controls.every(key=>key==='gazeX'||key==='gazeY')?120:220;
      const span=Math.max(original,minimum);
      if(i>1&&!changedControls(frames[i-2].pose,a.pose).length) {
        const hold=(source[i-1].at-source[i-2].at)*duration;
        const keep=i===2?0:Math.min(120,hold);
        a.at=Math.max(frames[i-2].at+keep,Math.min(a.at,b.at-span));
      }
      b.at=Math.max(b.at,a.at+span);
      b.ease='sine';
    } else {
      const keep=i===1?0:Math.min(120,original);
      b.at=Math.max(b.at,a.at+keep);
    }
  }
  if(frames.at(-1).at>duration+.001)throw new RangeError('Eye beats exceed the body duration');
  return {...track,frames:frames
    .filter((frame,i)=>!i||frame.at!==frames[i-1].at)
    .map(frame=>({...frame,at:frame.at/duration}))};
}

export function eyePerformance(id,duration) {
  if(!Object.hasOwn(performances,id))throw new RangeError(`Missing crow eye performance: ${id}`);
  if(!Number.isFinite(duration)||duration<=0)throw new RangeError('Eye performance needs its body duration');
  return paceEyePerformance(performances[id],duration);
}
