import type { RoleplayDef } from "./course";

export type Context = "Pro" | "Commerce" | "Transit" | "Quotidien";
export type Track = "general" | "pro";

export type Exercise =
  | { type: "mcq"; prompt: string; options: string[]; answer: number; explain: string }
  | { type: "fill"; sentence: string; options: string[]; answer: number; explain: string }
  | { type: "build"; fr: string; answer: string; extra: string[]; explain: string }
  | { type: "listen"; audio: string; options: string[]; answer: number; explain: string }
  | { type: "pairs"; pairs: [string, string][] }
  | { type: "speak"; text: string; fr: string; pass?: number }
  // Programme ZAZOU
  | { type: "discover"; en: string; fr: string; say: string }
  | { type: "listen_order"; audio: string; fr: string; tiles: string[]; answer: string }
  | { type: "speak_translate"; fr: string; answer: string; pass?: number };

export interface Unit {
  id: string;
  title: string;
  context: Context;
  goal: string;
  points: string[];
  examples: [string, string][];
  vocab: [string, string, string][];
  exercises: Exercise[];
  roleplay?: RoleplayDef;
  minutes?: string;
  // Leçon de grammaire : on montre les règles avant les exercices.
  grammarIntro?: boolean;
  // Mini-exercice : pas d'écran d'introduction.
  noIntro?: boolean;
}

export interface Section {
  id: string;
  track: Track;
  level: string;
  cefr: string;
  title: string;
  theme: "sable" | "savane" | "nuit";
  units: Unit[];
  plannedUnits: number;
  chapter?: string;
  // Unités prévues mais pas encore écrites (affichées « bientôt »)
  upcoming?: { title: string; situations: string }[];
}
