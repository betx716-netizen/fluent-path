import { SECTIONS } from "../data/units";
import type { Section, Unit } from "../data/types";
import { today } from "./day";
import type { State } from "./store";

export const XP_PER_CORRECT = 10;
export const GEMS_PER_LESSON = 5;
export const GEMS_PER_CHEST = 20;
export const FREEZE_PRICE = 50;
export const PASS_STARS = 3;

export function starsFor(accuracy: number): number {
  if (accuracy >= 0.95) return 5;
  if (accuracy >= 0.85) return 4;
  if (accuracy >= 0.7) return 3;
  if (accuracy >= 0.5) return 2;
  return 1;
}

export type NodeState = "locked" | "current" | "done";

export function unitState(s: State, section: Section, index: number): NodeState {
  const unit = section.units[index];
  if ((s.units[unit.id]?.stars ?? 0) >= PASS_STARS) return "done";
  if (!sectionOpen(s, section)) return "locked";
  if (index === 0) return "current";
  const prev = section.units[index - 1];
  return (s.units[prev.id]?.stars ?? 0) >= PASS_STARS ? "current" : "locked";
}

export function sectionOpen(s: State, section: Section): boolean {
  const i = SECTIONS.indexOf(section);
  if (i <= 0) return true;
  const prev = SECTIONS[i - 1];
  return prev.units.length > 0 && prev.units.every(u => (s.units[u.id]?.stars ?? 0) >= PASS_STARS);
}

// Un coffre après la 5e unité de chaque section.
export const CHEST_AFTER = 5;
export function chestId(section: Section) {
  return `${section.id}-chest`;
}
export function chestReady(s: State, section: Section) {
  const u = section.units[CHEST_AFTER - 1];
  return !!u && (s.units[u.id]?.stars ?? 0) >= PASS_STARS && !s.chests[chestId(section)];
}

export interface LessonResult {
  unit: Unit;
  firstTry: number;
  total: number;
  seconds: number;
}

export interface Reward {
  xp: number;
  bonus: number;
  gems: number;
  stars: number;
  accuracy: number;
  streakUp: boolean;
  streak: number;
  newAchievements: string[];
}

export const ACHIEVEMENTS: Record<string, { title: string; desc: string }> = {
  first_lesson: { title: "Premier pas", desc: "Terminer une première leçon" },
  perfect: { title: "Sans faute", desc: "Réussir une leçon à 100 %" },
  streak_3: { title: "Ça chauffe", desc: "3 jours de suite" },
  streak_7: { title: "Une semaine pleine", desc: "7 jours de suite" },
  streak_30: { title: "Mois en feu", desc: "30 jours de suite" },
  xp_100: { title: "100 XP", desc: "Gagner 100 XP" },
  xp_500: { title: "500 XP", desc: "Gagner 500 XP" },
  chest_1: { title: "Chercheur d'or", desc: "Ouvrir un premier coffre" },
  section_1: { title: "Premiers contacts", desc: "Valider toute la section 1" },
  first_talk: { title: "Premier échange", desc: "Terminer un premier jeu de rôle" },
  talk_5: { title: "Bavard", desc: "Terminer 5 jeux de rôle différents" },
  talk_90: { title: "Comme un pro", desc: "Obtenir 90/100 ou plus dans un jeu de rôle" },
  reviews_50: { title: "Mémoire d'éléphant", desc: "Réviser 50 cartes" },
  accents_6: { title: "Oreille du monde", desc: "Écouter les 6 accents" },
  pairs_10: { title: "Oreille fine", desc: "10/10 aux paires minimales" },
  dictation_10: { title: "Scribe", desc: "Faire 10 dictées" },
  writer: { title: "Plume", desc: "Faire corriger un premier texte" },
  writer_90: { title: "Belle plume", desc: "Obtenir 90/100 ou plus à l'écrit" },
  outfit: { title: "Élégant", desc: "Offrir une tenue à Zazou" }
};

export function finishLesson(s: State, r: LessonResult, now = today()): { next: State; reward: Reward } {
  const accuracy = r.total ? r.firstTry / r.total : 0;
  const stars = starsFor(accuracy);
  const base = r.firstTry * XP_PER_CORRECT;
  const bonus = accuracy === 1 ? Math.round(base * 0.5) : 0;
  const xp = base + bonus;

  let streak = s.streak;
  let streakUp = false;
  if (s.lastActiveDay !== now) {
    streak = s.lastActiveDay === now - 1 ? s.streak + 1 : 1;
    streakUp = true;
  }

  const prev = s.units[r.unit.id];
  const next: State = {
    ...s,
    xpTotal: s.xpTotal + xp,
    gems: s.gems + GEMS_PER_LESSON,
    streak,
    streakBest: Math.max(s.streakBest, streak),
    lastActiveDay: now,
    minutesTotal: s.minutesTotal + Math.max(1, Math.round(r.seconds / 60)),
    xpByDay: { ...s.xpByDay, [now]: (s.xpByDay[now] ?? 0) + xp },
    units: {
      ...s.units,
      [r.unit.id]: {
        stars: Math.max(prev?.stars ?? 0, stars),
        best: Math.max(prev?.best ?? 0, Math.round(accuracy * 100)),
        plays: (prev?.plays ?? 0) + 1,
        completedAt: new Date().toISOString()
      }
    }
  };

  const unlocked = checkAchievements(s, next, accuracy);
  next.achievements = { ...next.achievements, ...Object.fromEntries(unlocked.map(a => [a, new Date().toISOString()])) };

  return {
    next,
    reward: { xp, bonus, gems: GEMS_PER_LESSON, stars, accuracy, streakUp, streak, newAchievements: unlocked }
  };
}

export function checkAchievements(before: State, after: State, accuracy?: number): string[] {
  const has = (k: string) => !!before.achievements[k];
  const out: string[] = [];
  const add = (k: string, cond: boolean) => cond && !has(k) && out.push(k);
  add("first_lesson", Object.keys(after.units).length > 0);
  add("perfect", accuracy === 1);
  add("streak_3", after.streak >= 3);
  add("streak_7", after.streak >= 7);
  add("streak_30", after.streak >= 30);
  add("xp_100", after.xpTotal >= 100);
  add("xp_500", after.xpTotal >= 500);
  add("chest_1", Object.keys(after.chests).length > 0);
  add("section_1", SECTIONS[0].units.every(u => (after.units[u.id]?.stars ?? 0) >= PASS_STARS));
  add("first_talk", Object.keys(after.roleplays).length > 0);
  add("talk_5", Object.keys(after.roleplays).length >= 5);
  add("talk_90", Object.values(after.roleplays).some(r => r.best >= 90));
  add("reviews_50", Object.values(after.cards).reduce((a, c) => a + c.reps, 0) >= 50);
  add("accents_6", after.accents.heard.length >= 6);
  add("pairs_10", after.accents.pairsBest >= 10);
  add("dictation_10", after.accents.dictations >= 10);
  add("writer", after.writings.count > 0);
  add("writer_90", after.writings.best >= 90);
  add("outfit", after.outfits.owned.length > 0);
  return out;
}

export function openChest(s: State, section: Section): State {
  const next = { ...s, gems: s.gems + GEMS_PER_CHEST, chests: { ...s.chests, [chestId(section)]: true as const } };
  const unlocked = checkAchievements(s, next);
  return { ...next, achievements: { ...next.achievements, ...Object.fromEntries(unlocked.map(a => [a, new Date().toISOString()])) } };
}

export function buyFreeze(s: State): State | null {
  if (s.gems < FREEZE_PRICE || s.freezes >= 2) return null;
  return { ...s, gems: s.gems - FREEZE_PRICE, freezes: s.freezes + 1 };
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Activité hors leçon (jeu de rôle, révisions) : XP, objectif du jour et série.
export function addActivity(s: State, xp: number, seconds: number, now = today()): { next: State; streakUp: boolean } {
  let streak = s.streak;
  let streakUp = false;
  if (s.lastActiveDay !== now) {
    streak = s.lastActiveDay === now - 1 ? s.streak + 1 : 1;
    streakUp = true;
  }
  const next: State = {
    ...s,
    xpTotal: s.xpTotal + xp,
    streak,
    streakBest: Math.max(s.streakBest, streak),
    lastActiveDay: now,
    minutesTotal: s.minutesTotal + Math.round(seconds / 60),
    xpByDay: { ...s.xpByDay, [now]: (s.xpByDay[now] ?? 0) + xp }
  };
  return { next, streakUp };
}

export function withAchievements(before: State, after: State): { next: State; unlocked: string[] } {
  const unlocked = checkAchievements(before, after);
  return {
    next: { ...after, achievements: { ...after.achievements, ...Object.fromEntries(unlocked.map(a => [a, new Date().toISOString()])) } },
    unlocked
  };
}

export const XP_ROLEPLAY = 20;
export const XP_OBJECTIVE = 5;
