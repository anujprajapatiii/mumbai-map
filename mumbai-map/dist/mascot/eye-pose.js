/** Numeric eye controls shared by the rig, timelines and exported stills. */
export const eyeRestPose = Object.freeze({
  blink:0,lidTop:0,lidBottom:0,lidTilt:0,gazeX:0,gazeY:0,pupil:.96,brow:0,
  eyeWide:0,eyeSharp:0,eyeCurve:0,eyeShine:.35,eyeSpark:0,eyeSpiral:0,eyeTear:0,browLift:0,
});

// Expressions are authored poses, not runtime modes: every control can blend,
// scrub backward and settle without introducing a second animation clock.
export const eyeExpressions = Object.freeze({
  neutral:{},
  alert:{pupil:.82,eyeWide:.4,eyeShine:.55,browLift:.2},
  curious:{pupil:1.04,eyeWide:.15,eyeShine:.75,browLift:.35},
  focus:{pupil:.68,lidTop:.22,lidBottom:.1,eyeSharp:.85,lidTilt:13,eyeShine:.1},
  suspicious:{pupil:.72,lidTop:.48,lidBottom:.08,eyeSharp:.75,lidTilt:12,eyeShine:.1,brow:10},
  smug:{pupil:.9,lidTop:.38,lidBottom:.15,eyeSharp:.3,lidTilt:-8,eyeShine:.3,browLift:.15},
  surprise:{pupil:.27,eyeWide:1,eyeShine:0,browLift:.9},
  startled:{pupil:.42,eyeWide:.7,eyeShine:.12,browLift:.6},
  happy:{blink:1,eyeCurve:1,eyeShine:0,browLift:.15},
  pleased:{pupil:1,lidBottom:.29,eyeCurve:.65,eyeShine:.65},
  sparkle:{pupil:1.08,eyeWide:.32,eyeSpark:1,eyeShine:0,browLift:.45},
  sleepy:{pupil:1,lidTop:.68,lidBottom:.03,eyeSharp:.18,eyeCurve:-.55,eyeShine:.1,browLift:-.2},
  asleep:{blink:1,eyeCurve:-.65,eyeShine:0,browLift:-.15},
  deadpan:{pupil:.58,lidTop:.52,lidBottom:.24,eyeSharp:1,eyeShine:0},
  angry:{pupil:.52,lidTop:.26,lidBottom:.12,eyeSharp:1,lidTilt:21,brow:16,browLift:-.12,eyeShine:0},
  worried:{pupil:.83,lidBottom:.13,lidTilt:-13,eyeShine:.8,brow:-17,browLift:.5},
  tender:{pupil:1.08,lidBottom:.12,eyeShine:1,eyeTear:.32,brow:-10,browLift:.3},
  dizzy:{pupil:.5,eyeWide:.4,eyeSpiral:1,eyeShine:0,browLift:.4},
  squeeze:{blink:1,eyeCurve:.25,eyeSharp:1,eyeShine:0},
});

export function eyePose(expression='neutral',overrides={}) {
  if(!Object.hasOwn(eyeExpressions,expression))throw new RangeError(`Unknown eye expression: ${expression}`);
  return {...eyeRestPose,...eyeExpressions[expression],...overrides};
}
