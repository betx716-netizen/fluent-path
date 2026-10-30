// Note de prononciation gratuite : on compare, mot à mot, ce que Chrome a compris
// avec la phrase attendue. Ce n'est pas une note son par son (Azure, plus tard),
// mais un mot mal prononcé est en général mal reconnu.

export const normWords = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/\b(\d+)\b/g, m => NUMBERS[+m] ?? m)
    .replace(/[^a-z0-9' ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const NUMBERS: Record<number, string> = {
  0: "zero", 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine",
  10: "ten", 11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen", 16: "sixteen",
  17: "seventeen", 18: "eighteen", 19: "nineteen", 20: "twenty", 30: "thirty", 40: "forty", 50: "fifty"
};

// Contractions : « I'm » et « I am » valent la même chose.
const EXPAND: Record<string, string[]> = {
  "i'm": ["i", "am"], "it's": ["it", "is"], "what's": ["what", "is"], "you're": ["you", "are"],
  "that's": ["that", "is"], "let's": ["let", "us"], "don't": ["do", "not"], "i'd": ["i", "would"]
};
const expand = (w: string[]) => w.flatMap(x => EXPAND[x] ?? [x]);

export interface WordScore {
  word: string;
  ok: boolean;
}

export function scoreSpeech(target: string, heard: string, confidence = 0.85): { score: number; words: WordScore[] } {
  const display = target.replace(/[.?!,]/g, "").split(/\s+/).filter(Boolean);
  const T = expand(normWords(target));
  const H = expand(normWords(heard));
  const L = Array.from({ length: T.length + 1 }, () => Array(H.length + 1).fill(0));
  for (let i = T.length - 1; i >= 0; i--)
    for (let j = H.length - 1; j >= 0; j--)
      L[i][j] = T[i] === H[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const okSet = new Set<number>();
  let i = 0, j = 0;
  while (i < T.length && j < H.length) {
    if (T[i] === H[j]) { okSet.add(i); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) i++;
    else j++;
  }
  const ratio = T.length ? okSet.size / T.length : 0;
  const extra = Math.max(0, H.length - T.length) * 0.03;
  const score = Math.round(Math.max(0, Math.min(1, ratio * (0.9 + 0.1 * confidence) - extra)) * 100);

  // On reporte le résultat sur les mots affichés (les contractions comptent pour 2).
  let k = 0;
  const words = display.map(w => {
    const n = expand(normWords(w)).length || 1;
    let ok = true;
    for (let x = 0; x < n; x++) if (!okSet.has(k + x)) ok = false;
    k += n;
    return { word: w, ok };
  });
  return { score, words };
}

export const PASS_SPEECH = 70;
