// Génère les unités de content/syllabus.json avec Gemini, puis les vérifie.
// Usage : GEMINI_API_KEY=... node content/generate.mjs [idUnité ...]
// Sortie : content/units/<id>.json (une unité validée par fichier).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { validateUnit } from "./validate.mjs";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) throw new Error("GEMINI_API_KEY manquante");
const MODELS = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-flash-lite-latest"];
const OUT = new URL("./units/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const syllabus = JSON.parse(readFileSync(new URL("./syllabus.json", import.meta.url)));
const todo = Object.entries(syllabus).flatMap(([sid, s]) => s.units.map(u => ({ ...u, sid, cefr: s.cefr })));
const only = process.argv.slice(2);
const queue = todo.filter(u => (only.length ? only.includes(u.id) : !existsSync(new URL(`${u.id}.json`, OUT))));

const LEVEL = {
  A1: "absolute beginner: very short sentences (max 8 words), present simple, the most common words",
  A2: "elementary: short sentences (max 12 words), everyday business words",
  B1: "intermediate: natural sentences (max 16 words), common professional vocabulary",
  B2: "upper-intermediate: natural professional English, some complex sentences",
  C1: "advanced: precise professional English, nuanced vocabulary",
  C2: "proficient: native-like, idiomatic and nuanced"
};

function prompt(u, feedback = "") {
  return `You write one lesson for an English course app for a French-speaking adult from West Africa (Togo, Côte d'Ivoire, Benin…) who works in trade, freight forwarding and transit.
Lesson: "${u.title}" — level CEFR ${u.cefr} (${LEVEL[u.cefr]}). Context: ${u.context}.
Teaching focus: ${u.focus}
Learner goal (French): ${u.goal}

Use realistic West African business situations and names (Kodjo, Awa, Mr Mensah, Mrs Okafor, Ama, Koffi; Lomé, Abidjan, Cotonou, Lagos, Tema port, Ouagadougou). British spelling. All English must be 100 % correct and natural. All French must be correct, simple and use « » quotes.

Return ONLY a JSON object with exactly this shape:
{
 "goal": "${u.goal}",
 "points": [4 short teaching points in French, each max 25 words, explaining the rule or the key words, with English examples in quotes « »],
 "examples": [[English sentence, French translation] x4],
 "vocab": [[English word or phrase, French translation, British IPA between slashes] x6],
 "exercises": [exactly 10 items, in this order:
   {"type":"mcq","prompt":"question in French","options":[4 options],"answer":index,"explain":"French explanation"},
   {"type":"fill","sentence":"English sentence with exactly one ___ gap","options":[4 single words or short phrases],"answer":index,"explain":"French"},
   {"type":"listen","audio":"English sentence","options":[4 English sentences that sound similar, one identical to audio],"answer":index of the identical one,"explain":"French"},
   {"type":"build","fr":"French sentence","answer":"its English translation, words separated by single spaces, no punctuation","extra":[3 distractor words that are NOT in the answer],"explain":"French"},
   {"type":"pairs","pairs":[[English, French] x4]},
   {"type":"fill", ...another},
   {"type":"mcq", ...another, in context},
   {"type":"build", ...another},
   {"type":"listen", ...another},
   {"type":"speak","text":"a useful English sentence to say aloud (max 12 words)","fr":"French translation"}
 ]
}
Rules: exactly one correct option per question, the others clearly wrong for a teacher; vary the "answer" index (not always 0); build answers between 3 and 10 words, with only ONE correct word order and no contractions; extra words must not create another correct answer; pairs use words from this lesson; no duplicated options.${feedback}`;
}

async function callGemini(text) {
  let last;
  for (const model of MODELS) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.6 }
      })
    });
    if (r.ok) {
      const d = await r.json();
      return { model, text: d.candidates?.[0]?.content?.parts?.map(p => p.text ?? "").join("") ?? "" };
    }
    last = `${model}: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`;
    if (![404, 429, 500, 503].includes(r.status)) break;
  }
  throw new Error(last);
}

async function make(u) {
  let feedback = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    const t0 = Date.now();
    try {
      const { model, text } = await callGemini(prompt(u, feedback));
      const data = JSON.parse(text);
      const unit = { id: u.id, title: u.title, context: u.context, goal: u.goal, points: data.points, examples: data.examples, vocab: data.vocab, exercises: data.exercises };
      const problems = validateUnit(unit);
      if (!problems.length) {
        writeFileSync(new URL(`${u.id}.json`, OUT), JSON.stringify(unit, null, 2));
        console.log(`OK  ${u.id} (${model}, ${((Date.now() - t0) / 1000).toFixed(0)} s, essai ${attempt})`);
        return;
      }
      feedback = `\n\nYour previous answer had these problems, fix them all:\n- ${problems.join("\n- ")}`;
      console.log(`... ${u.id} essai ${attempt} : ${problems.length} problème(s)`);
    } catch (e) {
      console.log(`... ${u.id} essai ${attempt} : ${String(e.message).slice(0, 160)}`);
    }
  }
  console.log(`ÉCHEC ${u.id}`);
}

const CONCURRENCY = 5;
let i = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (i < queue.length) await make(queue[i++]);
}));
console.log(`Terminé : ${queue.length} unité(s) traitée(s).`);
