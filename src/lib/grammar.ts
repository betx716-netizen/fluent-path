import { CARDS_PER_QUIZ, TOPICS, type GrammarItem, type GrammarTopic } from "../data/grammar";
import type { Exercise, Unit } from "../data/types";
import { shuffle } from "./game";
import type { State } from "./store";

export interface GrammarProgress {
  // Prochaine carte à réviser (on boucle sur le thème).
  cursor: number;
  // Cartes révisées depuis le dernier mini-exercice réussi.
  since: number;
  quizzes: number;
  passed: number;
}

export const QUIZ_PREFIX = "gram-";
export const emptyProgress = (): GrammarProgress => ({ cursor: 0, since: 0, quizzes: 0, passed: 0 });
export const progressOf = (s: State, id: string) => s.grammar[id] ?? emptyProgress();
export const quizReady = (p: GrammarProgress) => p.since >= CARDS_PER_QUIZ;

// Les 10 dernières cartes révisées.
export function lastCards(topic: GrammarTopic, p: GrammarProgress): GrammarItem[] {
  const n = topic.items.length;
  return Array.from({ length: CARDS_PER_QUIZ }, (_, k) => topic.items[(((p.cursor - CARDS_PER_QUIZ + k) % n) + n) % n]);
}

const blank = (it: GrammarItem) => it.ex.replace(new RegExp(`(^|[^A-Za-z])${it.en}(?=[^A-Za-z]|$)`), "$1___");

// Mini-exercice : 2 « que veut dire… », 2 phrases à compléter (compris ?),
// 2 phrases à dire au micro (bien prononcé ?).
export function buildQuiz(topic: GrammarTopic, p: GrammarProgress): Unit {
  const cards = shuffle(lastCards(topic, p));
  const ex: Exercise[] = [];
  for (const it of cards.slice(0, 2)) {
    const others = shuffle(topic.items.filter(o => o.fr !== it.fr)).slice(0, 2).map(o => o.fr);
    const options = shuffle([it.fr, ...others]);
    ex.push({ type: "mcq", prompt: `Que veut dire « ${it.en} » ?`, options, answer: options.indexOf(it.fr), explain: `« ${it.en} » = ${it.fr}. Se dit « ${it.say} ».` });
  }
  for (const it of cards.slice(2, 4)) {
    const wrong = it.wrong ?? shuffle(topic.items.filter(o => o.en !== it.en)).slice(0, 2).map(o => o.en);
    const options = shuffle([it.en, ...wrong.slice(0, 2)]);
    ex.push({ type: "fill", sentence: blank(it), options, answer: options.indexOf(it.en), explain: `${it.ex} = ${it.exFr}${it.note ? ` ${it.note}` : ""}` });
  }
  for (const it of cards.slice(4, 6)) ex.push({ type: "speak", text: it.ex, fr: it.exFr, pass: 70 });
  return {
    id: `${QUIZ_PREFIX}${topic.id}-${p.quizzes + 1}`,
    title: `Mini-exercice · ${topic.title}`,
    context: "Quotidien",
    goal: "Vérifie que tu as compris et que tu sais prononcer.",
    points: [],
    examples: [],
    vocab: [],
    exercises: ex,
    noIntro: true
  };
}

export const topicOfQuiz = (unitId: string) => TOPICS.find(t => unitId.startsWith(`${QUIZ_PREFIX}${t.id}-`));

// Résultat du mini-exercice : réussi (3 étoiles, 70 %) → 10 nouvelles cartes.
export function recordQuiz(s: State, unitId: string, stars: number): State {
  const topic = topicOfQuiz(unitId);
  if (!topic) return s;
  const p = progressOf(s, topic.id);
  const ok = stars >= 3;
  const units = { ...s.units };
  delete units[unitId];
  return {
    ...s,
    units,
    grammar: { ...s.grammar, [topic.id]: { ...p, quizzes: p.quizzes + 1, passed: p.passed + (ok ? 1 : 0), since: ok ? 0 : p.since } }
  };
}
