import { useMemo, useState } from "react";
import { ACCENTS, PAIRS, PHRASES } from "../data/accents";
import type { Voice } from "../data/scenarios";
import { Check, Cross, Speaker } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { SpeechTry } from "../components/SpeechTry";
import { award } from "../lib/award";
import { canListen } from "../lib/listen";
import { normWords } from "../lib/score";
import { hasVoice, speak } from "../lib/speech";
import { sfx } from "../lib/sfx";
import { shuffle } from "../lib/game";
import { useStore } from "../lib/store";

type Mode = "listen" | "pairs" | "dictation";

export function Accents({ toast }: { toast: (m: string) => void }) {
  const [mode, setMode] = useState<Mode>("listen");
  const celebrate = (trophies: string[]) => trophies.forEach(t => toast(`Trophée : ${t}`));
  return (
    <div className="screen">
      <div className="row" style={{ gap: 12 }}>
        <Zazou mood="wave" size={72} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: "1.5rem" }}>Studio des accents</h1>
          <p className="muted small">Entraîne ton oreille aux accents que tu entendras vraiment au travail.</p>
        </div>
      </div>
      <div className="seg wide" role="tablist">
        {([["listen", "Écouter"], ["pairs", "Paires"], ["dictation", "Dictée"]] as const).map(([m, label]) => (
          <button key={m} role="tab" aria-pressed={mode === m} onClick={() => setMode(m)}>{label}</button>
        ))}
      </div>
      {mode === "listen" && <Listen celebrate={celebrate} />}
      {mode === "pairs" && <Pairs celebrate={celebrate} />}
      {mode === "dictation" && <Dictation celebrate={celebrate} />}
    </div>
  );
}

const SPEEDS: [number, string][] = [[0.6, "Lent"], [0.85, "Normal"], [1.05, "Rapide"]];

function Listen({ celebrate }: { celebrate: (t: string[]) => void }) {
  const heard = useStore(s => s.accents.heard);
  const [phrase, setPhrase] = useState(PHRASES[0].en);
  const [custom, setCustom] = useState("");
  const [rate, setRate] = useState(0.85);
  const [playing, setPlaying] = useState<Voice | null>(null);
  const [shadow, setShadow] = useState<Voice | null>(null);
  const fr = PHRASES.find(p => p.en === phrase)?.fr;

  const play = async (v: Voice) => {
    setPlaying(v);
    if (!heard.includes(v)) celebrate(award(s => ({ ...s, accents: { ...s.accents, heard: [...s.accents.heard, v] } }), 2));
    await speak(phrase, { accent: v, rate });
    setPlaying(null);
  };

  return (
    <>
      <div className="card" style={{ display: "grid", gap: 10 }}>
        <label className="field" htmlFor="phrase">Phrase
          <select id="phrase" value={PHRASES.some(p => p.en === phrase) ? phrase : ""} onChange={e => e.target.value && setPhrase(e.target.value)}>
            {PHRASES.map(p => <option key={p.en} value={p.en}>{p.en}</option>)}
            {!PHRASES.some(p => p.en === phrase) && <option value="">Ta phrase</option>}
          </select>
        </label>
        {fr && <p className="muted small">{fr}</p>}
        <form className="compose" onSubmit={e => { e.preventDefault(); if (custom.trim()) setPhrase(custom.trim()); }}>
          <input id="custom-phrase" type="text" placeholder="Ou écris ta propre phrase…" value={custom} onChange={e => setCustom(e.target.value)} />
          <button className="btn3d small-btn" style={{ width: "auto" }}>OK</button>
        </form>
        <div className="seg wide">
          {SPEEDS.map(([r, l]) => <button key={r} aria-pressed={rate === r} onClick={() => setRate(r)}>{l}</button>)}
        </div>
      </div>
      <div className="accent-grid">
        {ACCENTS.map(a => (
          <div className={`accent-card${playing === a.voice ? " playing" : ""}`} key={a.voice}>
            <div className="row" style={{ gap: 10 }}>
              <span className={`avatar small v-${a.voice}`} aria-hidden>{a.name[0]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b>{a.name}</b>
                <p className="muted tiny">{hasVoice(a.voice) ? a.where : "Voix absente du téléphone : lecture approchée"}</p>
              </div>
              {heard.includes(a.voice) && <Check width={18} height={18} style={{ color: "var(--mint)" }} />}
            </div>
            <ul>{a.traits.map(t => <li key={t}>{t}</li>)}</ul>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn3d small-btn" onClick={() => void play(a.voice)} aria-label={`Écouter en accent ${a.name}`}>
                <span className="row" style={{ justifyContent: "center", gap: 6 }}><Speaker width={18} height={18} /> Écouter</span>
              </button>
              {canListen() && (
                <button className="btn3d ghost small-btn" onClick={() => setShadow(shadow === a.voice ? null : a.voice)}>Répéter</button>
              )}
            </div>
            {shadow === a.voice && (
              <SpeechTry
                text={phrase}
                onResult={r => {
                  if (r.score >= 70) celebrate(award(s => s, 5));
                }}
              />
            )}
          </div>
        ))}
      </div>
      <p className="muted small" style={{ textAlign: "center" }}>
        Astuce : écoute, puis appuie sur « Répéter » et imite la mélodie tout de suite. C'est le « shadowing ».
      </p>
    </>
  );
}

function Pairs({ celebrate }: { celebrate: (t: string[]) => void }) {
  const best = useStore(s => s.accents.pairsBest);
  const [key, setKey] = useState(0);
  return <PairsGame key={key} best={best} celebrate={celebrate} onRestart={() => setKey(k => k + 1)} />;
}

function PairsGame({ best, celebrate, onRestart }: { best: number; celebrate: (t: string[]) => void; onRestart: () => void }) {
  // 10 manches tirées au hasard ; le mot dit est a ou b au hasard.
  const rounds = useMemo(() => shuffle(PAIRS).slice(0, 10).map(p => ({ ...p, target: Math.random() < 0.5 ? p.a : p.b })), []);
  const [i, setI] = useState(-1);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const r = rounds[i];
  const voice: Voice = i % 2 ? "en-US" : "en-GB";

  if (i === -1) {
    return (
      <div className="card" style={{ display: "grid", gap: 12, justifyItems: "center", textAlign: "center" }}>
        <h3>Paires minimales</h3>
        <p className="muted">Zazou dit un mot. Choisis lequel tu as entendu. 10 manches, les sons qui piègent les francophones.</p>
        {best > 0 && <p className="tag">Record : {best}/10</p>}
        <button className="btn3d" onClick={() => { setI(0); setTimeout(() => void speak(rounds[0].target, { accent: "en-GB", rate: 0.85 }), 200); }}>Commencer</button>
      </div>
    );
  }
  if (i >= rounds.length) {
    return (
      <div className="card" style={{ display: "grid", gap: 12, justifyItems: "center", textAlign: "center" }}>
        <Zazou mood={score >= 8 ? "cheer" : "happy"} size={110} />
        <h2>{score}/10</h2>
        <p className="muted">{score >= 8 ? "Excellente oreille !" : "Réécoute les paires ratées, ça viendra vite."}</p>
        <button className="btn3d" onClick={onRestart}>Rejouer</button>
      </div>
    );
  }

  const choose = (w: string) => {
    if (picked) return;
    setPicked(w);
    const ok = w === r.target;
    if (ok) { sfx.correct(); setScore(x => x + 1); } else sfx.wrong();
  };
  const next = () => {
    const ni = i + 1;
    setPicked(null);
    setI(ni);
    if (ni < rounds.length) setTimeout(() => void speak(rounds[ni].target, { accent: ni % 2 ? "en-US" : "en-GB", rate: 0.85 }), 200);
    else {
      const final = score;
      celebrate(award(s => ({ ...s, accents: { ...s.accents, pairsBest: Math.max(s.accents.pairsBest, final) } }), final * 2, 90));
      sfx.victory();
    }
  };

  return (
    <div className="card" style={{ display: "grid", gap: 14 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="tag">Manche {i + 1}/10</span>
        <span className="tag">{r.sound}</span>
      </div>
      <div className="row" style={{ justifyContent: "center" }}>
        <button className="speak-btn big" aria-label="Réécouter le mot" onClick={() => void speak(r.target, { accent: voice, rate: 0.85 })}><Speaker /></button>
      </div>
      <div className="pair-choices">
        {[r.a, r.b].map(w => (
          <button key={w} className={`choice${picked ? (w === r.target ? " right" : w === picked ? " wrong" : "") : ""}`} onClick={() => choose(w)}>
            <span className="pair-word">{w}</span>
            {picked && <span className="speak-mini" role="presentation" onClick={e => { e.stopPropagation(); void speak(w, { accent: voice, rate: 0.8 }); }}><Speaker width={16} height={16} /></span>}
          </button>
        ))}
      </div>
      {picked && (
        <div className={`feedback inline ${picked === r.target ? "ok" : "ko"}`}>
          <h3>{picked === r.target ? <Check /> : <Cross />}{picked === r.target ? "Bien entendu !" : `C'était « ${r.target} »`}</h3>
          <p className="fb-text">{r.tip}</p>
          <button className={`btn3d ${picked === r.target ? "mint" : "coral"}`} onClick={next}>Continuer</button>
        </div>
      )}
    </div>
  );
}

function Dictation({ celebrate }: { celebrate: (t: string[]) => void }) {
  const count = useStore(s => s.accents.dictations);
  const [item, setItem] = useState<{ en: string; voice: Voice } | null>(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ pct: number; parts: { w: string; k: "ok" | "miss" | "extra" }[] } | null>(null);

  const fresh = () => {
    const p = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    const v = ACCENTS[Math.floor(Math.random() * ACCENTS.length)].voice;
    setItem({ en: p.en, voice: v });
    setText("");
    setResult(null);
    setTimeout(() => void speak(p.en, { accent: v, rate: 0.85 }), 150);
  };

  const check = () => {
    if (!item) return;
    const A = normWords(item.en), B = normWords(text);
    const L = Array.from({ length: A.length + 1 }, () => Array(B.length + 1).fill(0));
    for (let i = A.length - 1; i >= 0; i--) for (let j = B.length - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const parts: { w: string; k: "ok" | "miss" | "extra" }[] = [];
    let i = 0, j = 0, ok = 0;
    while (i < A.length || j < B.length) {
      if (i < A.length && j < B.length && A[i] === B[j]) { parts.push({ w: A[i], k: "ok" }); i++; j++; ok++; }
      else if (j < B.length && (i >= A.length || L[i][j + 1] >= L[i + 1][j])) { parts.push({ w: B[j], k: "extra" }); j++; }
      else { parts.push({ w: A[i], k: "miss" }); i++; }
    }
    const pct = Math.round((ok / Math.max(A.length, 1)) * 100);
    setResult({ pct, parts });
    if (pct >= 80) sfx.correct(); else sfx.wrong();
    celebrate(award(s => ({ ...s, accents: { ...s.accents, dictations: s.accents.dictations + 1 } }), pct >= 80 ? 10 : 3, 45));
  };

  const accentName = item ? ACCENTS.find(a => a.voice === item.voice)?.name : "";

  return (
    <div className="card" style={{ display: "grid", gap: 12 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3>Dictée</h3>
        <span className="tag">{count} faites</span>
      </div>
      {!item ? (
        <>
          <p className="muted">Une phrase de travail, lue dans un accent au hasard. Écris ce que tu entends.</p>
          <button className="btn3d" onClick={fresh}>Commencer</button>
        </>
      ) : (
        <>
          <div className="row" style={{ gap: 10 }}>
            <button className="speak-btn" aria-label="Réécouter" onClick={() => void speak(item.en, { accent: item.voice, rate: 0.85 })}><Speaker /></button>
            <button className="speak-btn" aria-label="Réécouter lentement" onClick={() => void speak(item.en, { accent: item.voice, rate: 0.6 })}>
              <span style={{ fontSize: 11, fontWeight: 800 }}>LENT</span>
            </button>
            <span className="muted small">Accent : {result ? accentName : "à deviner"}</span>
          </div>
          <input id="dictation" type="text" autoComplete="off" autoCapitalize="off" placeholder="Écris la phrase…" value={text} disabled={!!result} onChange={e => setText(e.target.value)} />
          {result ? (
            <>
              <p className="dictation-diff">
                {result.parts.map((p, k) => <span key={k} className={p.k}>{p.w}</span>)}
              </p>
              <p><b>{result.pct}% de mots justes.</b> <span className="muted">Phrase : {item.en}</span></p>
              <p className="muted tiny">Vert : juste · Rouge barré : oublié · Jaune : en trop ou mal écrit</p>
              <button className="btn3d" onClick={fresh}>Phrase suivante</button>
            </>
          ) : (
            <button className="btn3d mint" disabled={!text.trim()} onClick={check}>Vérifier</button>
          )}
        </>
      )}
    </div>
  );
}
