// Applique les corrections retenues après relecture (content/reviews + relecture humaine).
import { readFileSync, writeFileSync } from "node:fs";
const U = id => new URL(`./units/${id}.json`, import.meta.url);
const load = id => JSON.parse(readFileSync(U(id)));
const save = (id, u) => writeFileSync(U(id), JSON.stringify(u, null, 2));

// Chemin du type « exercises[5].options[0] » ou « vocab[1][2] ».
function setPath(obj, path, value) {
  const keys = path.replace(/\]\.?\[/g, "][").replace(/\.\[/g, "[").match(/[^.[\]]+/g).map(k => (/^\d+$/.test(k) ? +k : k));
  let o = obj;
  for (const k of keys.slice(0, -1)) o = o[k];
  o[keys[keys.length - 1]] = value;
}

const SKIP = new Set(["s4u8|exercises[7].answer"]); // corrigé autrement ci-dessous
const reviews = new URL("./reviews/", import.meta.url);
import { readdirSync } from "node:fs";
for (const f of readdirSync(reviews)) {
  const id = f.replace(".json", "");
  const r = JSON.parse(readFileSync(new URL(f, reviews)));
  if (!r.issues?.length) continue;
  const u = load(id);
  for (const i of r.issues) {
    if (SKIP.has(`${id}|${i.where}`)) continue;
    setPath(u, i.where, i.fix);
  }
  save(id, u);
}

// Corrections de la relecture humaine.
const manual = {
  s4u8: u => { u.exercises[7].fr = "Je travaille à Abidjan depuis cinq ans."; },
  s5u1: u => {
    u.vocab[0][1] = "départ usine";
    u.exercises[1].options = ["loaded", "unloaded", "stored", "inspected"];
    u.exercises[1].answer = 0;
    u.exercises[1].explain = "En FOB, le risque passe à l'acheteur quand la marchandise est chargée à bord (« placed on board » dans le texte officiel).";
    u.exercises[3].fr = "Le vendeur organise le transport principal.";
    u.exercises[4].pairs[0][1] = "Départ usine";
    u.exercises[7].answer = "Risk passes on board the vessel";
    u.exercises[7].explain = "En FOB, CFR et CIF, le risque passe à l'acheteur une fois la marchandise à bord du navire.";
  }
};
for (const [id, fn] of Object.entries(manual)) {
  const u = load(id);
  fn(u);
  save(id, u);
}
console.log("Corrections appliquées.");
