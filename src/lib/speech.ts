// Voix gratuites du téléphone (Web Speech API). Aucune clé, aucun coût.
export type Accent = "en-GB" | "en-US";

let voices: SpeechSynthesisVoice[] = [];
function refresh() {
  try {
    voices = window.speechSynthesis?.getVoices() ?? [];
  } catch {
    voices = [];
  }
}
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  refresh();
  window.speechSynthesis.addEventListener?.("voiceschanged", refresh);
}

function voiceFor(lang: string) {
  const l = lang.toLowerCase();
  return voices.find(v => v.lang.replace("_", "-").toLowerCase() === l) ?? null;
}

export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

export function speak(text: string, opts: { accent?: Accent; rate?: number } = {}): Promise<void> {
  if (!canSpeak()) return Promise.resolve();
  const lang = opts.accent ?? "en-GB";
  window.speechSynthesis.cancel();
  return new Promise(resolve => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const v = voiceFor(lang);
    if (v) u.voice = v;
    u.rate = opts.rate ?? 0.92;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}
