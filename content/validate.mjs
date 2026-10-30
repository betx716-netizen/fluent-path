// Vérifications automatiques d'une unité (structure et cohérence des réponses).
const norm = s => String(s).toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
const ORDER = ["mcq", "fill", "listen", "build", "pairs", "fill", "mcq", "build", "listen", "speak"];

export function validateUnit(u) {
  const p = [];
  const isStr = x => typeof x === "string" && x.trim().length > 0;
  if (!Array.isArray(u.points) || u.points.length !== 4 || !u.points.every(isStr)) p.push("points must be 4 French strings");
  if (!Array.isArray(u.examples) || u.examples.length !== 4 || !u.examples.every(e => Array.isArray(e) && e.length === 2 && e.every(isStr)))
    p.push("examples must be 4 [English, French] pairs");
  if (!Array.isArray(u.vocab) || u.vocab.length !== 6 || !u.vocab.every(v => Array.isArray(v) && v.length === 3 && v.every(isStr) && /^\/.*\/$/.test(v[2].trim())))
    p.push("vocab must be 6 [English, French, /IPA/] triples");
  if (!Array.isArray(u.exercises) || u.exercises.length !== 10) {
    p.push("exercises must contain exactly 10 items");
    return p;
  }
  u.exercises.forEach((ex, i) => {
    const at = `exercise ${i + 1} (${ex?.type})`;
    if (ex?.type !== ORDER[i]) p.push(`${at}: type must be "${ORDER[i]}"`);
    const choice = ["mcq", "fill", "listen"].includes(ex?.type);
    if (choice) {
      if (!Array.isArray(ex.options) || ex.options.length !== 4 || !ex.options.every(isStr)) p.push(`${at}: needs 4 options`);
      else if (new Set(ex.options.map(norm)).size !== 4) p.push(`${at}: duplicated options`);
      if (!Number.isInteger(ex.answer) || ex.answer < 0 || ex.answer > 3) p.push(`${at}: answer must be an index 0-3`);
      if (!isStr(ex.explain)) p.push(`${at}: missing explain`);
    }
    if (ex?.type === "mcq" && !isStr(ex.prompt)) p.push(`${at}: missing prompt`);
    if (ex?.type === "fill" && (typeof ex.sentence !== "string" || ex.sentence.split("___").length !== 2)) p.push(`${at}: sentence needs exactly one ___`);
    if (ex?.type === "listen" && Array.isArray(ex.options) && norm(ex.options[ex.answer] ?? "") !== norm(ex.audio ?? ""))
      p.push(`${at}: options[answer] must be identical to audio`);
    if (ex?.type === "build") {
      if (!isStr(ex.fr) || !isStr(ex.answer)) p.push(`${at}: needs fr and answer`);
      else {
        const words = ex.answer.trim().split(/\s+/);
        if (/[.,!?;:]/.test(ex.answer)) p.push(`${at}: answer must have no punctuation`);
        if (/'/.test(ex.answer.replace(/[’]/g, "'")) && /\b\w+'(s|re|ll|ve|d|m|t)\b/i.test(ex.answer)) p.push(`${at}: answer must not use contractions`);
        if (words.length < 3 || words.length > 10) p.push(`${at}: answer must have 3 to 10 words`);
        const lower = new Set(words.map(w => w.toLowerCase()));
        if (!Array.isArray(ex.extra) || ex.extra.length < 2) p.push(`${at}: needs 3 extra words`);
        else if (ex.extra.some(w => lower.has(String(w).toLowerCase()))) p.push(`${at}: an extra word is also in the answer`);
      }
    }
    if (ex?.type === "pairs") {
      if (!Array.isArray(ex.pairs) || ex.pairs.length !== 4 || !ex.pairs.every(x => Array.isArray(x) && x.length === 2 && x.every(isStr))) p.push(`${at}: needs 4 [English, French] pairs`);
      else if (new Set(ex.pairs.map(x => norm(x[0]))).size !== 4 || new Set(ex.pairs.map(x => norm(x[1]))).size !== 4) p.push(`${at}: duplicated pair`);
    }
    if (ex?.type === "speak" && (!isStr(ex.text) || !isStr(ex.fr) || ex.text.split(/\s+/).length > 14)) p.push(`${at}: speak needs text (max 14 words) and fr`);
  });
  return p;
}
