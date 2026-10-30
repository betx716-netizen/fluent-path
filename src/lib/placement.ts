import { SECTIONS } from "../data/units";
import { PLAN } from "../data/course";
import { normWords } from "./score";
import type { Level, State } from "./store";

// Test de niveau oral : 6 questions de plus en plus difficiles, 3 minutes en tout.
// Notation hors ligne : longueur de la réponse + présence de la structure attendue.
export const LEVELS: Level[] = ["A0", "A1", "A2", "B1"];
export const TEST_SECONDS = 180;
export const ANSWER_SECONDS = 30;

export interface PlacementQuestion {
  en: string;
  fr: string;
  // Niveau que la question permet d'atteindre.
  level: Level;
  weight: number;
  // Structure attendue (temps du passé, « because », « would »…).
  expect: RegExp;
}

export const QUESTIONS: PlacementQuestion[] = [
  { en: "Hello! What's your name?", fr: "Bonjour ! Comment tu t'appelles ?", level: "A1", weight: 1, expect: /\b(my name|name is|i am|i'm|call me)\b/ },
  { en: "Where are you from, and where do you live?", fr: "D'où viens-tu et où habites-tu ?", level: "A1", weight: 1, expect: /\b(from|live|living)\b/ },
  { en: "What do you do every day? Tell me about your work.", fr: "Que fais-tu chaque jour ? Parle-moi de ton travail.", level: "A2", weight: 1.5, expect: /\b(i work|work|job|every day|usually|i sell|i am a|i'm a)\b/ },
  { en: "What did you do last weekend?", fr: "Qu'as-tu fait le week-end dernier ?", level: "A2", weight: 1.5, expect: /\b(went|was|were|did|had|saw|ate|visited|stayed|played|watched|bought|met|\w+ed)\b/ },
  { en: "Describe your city. What do you like about it?", fr: "Décris ta ville. Qu'est-ce que tu aimes chez elle ?", level: "B1", weight: 2, expect: /\b(because|there is|there are|people|beautiful|busy|like|love)\b/ },
  { en: "If you could travel anywhere, where would you go, and why?", fr: "Si tu pouvais voyager n'importe où, où irais-tu, et pourquoi ?", level: "B1", weight: 2, expect: /\b(would|i'd|because|want to|dream)\b/ }
];

const MAX = 4;

// Note d'une réponse : 0 à 4.
export function scoreAnswer(q: PlacementQuestion, heard: string): number {
  const words = normWords(heard);
  const n = words.length;
  if (n < 2) return 0;
  let pts = n >= 12 ? 3 : n >= 6 ? 2 : 1;
  if (q.expect.test(words.join(" "))) pts += 1;
  return Math.min(MAX, pts);
}

// Niveau estimé à partir des réponses données jusqu'ici. On ne dépasse pas
// le niveau des questions déjà posées (2 questions → A1 au plus, etc.).
export function estimate(scores: number[]): Level {
  if (!scores.length) return "A0";
  let got = 0;
  let max = 0;
  scores.forEach((sc, i) => {
    got += sc * QUESTIONS[i].weight;
    max += MAX * QUESTIONS[i].weight;
  });
  const total = QUESTIONS.reduce((a, q) => a + MAX * q.weight, 0);
  // Les questions sans réponse comptent pour 0 une fois le test terminé.
  const ratio = scores.length === QUESTIONS.length ? got / total : got / max;
  const byScore = ratio < 0.25 ? 0 : ratio < 0.5 ? 1 : ratio < 0.78 ? 2 : 3;
  const ceiling = LEVELS.indexOf(QUESTIONS[scores.length - 1].level);
  return LEVELS[Math.min(byScore, ceiling)];
}

// Chapitre de départ du parcours général et niveau CECR du parcours pro.
const START_CHAPTER: Record<Level, number> = { A0: 1, A1: 2, A2: 3, B1: 5 };
const PRO_CEFR: Record<Level, string> = { A0: "A1", A1: "A1", A2: "A2", B1: "B1" };

export function startInfo(level: Level) {
  const chapter = PLAN.find(c => c.number === START_CHAPTER[level])!;
  // Première unité déjà rédigée du chapitre, sinon la première tout court.
  const unit = chapter.units.find(u => u.status === "ready") ?? chapter.units[0];
  return { chapter, unitTitle: `${unit.number}. ${unit.title}`, ready: unit.status === "ready" };
}

// Le niveau final fixe l'unité de départ : on ouvre les sections qui précèdent
// (sans les marquer comme faites) dans les deux parcours.
export function applyPlacement(s: State, level: Level): State {
  const bosses = { ...s.bosses };
  const open = (ids: string[]) => ids.forEach(id => (bosses[id] = { best: bosses[id]?.best ?? 0, passed: true }));
  const chapterIds = PLAN.filter(c => c.number < START_CHAPTER[level]).flatMap(c => c.units.map(u => u.id));
  const general = SECTIONS.filter(x => x.track === "general" && x.units.length > 0);
  // Une section ne s'ouvre que si la précédente est validée : on valide toutes celles d'avant le départ.
  const before = general.filter(x => chapterIds.includes(x.id));
  // Chapitre de départ pas encore écrit : on ouvre tout ce qui existe.
  open(before.slice(0, Math.min(before.length, general.length - 1)).map(x => x.id));
  const pro = SECTIONS.filter(x => x.track === "pro" && x.units.length > 0);
  const k = pro.findIndex(x => x.cefr === PRO_CEFR[level]);
  if (k > 0) open(pro.slice(0, k).map(x => x.id));
  return { ...s, bosses, placement: { level, at: new Date().toISOString() } };
}

// Avancée sur l'échelle A0 → B1 (0 à 3) : niveau du test de départ, ou unités
// du parcours général validées (10 unités par niveau), le plus haut des deux.
export function levelValue(s: State): number {
  const general = SECTIONS.filter(x => x.track === "general" && x.units.length > 0);
  const done = general.filter(x => x.units.every(u => (s.units[u.id]?.stars ?? 0) >= 3)).length;
  const fromTest = s.placement ? LEVELS.indexOf(s.placement.level) : 0;
  return Math.min(3, Math.max(fromTest, done / 10));
}
