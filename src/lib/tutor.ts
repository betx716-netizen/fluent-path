import type { Scenario } from "../data/scenarios";
import { askJson, type Turn } from "./ai";

const LEVEL_STYLE: Record<Scenario["level"], string> = {
  A1: "Use very short, simple sentences (max 12 words) and only common words. Speak slowly and clearly.",
  A2: "Use short everyday sentences (max 16 words) and common business words.",
  B1: "Use natural everyday business English, with a few useful professional expressions.",
  B2: "Use fluent professional English with precise business vocabulary. Push back a little so the learner must argue.",
  C1: "Use sophisticated, precise professional English, including domain terms. Challenge the learner's arguments politely but firmly.",
  C2: "Speak like a demanding native professional: idiomatic, nuanced, fast-paced. Ask probing follow-up questions."
};

export interface TutorReply {
  reply: string;
  reply_fr: string;
  hint: string;
  objectives_done: string[];
  correction: { original: string; better: string; why_fr: string } | null;
  finished: boolean;
}

function systemFor(sc: Scenario) {
  return `You are ${sc.partner.name}, ${sc.partner.role} from ${sc.partner.origin}, in an English speaking role-play for a French-speaking learner from West Africa (level ${sc.level}).
Scene: ${sc.setting}
Rules:
- Stay in character. Never say you are an AI. ${LEVEL_STYLE[sc.level]}
- Reply in max 2 sentences and ask exactly one question to keep the conversation going.
- Gently steer the conversation so the learner can complete these objectives:
${sc.objectives.map(o => `  - "${o.id}": ${o.en}`).join("\n")}
- Do NOT correct the learner in your reply. Instead, put a correction of the learner's LAST message in "correction" only if it contains a real grammar or vocabulary mistake (not punctuation, not capital letters, not minor speech-recognition noise). Otherwise null.
- The learner's messages may come from speech recognition: ignore missing punctuation.
- When all objectives are done, or after the learner's 10th message, close the conversation politely in character and set "finished": true.
Answer with ONLY this JSON object:
{"reply": "your in-character line in English",
 "reply_fr": "French translation of your line",
 "hint": "a short example answer the learner could say next, in simple English",
 "objectives_done": ["ids of ALL objectives the learner has completed so far in the whole conversation"],
 "correction": {"original": "learner's wrong words", "better": "corrected sentence", "why_fr": "one short explanation in French"} or null,
 "finished": false}`;
}

export async function tutorTurn(sc: Scenario, history: Turn[]): Promise<TutorReply> {
  const r = await askJson<Partial<TutorReply>>(systemFor(sc), history);
  const ids = new Set(sc.objectives.map(o => o.id));
  return {
    reply: String(r.reply ?? "").trim() || "Sorry, could you say that again?",
    reply_fr: String(r.reply_fr ?? ""),
    hint: String(r.hint ?? ""),
    objectives_done: Array.isArray(r.objectives_done) ? r.objectives_done.map(String).filter(x => ids.has(x)) : [],
    correction: r.correction && r.correction.better ? r.correction : null,
    finished: !!r.finished
  };
}

export interface Report {
  score: number;
  summary_fr: string;
  errors: { original: string; better: string; rule_fr: string }[];
  new_words: { en: string; fr: string }[];
  next_focus_fr: string;
}

export async function tutorReport(sc: Scenario, history: Turn[], done: string[]): Promise<Report> {
  const transcript = history
    .map(t => `${t.role === "model" ? sc.partner.name : "Learner"}: ${t.text}`)
    .join("\n");
  const system = `You are a kind, precise English teacher for a French-speaking learner from West Africa (level ${sc.level}).
Here is a role-play transcript ("${sc.title}"). Objectives completed: ${done.join(", ") || "none"} out of ${sc.objectives.map(o => o.id).join(", ")}.
The learner's lines may come from speech recognition: ignore punctuation and capital letters.
Answer with ONLY this JSON object:
{"score": integer 0-100 for communication and accuracy at this level,
 "summary_fr": "2 short sentences in French: what went well, then the main thing to improve",
 "errors": [{"original": "learner's exact words", "better": "corrected version", "rule_fr": "the rule in one short French sentence"}] (the 3 most useful mistakes, fewer if there are fewer, [] if none),
 "new_words": [{"en": "useful word or phrase from this conversation", "fr": "French"}] (3 to 5 items the learner should learn),
 "next_focus_fr": "one concrete thing to practise next time, in French"}`;
  const r = await askJson<Partial<Report>>(system, [{ role: "user", text: transcript }]);
  return {
    score: Math.max(0, Math.min(100, Math.round(Number(r.score) || 0))),
    summary_fr: String(r.summary_fr ?? ""),
    errors: Array.isArray(r.errors) ? r.errors.slice(0, 3) : [],
    new_words: Array.isArray(r.new_words) ? r.new_words.filter(w => w?.en && w?.fr).slice(0, 5) : [],
    next_focus_fr: String(r.next_focus_fr ?? "")
  };
}
