import { useSyncExternalStore } from "react";
import { today } from "./day";

export type Goal = "travail" | "voyage" | "etudes";

export interface UnitProgress {
  stars: number;
  best: number;
  plays: number;
  completedAt: string;
}

export interface Card {
  en: string;
  fr: string;
  ipa: string;
  due: number;
  interval: number;
  ease: number;
  reps: number;
}

export interface RoleplayProgress {
  best: number;
  plays: number;
  lastAt: string;
}

export interface State {
  version: 1;
  profile: { name: string; goal: Goal; minutes: 10 | 20 | 30; onboarded: boolean };
  xpTotal: number;
  gems: number;
  streak: number;
  streakBest: number;
  lastActiveDay: number | null;
  freezes: number;
  units: Record<string, UnitProgress>;
  chests: Record<string, true>;
  xpByDay: Record<number, number>;
  minutesTotal: number;
  achievements: Record<string, string>;
  sound: boolean;
  cards: Record<string, Card>;
  roleplays: Record<string, RoleplayProgress>;
  speechScores: number[];
  ai: { geminiKey: string; passcode: string; model: string };
  accents: { heard: string[]; pairsBest: number; dictations: number };
  writings: { count: number; best: number };
  outfits: { owned: string[]; worn: string | null };
  zazouAt: string | null;
  bosses: Record<string, { best: number; passed: boolean }>;
  reports: { at: string; unit: string; text: string }[];
  updatedAt: string;
}

const KEY = "fluent-path/state";

export const initialState = (): State => ({
  version: 1,
  profile: { name: "", goal: "travail", minutes: 20, onboarded: false },
  xpTotal: 0,
  gems: 50,
  streak: 0,
  streakBest: 0,
  lastActiveDay: null,
  freezes: 1,
  units: {},
  chests: {},
  xpByDay: {},
  minutesTotal: 0,
  achievements: {},
  sound: true,
  cards: {},
  roleplays: {},
  speechScores: [],
  ai: { geminiKey: "", passcode: "", model: "gemini-flash-lite-latest" },
  accents: { heard: [], pairsBest: 0, dictations: 0 },
  writings: { count: 0, best: 0 },
  outfits: { owned: [], worn: null },
  zazouAt: null,
  bosses: {},
  reports: [],
  updatedAt: new Date().toISOString()
});

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s: State = { ...initialState(), ...JSON.parse(raw) };
      // gemini-2.5-flash a été fermé par Google aux nouveaux comptes.
      if (s.ai.model === "gemini-2.5-flash") s.ai = { ...s.ai, model: "gemini-flash-lite-latest" };
      return s;
    }
  } catch {
    /* stockage indisponible : on repart d'un état neuf */
  }
  return initialState();
}

let state: State = applyMissedDays(load());
const listeners = new Set<() => void>();

export function getState(): State {
  return state;
}

export function setState(update: (s: State) => State) {
  state = { ...update(state), updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* plein ou bloqué : l'état reste en mémoire */
  }
  listeners.forEach(l => l());
}

export function replaceState(next: State) {
  setState(() => next);
}

export function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => select(state));
}

// Au chargement : si des jours ont été manqués, on consomme des gels de série
// ou on remet la série à zéro.
export function applyMissedDays(s: State, now = today()): State {
  if (s.lastActiveDay === null || s.streak === 0) return s;
  const missed = now - s.lastActiveDay - 1;
  if (missed <= 0) return s;
  if (s.freezes >= missed) {
    return { ...s, freezes: s.freezes - missed, lastActiveDay: now - 1 };
  }
  return { ...s, streak: 0 };
}

export function dailyGoalXp(minutes: State["profile"]["minutes"]): number {
  return { 10: 30, 20: 50, 30: 80 }[minutes];
}
