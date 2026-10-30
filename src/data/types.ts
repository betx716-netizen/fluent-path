export type Context = "Pro" | "Commerce" | "Transit";

export type Exercise =
  | { type: "mcq"; prompt: string; options: string[]; answer: number; explain: string }
  | { type: "fill"; sentence: string; options: string[]; answer: number; explain: string }
  | { type: "build"; fr: string; answer: string; extra: string[]; explain: string }
  | { type: "listen"; audio: string; options: string[]; answer: number; explain: string }
  | { type: "pairs"; pairs: [string, string][] }
  | { type: "speak"; text: string; fr: string };

export interface Unit {
  id: string;
  title: string;
  context: Context;
  goal: string;
  points: string[];
  examples: [string, string][];
  vocab: [string, string, string][];
  exercises: Exercise[];
}

export interface Section {
  id: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  cefr: string;
  title: string;
  theme: "sable" | "savane" | "nuit";
  units: Unit[];
  plannedUnits: number;
}
