import { COURSE_SETTINGS, PLAN, READY_UNITS, type CourseLesson, type CourseUnit } from "./course";
import type { Exercise, Section, Unit } from "./types";
import type { Scenario, Voice } from "./scenarios";

// Construit les exercices d'une leçon selon le schéma du programme ZAZOU.
const shuffle = <T,>(a: T[]): T[] => {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

// « Hello! How are you? » → « Hello How are you » (on garde virgules et « … »).
const orderAnswer = (en: string) => en.replace(/[.!?](?=\s|$)/g, "").replace(/\s+/g, " ").trim();

export function buildLessonExercises(lesson: CourseLesson): Exercise[] {
  const ex: Exercise[] = [];
  for (const wd of lesson.words) ex.push({ type: "discover", en: wd.en, fr: wd.fr, say: wd.say });
  for (const wd of lesson.words.slice(0, 3)) {
    const others = shuffle(lesson.words.filter(o => o.fr !== wd.fr)).slice(0, 2).map(o => o.fr);
    const options = shuffle([wd.fr, ...others]);
    ex.push({
      type: "mcq",
      prompt: `Que veut dire « ${wd.en} » ?`,
      options,
      answer: options.indexOf(wd.fr),
      explain: `« ${wd.en} » = ${wd.fr}. On le prononce à peu près « ${wd.say} ».`
    });
  }
  for (const dr of lesson.drills ?? []) {
    const options = shuffle(dr.options);
    ex.push({ type: "fill", sentence: dr.sentence, options, answer: options.indexOf(dr.answer), explain: dr.explain });
  }
  for (const ph of lesson.phrases.slice(0, 2)) {
    const answer = orderAnswer(ph.en);
    ex.push({ type: "listen_order", audio: ph.en, fr: ph.fr, tiles: answer.split(" "), answer });
  }
  for (const ph of lesson.phrases) ex.push({ type: "speak", text: ph.en, fr: ph.fr, pass: 70 });
  const last = lesson.phrases[lesson.phrases.length - 1];
  ex.push({ type: "speak_translate", fr: last.fr, answer: last.en, pass: 65 });
  return ex;
}

function toUnit(unit: CourseUnit, lesson: CourseLesson): Unit {
  return {
    id: lesson.id,
    title: lesson.title,
    context: "Quotidien",
    goal: lesson.goal,
    points: lesson.rules ?? [
      lesson.goal,
      `Grammaire de l'unité : ${unit.grammar}.`,
      ...lesson.words.slice(0, 2).map(wd => `« ${wd.en} » = ${wd.fr} (se dit « ${wd.say} »).`)
    ],
    examples: lesson.phrases.map(ph => [ph.en, ph.fr]),
    vocab: lesson.words.map(wd => [wd.en, wd.fr, wd.say]),
    exercises: buildLessonExercises(lesson),
    roleplay: lesson.roleplay,
    grammarIntro: !!lesson.rules,
    minutes: COURSE_SETTINGS.lessonMinutes.replace("-", " à ")
  };
}

// Chaque unité du programme devient une « section » de la carte, chaque leçon une étape.
export const GENERAL_SECTIONS: Section[] = PLAN.flatMap(ch => {
  const ready = READY_UNITS.filter(u => ch.units.some(pu => pu.id === u.id));
  const sections: Section[] = ready.map(u => ({
    id: u.id,
    track: "general",
    level: `Unité ${u.number}`,
    cefr: ch.level,
    title: u.title,
    theme: "sable",
    units: u.lessons.map(l => toUnit(u, l)),
    plannedUnits: u.lessons.length,
    chapter: `Chapitre ${ch.number} · ${ch.title}`
  }));
  const planned = ch.units.filter(pu => pu.status === "planned");
  if (planned.length) {
    sections.push({
      id: `${ch.id}-soon`,
      track: "general",
      level: `Chapitre ${ch.number}`,
      cefr: ch.level,
      title: ch.title,
      theme: "sable",
      units: [],
      plannedUnits: planned.length,
      chapter: `Chapitre ${ch.number} · ${ch.title}`,
      upcoming: planned.map(pu => ({ title: `${pu.number}. ${pu.title}`, situations: pu.situations }))
    });
  }
  return sections;
});

// Jeux de rôle des leçons « Conversation » du programme.
function voiceFor(role: string): { voice: Voice; origin: string } {
  if (/ghan/i.test(role)) return { voice: "en-GH", origin: "Ghana" };
  if (/améric/i.test(role)) return { voice: "en-US", origin: "États-Unis" };
  if (/anglais/i.test(role)) return { voice: "en-GB", origin: "Royaume-Uni" };
  return { voice: "en-NG", origin: "Côte d'Ivoire" };
}

export function scenarioFromLesson(unit: Unit): Scenario | null {
  const r = unit.roleplay;
  if (!r) return null;
  const [name, ...rest] = r.zazou_role.split(",");
  const { voice, origin } = voiceFor(r.zazou_role);
  return {
    id: unit.id,
    title: r.title,
    level: (PLAN.find(c => unit.id.startsWith(`${c.id}-`))?.level.slice(0, 2) ?? "A1") as Scenario["level"],
    context: "Quotidien",
    partner: { name: name.trim(), role: rest.join(",").trim() || "interlocuteur", voice, origin },
    setting: `${r.title}. You play ${r.zazou_role} (French description).`,
    goal: r.user_goal,
    opening: r.opening,
    openingFr: "",
    objectives: r.targets.map((t, i) => ({ id: `t${i + 1}`, fr: `Dire « ${t} »`, en: `the learner says "${t}" or a close variant` })),
    unlockAfter: unit.id.replace(/l5$/, "l4"),
    extra: r.system_prompt,
    maxTurns: r.max_turns
  };
}

export const GENERAL_SCENARIOS: Scenario[] = GENERAL_SECTIONS.flatMap(s => s.units)
  .map(scenarioFromLesson)
  .filter((x): x is Scenario => !!x);
