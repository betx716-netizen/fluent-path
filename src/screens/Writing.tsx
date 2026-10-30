import { useState } from "react";
import type { Context } from "../data/types";
import { Speaker } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { AI_MESSAGES, AiError, askJson } from "../lib/ai";
import { award } from "../lib/award";
import { addCards } from "../lib/review";
import { speak } from "../lib/speech";
import { sfx } from "../lib/sfx";
import { useStore } from "../lib/store";

const PROMPTS: { context: Context; fr: string; en: string; start: string }[] = [
  { context: "Pro", fr: "Présente-toi et présente ton entreprise à un futur partenaire.", en: "Introduce yourself and your company to a future partner.", start: "Dear Mr Smith, my name is…" },
  { context: "Pro", fr: "Propose un rendez-vous la semaine prochaine (jour et heure).", en: "Propose a meeting next week with a day and a time.", start: "Hello Sarah, are you free on…" },
  { context: "Commerce", fr: "Réponds à un client qui demande le prix de 100 sacs de riz.", en: "Reply to a customer asking the price of 100 bags of rice.", start: "Dear customer, thank you for your message…" },
  { context: "Commerce", fr: "Fais une offre à un nouveau client (produit, prix, remise).", en: "Make an offer to a new customer: product, price, discount.", start: "Dear Mrs Mensah, we are happy to offer…" },
  { context: "Commerce", fr: "Relance poliment un client qui n'a pas payé sa facture.", en: "Politely remind a customer who has not paid an invoice.", start: "Dear Mr Okafor, I am writing about invoice…" },
  { context: "Transit", fr: "Annonce à un client que son conteneur est arrivé au port.", en: "Tell a customer that their container has arrived at the port.", start: "Hello Linda, good news: your container…" },
  { context: "Transit", fr: "Annonce un retard en douane, excuse-toi et propose une nouvelle date.", en: "Announce a customs delay, apologise and give a new date.", start: "Dear Oliver, I am sorry to inform you…" },
  { context: "Transit", fr: "Demande à un client les documents manquants (facture, connaissement).", en: "Ask a customer for missing documents: invoice, bill of lading.", start: "Dear Mike, to clear your shipment, we need…" }
];

interface Correction {
  score: number;
  level: string;
  summary_fr: string;
  errors: { original: string; fix: string; type: string; rule_fr: string }[];
  corrected: string;
  improved: string;
  tips_fr: string[];
  words: { en: string; fr: string }[];
}

function system(prompt: (typeof PROMPTS)[number]) {
  return `You are a kind but precise business English writing coach for a French-speaking learner from West Africa (beginner to intermediate).
Task given to the learner: "${prompt.en}"
Correct the learner's text. Answer with ONLY this JSON object:
{"score": integer 0-100 (content, grammar, vocabulary, politeness for a business message),
 "level": "CEFR level the text shows, e.g. A2",
 "summary_fr": "2 short sentences in French: what is good, then the main thing to improve",
 "errors": [{"original": "exact wrong fragment copied from the learner's text", "fix": "corrected fragment", "type": "grammaire|vocabulaire|orthographe|politesse|ponctuation", "rule_fr": "the rule in one short French sentence"}] (max 8, most important first),
 "corrected": "the full text with only the mistakes fixed",
 "improved": "a natural, professional version a native speaker would send, same length or a bit longer",
 "tips_fr": ["2 short concrete tips in French"],
 "words": [{"en": "useful business word or phrase from the improved version", "fr": "French"}] (3 items)}`;
}

export function Writing({ toast }: { toast: (m: string) => void }) {
  const stats = useStore(s => s.writings);
  const [pi, setPi] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Correction | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const prompt = PROMPTS[pi];
  const words = (text.match(/[A-Za-z’']+/g) ?? []).length;

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await askJson<Partial<Correction>>(system(prompt), [{ role: "user", text: text.slice(0, 4000) }]);
      const c: Correction = {
        score: Math.max(0, Math.min(100, Math.round(Number(r.score) || 0))),
        level: String(r.level ?? ""),
        summary_fr: String(r.summary_fr ?? ""),
        errors: Array.isArray(r.errors) ? r.errors.filter(e => e?.original && e?.fix).slice(0, 8) : [],
        corrected: String(r.corrected ?? ""),
        improved: String(r.improved ?? ""),
        tips_fr: Array.isArray(r.tips_fr) ? r.tips_fr.map(String).slice(0, 3) : [],
        words: Array.isArray(r.words) ? r.words.filter(w => w?.en && w?.fr).slice(0, 3) : []
      };
      setResult(c);
      setOpen(null);
      sfx.victory();
      const trophies = award(
        s => addCards({ ...s, writings: { count: s.writings.count + 1, best: Math.max(s.writings.best, c.score) } }, c.words),
        20,
        300
      );
      trophies.forEach(t => toast(`Trophée : ${t}`));
    } catch (e) {
      setError(e instanceof AiError ? AI_MESSAGES[e.code] : AI_MESSAGES.network);
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <div style={{ display: "grid", gap: 14 }}>
        <div className="card row" style={{ gap: 14 }}>
          <Zazou mood={result.score >= 70 ? "cheer" : "happy"} size={84} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row" style={{ gap: 16 }}>
              <div><span className="eyebrow-s">Note</span><b className="big-num">{result.score}</b></div>
              {result.level && <div><span className="eyebrow-s">Niveau</span><b className="big-num">{result.level}</b></div>}
            </div>
            <p className="muted small">{result.summary_fr}</p>
          </div>
        </div>

        <div className="card" style={{ display: "grid", gap: 10 }}>
          <h3>Ton texte</h3>
          <p className="muted tiny">Touche un passage souligné pour voir la correction.</p>
          <p className="prose">
            <Highlighted text={text} errors={result.errors} open={open} onOpen={setOpen} />
          </p>
          {open !== null && result.errors[open] && (
            <div className="err-card">
              <span className="tag" style={{ justifySelf: "start" }}>{result.errors[open].type}</span>
              <p><span className="del">{result.errors[open].original}</span> → <span className="ins">{result.errors[open].fix}</span></p>
              <p className="muted small">{result.errors[open].rule_fr}</p>
            </div>
          )}
          {!result.errors.length && <p className="ins">Aucune erreur trouvée. Bravo !</p>}
        </div>

        <div className="card" style={{ display: "grid", gap: 8 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h3>Version professionnelle</h3>
            <button className="speak-mini" aria-label="Écouter la version professionnelle" onClick={() => void speak(result.improved, { accent: "en-GB" })}><Speaker width={18} height={18} /></button>
          </div>
          <p className="prose">{result.improved}</p>
        </div>

        {result.tips_fr.length > 0 && (
          <div className="card" style={{ display: "grid", gap: 6 }}>
            <h3>Conseils</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>{result.tips_fr.map(t => <li key={t}>{t}</li>)}</ul>
          </div>
        )}
        {result.words.length > 0 && (
          <p className="notice info">Ajouté à tes révisions : {result.words.map(w => w.en).join(", ")}.</p>
        )}
        <button className="btn3d" onClick={() => { setResult(null); setText(""); }}>Écrire un autre texte</button>
        <button className="btn3d ghost" onClick={() => setResult(null)}>Corriger et renvoyer ce texte</button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card" style={{ display: "grid", gap: 10 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h3>Atelier d'écriture</h3>
          <span className="tag">{stats.count} textes · record {stats.best}</span>
        </div>
        <label className="field" htmlFor="write-prompt">Sujet
          <select id="write-prompt" value={pi} onChange={e => setPi(Number(e.target.value))}>
            {PROMPTS.map((p, i) => <option key={i} value={i}>{p.context} · {p.fr}</option>)}
          </select>
        </label>
        <p className="hint">Pour commencer : <b>{prompt.start}</b></p>
        <textarea id="write-text" rows={8} placeholder="Écris ton message en anglais…" value={text} onChange={e => setText(e.target.value)} />
        <p className="muted tiny">{words} mot{words > 1 ? "s" : ""} · vise 40 à 120 mots</p>
        {error && <p className="notice">{error}</p>}
        <button className="btn3d" disabled={busy || words < 8} onClick={() => void submit()}>
          {busy ? "Zazou corrige…" : "Corriger mon texte"}
        </button>
      </div>
    </div>
  );
}

// Souligne dans le texte les fragments que l'IA a corrigés.
function Highlighted({ text, errors, open, onOpen }: { text: string; errors: Correction["errors"]; open: number | null; onOpen: (i: number) => void }) {
  const marks: { start: number; end: number; i: number }[] = [];
  const lower = text.toLowerCase();
  errors.forEach((e, i) => {
    const at = lower.indexOf(e.original.toLowerCase());
    if (at >= 0 && !marks.some(m => at < m.end && at + e.original.length > m.start)) marks.push({ start: at, end: at + e.original.length, i });
  });
  marks.sort((a, b) => a.start - b.start);
  const out: (string | JSX.Element)[] = [];
  let pos = 0;
  for (const m of marks) {
    out.push(text.slice(pos, m.start));
    out.push(
      <button key={m.i} className={`mark${open === m.i ? " open" : ""}`} onClick={() => onOpen(m.i)}>
        {text.slice(m.start, m.end)}
      </button>
    );
    pos = m.end;
  }
  out.push(text.slice(pos));
  const unplaced = errors.map((_, i) => i).filter(i => !marks.some(m => m.i === i));
  return (
    <>
      {out}
      {unplaced.map(i => (
        <button key={`u${i}`} className={`mark${open === i ? " open" : ""}`} onClick={() => onOpen(i)} style={{ marginLeft: 6 }}>
          {errors[i].original}
        </button>
      ))}
    </>
  );
}
