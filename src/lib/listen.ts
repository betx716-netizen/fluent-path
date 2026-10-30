// Reconnaissance vocale gratuite de Chrome (Web Speech API).

interface RecognitionResult {
  isFinal: boolean;
  0: { transcript: string; confidence: number };
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: { resultIndex: number; results: ArrayLike<RecognitionResult> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

function ctor(): (new () => Recognition) | null {
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// Dans l'aperçu Claude, le micro est bloqué : on passe directement au clavier.
const inClaudePreview = () => typeof window !== "undefined" && !!(window as unknown as { claude?: unknown }).claude;
export const canListen = () => typeof window !== "undefined" && !!ctor() && !inClaudePreview();

export interface Heard {
  text: string;
  confidence: number;
}

export class ListenError extends Error {
  constructor(public code: "unsupported" | "denied" | "no_speech" | "network" | "aborted") {
    super(code);
  }
}

export const LISTEN_MESSAGES: Record<ListenError["code"], string> = {
  unsupported: "Ce navigateur ne reconnaît pas la voix. Utilise Chrome sur Android, ou écris ta réponse.",
  denied: "Le micro est bloqué. Autorise-le dans les réglages du navigateur, ou écris ta réponse.",
  no_speech: "Je n'ai rien entendu. Appuie sur le micro et parle un peu plus fort.",
  network: "La reconnaissance vocale a besoin d'Internet.",
  aborted: ""
};

// Démarre l'écoute. stop() termine et renvoie ce qui a été compris.
export function listen(opts: { lang?: string; onInterim?: (t: string) => void } = {}) {
  const C = ctor();
  let rec: Recognition | null = null;
  const promise = new Promise<Heard>((resolve, reject) => {
    if (!C) return reject(new ListenError("unsupported"));
    rec = new C();
    rec.lang = opts.lang ?? "en-US";
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 1;
    const finals: { text: string; confidence: number }[] = [];
    let interim = "";
    let failed = false;
    rec.onresult = e => {
      interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finals.push({ text: r[0].transcript, confidence: r[0].confidence });
        else interim += r[0].transcript;
      }
      opts.onInterim?.((finals.map(f => f.text).join(" ") + " " + interim).trim());
    };
    rec.onerror = e => {
      failed = true;
      const code =
        e.error === "not-allowed" || e.error === "service-not-allowed" ? "denied"
        : e.error === "no-speech" ? "no_speech"
        : e.error === "network" ? "network"
        : "aborted";
      reject(new ListenError(code));
    };
    rec.onend = () => {
      if (failed) return;
      const text = (finals.map(f => f.text).join(" ") + " " + interim).trim();
      if (!text) return reject(new ListenError("no_speech"));
      const conf = finals.length ? finals.reduce((a, f) => a + (f.confidence || 0.8), 0) / finals.length : 0.7;
      resolve({ text, confidence: conf });
    };
    try {
      rec.start();
    } catch {
      reject(new ListenError("aborted"));
    }
  });
  return {
    promise,
    stop: () => rec?.stop(),
    abort: () => rec?.abort()
  };
}
