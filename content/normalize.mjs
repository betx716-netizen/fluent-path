// Remet les majuscules dans les réponses des phrases à construire
// (Gemini les écrit parfois en minuscules : « may » au lieu de « May »).
// Usage : node content/normalize.mjs  → corrige content/units/*.json sur place.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const UNITS = new URL("./units/", import.meta.url);
const PROPER = [
  "January", "February", "April", "June", "July", "August", "September", "October", "November", "December",
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  "I", "Mr", "Mrs", "Ms", "Dr", "Kodjo", "Awa", "Mensah", "Okafor", "Ama", "Koffi", "Kwame", "Lomé", "Lome", "Abidjan", "Cotonou",
  "Lagos", "Tema", "Ouagadougou", "Bamako", "Accra", "Kumasi", "Durban", "Togo", "Ghana", "Nigeria", "Benin", "China", "Europe", "Africa",
  "English", "French", "CIF", "FOB", "EXW", "DAP", "DDP", "DPU", "FCA", "CFR", "ETA", "ETD", "HS", "B/L", "CFA", "VAT", "MSC", "OK"
];
const lookup = new Map(PROPER.map(w => [w.toLowerCase(), w]));

// « may » et « march » sont aussi des verbes : majuscule seulement après of/in/on
// ou un nombre (« the 5th of May »).
const AMBIGUOUS = { may: "May", march: "March" };

export function fixCase(answer) {
  const raw = answer.trim().split(/\s+/);
  const words = raw.map((w, i) => {
    const amb = AMBIGUOUS[w.toLowerCase()];
    if (amb) return /^(of|in|on|\d+(st|nd|rd|th)?)$/i.test(raw[i - 1] ?? "") ? amb : w.toLowerCase();
    return lookup.get(w.toLowerCase()) ?? w;
  });
  if (words.length) words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(" ");
}

let changed = 0;
for (const f of readdirSync(UNITS)) {
  const path = new URL(f, UNITS);
  const unit = JSON.parse(readFileSync(path));
  let dirty = false;
  for (const ex of unit.exercises) {
    if (ex.type !== "build") continue;
    const fixed = fixCase(ex.answer);
    if (fixed !== ex.answer) {
      ex.answer = fixed;
      dirty = true;
    }
    // Les mots pièges suivent la même règle (sauf la majuscule de début).
    ex.extra = ex.extra.map(w => lookup.get(String(w).toLowerCase()) ?? w);
  }
  if (dirty) {
    writeFileSync(path, JSON.stringify(unit, null, 2));
    changed++;
  }
}
console.log(`${changed} unité(s) corrigée(s).`);
