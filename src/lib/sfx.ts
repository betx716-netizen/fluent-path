import { getState } from "./store";

// Sons générés à la volée (aucun fichier à télécharger).
let ctx: AudioContext | null = null;

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", gain = 0.18) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start);
  o.stop(ctx.currentTime + start + dur + 0.02);
}

function ready() {
  if (!getState().sound) return false;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return true;
  } catch {
    return false;
  }
}

function buzz(ms: number | number[]) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* pas de vibreur */
  }
}

export const sfx = {
  correct() {
    buzz(20);
    if (!ready()) return;
    tone(660, 0, 0.12, "triangle");
    tone(990, 0.09, 0.2, "triangle");
  },
  wrong() {
    buzz([40, 40, 40]);
    if (!ready()) return;
    tone(220, 0, 0.18, "square", 0.08);
    tone(180, 0.12, 0.22, "square", 0.08);
  },
  tap() {
    if (!ready()) return;
    tone(520, 0, 0.05, "sine", 0.08);
  },
  victory() {
    buzz([30, 60, 30]);
    if (!ready()) return;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, "triangle"));
  },
  chest() {
    if (!ready()) return;
    [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.07, 0.25, "sine", 0.14));
  }
};
