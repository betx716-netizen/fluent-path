// Relecture par un « second professeur » : signale les erreurs d'anglais, de français
// et les questions ambiguës. Usage : GEMINI_API_KEY=... node content/review.mjs [id ...]
// Sortie : content/reviews/<id>.json  ({ issues: [...] }).
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) throw new Error("GEMINI_API_KEY manquante");
const MODELS = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-flash-lite-latest"];
const UNITS = new URL("./units/", import.meta.url);
const OUT = new URL("./reviews/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const only = process.argv.slice(2);
const ids = readdirSync(UNITS).map(f => f.replace(".json", "")).filter(id => (only.length ? only.includes(id) : !existsSync(new URL(`${id}.json`, OUT))));

const prompt = unit => `You are a meticulous English teacher and a native French speaker reviewing a lesson of an English course for French-speaking adults (West Africa, trade and freight). Check EVERYTHING:
- English grammar, spelling (British), naturalness;
- French translations and explanations (correct and faithful);
- every question has exactly ONE correct answer and "answer" points to it; distractors must be clearly wrong;
- "build" exercises: the English answer is a correct translation of "fr" and the only sensible order; no extra word could form another valid answer;
- "listen": options[answer] equals the audio;
- IPA is plausible British IPA;
- level and content match the lesson title.
Only report REAL problems (not style preferences). Answer with ONLY JSON:
{"issues": [{"where": "e.g. exercises[3].options[1] or vocab[2][2]", "problem": "short description", "fix": "the exact corrected value"}]}
Return {"issues": []} if the lesson is correct.

Lesson JSON:
${JSON.stringify(unit)}`;

async function call(text) {
  let last;
  for (const model of MODELS) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.2 } })
    });
    if (r.ok) {
      const d = await r.json();
      return { model, text: d.candidates?.[0]?.content?.parts?.map(p => p.text ?? "").join("") ?? "" };
    }
    last = `${model}: HTTP ${r.status}`;
    if (![404, 429, 500, 503].includes(r.status)) break;
  }
  throw new Error(last);
}

let i = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (i < ids.length) {
    const id = ids[i++];
    try {
      const unit = JSON.parse(readFileSync(new URL(`${id}.json`, UNITS)));
      const { model, text } = await call(prompt(unit));
      const data = JSON.parse(text);
      writeFileSync(new URL(`${id}.json`, OUT), JSON.stringify({ model, ...data }, null, 2));
      console.log(`${id}: ${data.issues?.length ?? "?"} problème(s) (${model})`);
    } catch (e) {
      console.log(`${id}: échec ${String(e.message).slice(0, 120)}`);
    }
  }
}));
console.log("Relecture terminée.");
