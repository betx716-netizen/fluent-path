import { allUnits } from "../data/units";
import { PASS_STARS } from "./game";
import { today } from "./day";
import type { Card, State } from "./store";

// Répétition espacée (variante simple de SM-2) : chaque mot revient
// juste avant l'oubli. 4 boutons : à revoir, difficile, bien, facile.

export const cardId = (en: string) => en.toLowerCase().trim();

export function addCards(s: State, words: { en: string; fr: string; ipa?: string }[]): State {
  const cards = { ...s.cards };
  let added = 0;
  for (const w of words) {
    const id = cardId(w.en);
    if (!id || cards[id]) continue;
    cards[id] = { en: w.en, fr: w.fr, ipa: w.ipa ?? "", due: today(), interval: 0, ease: 2.5, reps: 0 };
    added++;
  }
  return added ? { ...s, cards } : s;
}

// Le vocabulaire de chaque unité validée entre dans les révisions.
export function syncUnitCards(s: State): State {
  const words = allUnits
    .filter(u => (s.units[u.id]?.stars ?? 0) >= PASS_STARS)
    .flatMap(u => u.vocab.map(([en, fr, ipa]) => ({ en, fr, ipa })));
  return addCards(s, words);
}

export function dueCards(s: State, now = today()): [string, Card][] {
  return Object.entries(s.cards)
    .filter(([, c]) => c.due <= now)
    .sort((a, b) => a[1].due - b[1].due);
}

export type Grade = 0 | 1 | 2 | 3;

export function grade(c: Card, g: Grade, now = today()): Card {
  if (g === 0) return { ...c, interval: 0, ease: Math.max(1.3, c.ease - 0.2), due: now, reps: c.reps + 1 };
  let interval: number;
  let ease = c.ease;
  if (g === 1) {
    interval = Math.max(1, Math.round(c.interval * 1.2));
    ease = Math.max(1.3, ease - 0.15);
  } else if (g === 2) {
    interval = c.interval ? Math.round(c.interval * ease) : 1;
  } else {
    interval = c.interval ? Math.round(c.interval * ease * 1.3) : 4;
    ease += 0.15;
  }
  return { ...c, interval, ease, due: now + interval, reps: c.reps + 1 };
}
