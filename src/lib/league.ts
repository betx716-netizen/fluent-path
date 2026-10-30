import { today, weekEndsAt, weekOf, weekStart } from "./day";
import type { State } from "./store";

// Ligues hebdomadaires. L'app n'a qu'un utilisateur : les 19 autres joueurs
// sont simulés, avec un rythme différent chacun, et changent chaque semaine.
export const LEAGUES = [
  { name: "Cauri", color: "#c9a27a", dark: "#9c7653" },
  { name: "Bronze", color: "#d9884a", dark: "#a95f27" },
  { name: "Argent", color: "#a9b4c6", dark: "#7c879a" },
  { name: "Or", color: "#ffb31a", dark: "#e08a00" },
  { name: "Saphir", color: "#1f7aff", dark: "#145bd1" },
  { name: "Diamant", color: "#6c47ff", dark: "#4e2fd6" }
];
export const GROUP_SIZE = 20;
export const PROMOTE = 5;
export const DEMOTE = 5;

const NAMES = [
  "Awa", "Koffi", "Aminata", "Yao", "Fatou", "Ibrahim", "Adjoa", "Moussa", "Mariam", "Kwame",
  "Aïcha", "Sékou", "Grace", "Ousmane", "Esi", "Mamadou", "Akissi", "Kofi", "Ramatou", "Dieudonné",
  "Bintou", "Serge", "Nadège", "Abdoulaye", "Prisca", "Hervé", "Salimata", "Junior", "Clarisse", "Issa"
];

// Générateur pseudo-aléatoire déterministe (mulberry32).
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Player {
  name: string;
  xp: number;
  me: boolean;
}

export const weekXp = (s: State, week: number) => {
  let xp = 0;
  for (let d = weekStart(week); d < weekStart(week + 1); d++) xp += s.xpByDay[d] ?? 0;
  return xp;
};

// Classement de la semaine `week` au moment `progress` (0 = lundi, 1 = dimanche soir).
export function standings(s: State, tier: number, week: number, progress: number): Player[] {
  const r = rng(week * 97 + tier * 7919 + 13);
  const pool = NAMES.slice();
  const bots: Player[] = [];
  for (let i = 0; i < GROUP_SIZE - 1; i++) {
    const name = pool.splice(Math.floor(r() * pool.length), 1)[0];
    // Rythme de la semaine : certains jouent peu, d'autres beaucoup.
    const pace = r() < 0.15 ? 0 : (40 + tier * 45) * (0.3 + r() * 2.2);
    const start = r() * 0.4;
    const f = Math.max(0, Math.min(1, (progress - start) / (1 - start)));
    bots.push({ name, xp: Math.round(pace * 7 * f), me: false });
  }
  const me: Player = { name: s.profile.name || "Toi", xp: weekXp(s, week), me: true };
  return [...bots, me].sort((a, b) => b.xp - a.xp || (a.me ? -1 : b.me ? 1 : 0));
}

export function weekProgress(now = new Date()): number {
  const w = weekOf(today(now));
  const end = weekEndsAt(w, now);
  return Math.max(0, Math.min(1, 1 - (end - now.getTime()) / (7 * 86400000)));
}

// À l'ouverture d'une nouvelle semaine : montée, maintien ou descente.
export function rollLeague(s: State, now = new Date()): State {
  const week = weekOf(today(now));
  const L = s.league;
  if (L.week === week) return s;
  if (L.week === 0) return { ...s, league: { ...L, week } };
  const final = standings(s, L.tier, L.week, 1);
  const rank = final.findIndex(p => p.me) + 1;
  const played = weekXp(s, L.week) > 0;
  let change: -1 | 0 | 1 = 0;
  if (played && rank <= PROMOTE && L.tier < LEAGUES.length - 1) change = 1;
  else if (rank > GROUP_SIZE - DEMOTE && L.tier > 0) change = -1;
  return { ...s, league: { tier: L.tier + change, week, last: { week: L.week, rank, change } } };
}
