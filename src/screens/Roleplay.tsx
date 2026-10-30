import { useEffect, useRef, useState } from "react";
import type { Scenario } from "../data/scenarios";
import { Bulb, Check, Cross, Explain, Heart, Keyboard, Mic, Slow, Sparkle, Speaker } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { AI_MESSAGES, AiError, type Turn } from "../lib/ai";
import { LIVES } from "../lib/game";
import { LISTEN_MESSAGES, ListenError, canListen, listen } from "../lib/listen";
import { normWords } from "../lib/score";
import { speak } from "../lib/speech";
import { sfx } from "../lib/sfx";
import { tutorTurn, type TutorReply } from "../lib/tutor";

export interface RoleplayOutcome {
  history: Turn[];
  objectives: string[];
  corrections: NonNullable<TutorReply["correction"]>[];
  confidences: number[];
  seconds: number;
}

type Correction = NonNullable<TutorReply["correction"]>;
interface Line {
  text: string;
  fr: string;
  hint: string;
}

// Écran « Conversation IA » : une réplique à la fois, ce que tu as dit en couleurs,
// puis VÉRIFIER pour l'envoyer à ton interlocuteur.
export function Roleplay({ sc, onExit, onFinish }: { sc: Scenario; onExit: () => void; onFinish: (o: RoleplayOutcome) => void }) {
  const started = useRef(Date.now());
  const [line, setLine] = useState<Line>({ text: sc.opening, fr: sc.openingFr, hint: "" });
  const [history, setHistory] = useState<Turn[]>([{ role: "model", text: sc.opening }]);
  const [done, setDone] = useState<string[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [confidences, setConfidences] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"mic" | "keys">(canListen() ? "mic" : "keys");
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  // Brouillon : ce que tu viens de dire, pas encore envoyé.
  const [draft, setDraft] = useState<{ text: string; confidence?: number } | null>(null);
  // Dernière phrase envoyée et sa correction éventuelle.
  const [said, setSaid] = useState<{ text: string; correction: Correction | null } | null>(null);
  const [panel, setPanel] = useState<"hint" | "explain" | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [quit, setQuit] = useState(false);
  const handle = useRef<ReturnType<typeof listen> | null>(null);
  const learnerCount = history.filter(t => t.role === "user").length;

  useEffect(() => {
    const t = setTimeout(() => void speak(sc.opening, { accent: sc.partner.voice }), 400);
    return () => {
      clearTimeout(t);
      handle.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, [sc]);

  const send = async (text: string, confidence?: number) => {
    const clean = text.trim();
    if (!clean || busy) return;
    setError(null);
    setPanel(null);
    const nextHistory: Turn[] = [...history, { role: "user", text: clean }];
    setHistory(nextHistory);
    setDraft(null);
    setSaid({ text: clean, correction: null });
    if (confidence !== undefined) setConfidences(c => [...c, confidence]);
    setBusy(true);
    try {
      const r = await tutorTurn(sc, nextHistory);
      setHistory(h => [...h, { role: "model", text: r.reply }]);
      setLine({ text: r.reply, fr: r.reply_fr, hint: r.hint });
      setSaid({ text: clean, correction: r.correction });
      const newly = r.objectives_done.filter(o => !done.includes(o));
      if (r.correction) sfx.wrong();
      else if (newly.length) sfx.correct();
      setDone(d => [...new Set([...d, ...r.objectives_done])]);
      if (r.correction) setCorrections(c => [...c, r.correction!]);
      const allDone = new Set([...done, ...r.objectives_done]).size === sc.objectives.length;
      if (r.finished || allDone || nextHistory.filter(t => t.role === "user").length >= (sc.maxTurns ?? 12)) setFinished(true);
      void speak(r.reply, { accent: sc.partner.voice });
    } catch (e) {
      setError(e instanceof AiError ? AI_MESSAGES[e.code] : AI_MESSAGES.network);
    } finally {
      setBusy(false);
    }
  };

  const toggleMic = async () => {
    if (listening) {
      handle.current?.stop();
      return;
    }
    setError(null);
    window.speechSynthesis?.cancel();
    const h = listen({ lang: "en-US", onInterim: setInterim });
    handle.current = h;
    setListening(true);
    try {
      const heard = await h.promise;
      setDraft({ text: heard.text, confidence: heard.confidence });
    } catch (e) {
      const code = e instanceof ListenError ? e.code : "aborted";
      if (code === "unsupported" || code === "denied") setMode("keys");
      if (LISTEN_MESSAGES[code]) setError(LISTEN_MESSAGES[code]);
    } finally {
      setListening(false);
      setInterim("");
    }
  };

  const finish = () =>
    onFinish({ history, objectives: done, corrections, confidences, seconds: Math.round((Date.now() - started.current) / 1000) });

  const lastCorrection = said?.correction ?? null;
  const wrongWords = new Set(lastCorrection ? normWords(lastCorrection.original) : []);
  const shown = listening ? interim : draft?.text ?? said?.text ?? "";
  const state: "pending" | "scored" = listening || draft ? "pending" : "scored";
  const lives = Math.max(0, LIVES - corrections.length);
  const progress = done.length / sc.objectives.length;

  return (
    <div className="lesson">
      <div className="lesson-top">
        <button className="icon-btn" aria-label="Quitter la conversation" onClick={() => setQuit(true)}>
          <Cross />
        </button>
        <div className="progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <i style={{ width: `${Math.max(progress * 100, 4)}%` }} />
        </div>
        <span className="lives" aria-label={`${lives} vies`}><Heart /> {lives}</span>
      </div>

      <div className="objectives" aria-label="Objectifs">
        {sc.objectives.map(o => (
          <span key={o.id} className={`obj${done.includes(o.id) ? " on" : ""}`}>
            {done.includes(o.id) ? <Check /> : <i />} {o.fr}
          </span>
        ))}
      </div>

      <div className="lesson-body voice-body">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="ai-tag"><Sparkle /> CONVERSATION IA</span>
          <button className="linkbtn" onClick={() => setShowLog(true)}>Historique</button>
        </div>
        <p className="muted small">Avec {sc.partner.name}, {sc.partner.role} · {sc.partner.origin}</p>

        <div className="say">
          <Zazou mood={busy ? "think" : lastCorrection ? "sad" : said ? "cheer" : "happy"} size={86} />
          <div className="bubble line-card">
            {busy ? (
              <div className="typing-dots" aria-label="Réponse en cours"><i /><i /><i /></div>
            ) : (
              <>
                <div className="row" style={{ gap: 10, alignItems: "flex-start", flexWrap: "nowrap" }}>
                  <button className="speak-btn" aria-label="Écouter la phrase" onClick={() => void speak(line.text, { accent: sc.partner.voice })}>
                    <Speaker />
                  </button>
                  <p className="en">{line.text}</p>
                </div>
                {line.fr && <p className="fr">{line.fr}</p>}
              </>
            )}
          </div>
        </div>

        <div className="said-card" aria-live="polite">
          <span className="label">TU AS DIT</span>
          {shown ? (
            <p className="said-words">
              {shown.split(/\s+/).filter(Boolean).map((w, i) => {
                const key = normWords(w)[0] ?? "";
                const cls = state === "pending" ? "pending" : wrongWords.has(key) ? "ko" : "ok";
                return <span key={i} className={cls}>{w}</span>;
              })}
            </p>
          ) : (
            <p className="muted">{mode === "mic" ? "Appuie sur le micro et réponds en anglais." : "Écris ta réponse en anglais ci-dessous."}</p>
          )}
          {state === "scored" && said && !busy && (
            <p className={lastCorrection ? "said-verdict ko" : "said-verdict ok"}>
              {lastCorrection ? <>Mieux : <b>{lastCorrection.better}</b></> : "Bien dit !"}
            </p>
          )}
        </div>

        <div className="chips">
          <button className={`chip3d${panel === "hint" ? " on" : ""}`} disabled={!line.hint} onClick={() => setPanel(panel === "hint" ? null : "hint")}>
            <Bulb /> Indice
          </button>
          <button className="chip3d" onClick={() => void speak(line.text, { accent: sc.partner.voice, rate: 0.6 })}>
            <Slow /> Plus lentement
          </button>
          <button className={`chip3d${panel === "explain" ? " on" : ""}`} onClick={() => setPanel(panel === "explain" ? null : "explain")}>
            <Explain /> Explique en français
          </button>
        </div>
        {panel === "hint" && line.hint && (
          <p className="hint">Tu peux dire : <b>{line.hint}</b></p>
        )}
        {panel === "explain" && (
          <div className="hint">
            {lastCorrection ? (
              <>
                <p><span className="del">{lastCorrection.original}</span> → <span className="ins">{lastCorrection.better}</span></p>
                <p>{lastCorrection.why_fr}</p>
              </>
            ) : (
              <p>{said ? "Ta dernière phrase était correcte." : sc.goal}</p>
            )}
            {line.fr && <p className="muted small">{sc.partner.name} a dit : « {line.fr} »</p>}
          </div>
        )}

        {error && <p className="notice">{error}</p>}

        {!finished && (
          <div className="mic-zone">
            {mode === "mic" ? (
              <>
                <button className={`mic-btn${listening ? " live" : ""}`} disabled={busy} aria-label={listening ? "J'ai fini de parler" : "Parler"} onClick={() => void toggleMic()}>
                  <Mic />
                </button>
                <span className="muted small">{listening ? "Appuie quand tu as fini" : draft ? "Appuie pour recommencer" : "Appuie pour parler"}</span>
                <button className="linkbtn" onClick={() => setMode("keys")}><Keyboard width={18} height={18} style={{ verticalAlign: "middle" }} /> Écrire au clavier</button>
              </>
            ) : (
              <>
                <input
                  id="talk-input"
                  type="text"
                  value={draft?.text ?? ""}
                  onChange={e => setDraft(e.target.value ? { text: e.target.value } : null)}
                  onKeyDown={e => { if (e.key === "Enter" && draft) void send(draft.text); }}
                  placeholder="Écris ta réponse en anglais…"
                  autoComplete="off"
                />
                {canListen() && <button className="linkbtn" onClick={() => setMode("mic")}><Mic width={18} height={18} style={{ verticalAlign: "middle" }} /> Parler au micro</button>}
              </>
            )}
          </div>
        )}
      </div>

      <div className="lesson-foot">
        {finished ? (
          <button className="btn3d mint" onClick={finish}>Voir mon bilan</button>
        ) : (
          <div className="voice-foot">
            <button
              className="btn3d ghost"
              disabled={busy}
              onClick={() => (learnerCount >= 2 ? finish() : void send("Sorry, I don't know how to answer. Can you ask me another way?"))}
            >
              {learnerCount >= 2 ? "Terminer" : "Passer"}
            </button>
            <button className="btn3d mint" disabled={!draft || busy || listening} onClick={() => draft && void send(draft.text, draft.confidence)}>
              Vérifier
            </button>
          </div>
        )}
      </div>

      {showLog && (
        <>
          <div className="sheet-backdrop" onClick={() => setShowLog(false)} />
          <div className="sheet guide-sheet" role="dialog" aria-modal="true" aria-label="Historique de la conversation">
            <h3>Historique</h3>
            {history.map((t, i) => (
              <p key={i} className={t.role === "model" ? "log-them" : "log-me"}>
                <b>{t.role === "model" ? sc.partner.name : "Toi"} :</b> {t.text}
              </p>
            ))}
            <button className="btn3d" onClick={() => setShowLog(false)}>Fermer</button>
          </div>
        </>
      )}

      {quit && (
        <>
          <div className="sheet-backdrop" onClick={() => setQuit(false)} />
          <div className="sheet" role="dialog" aria-modal="true" aria-label="Quitter la conversation">
            <div className="row" style={{ justifyContent: "center" }}><Zazou mood="sad" size={96} /></div>
            <h2 style={{ textAlign: "center" }}>Quitter la conversation ?</h2>
            <p className="muted" style={{ textAlign: "center" }}>Tu n'auras pas de bilan ni d'XP pour cette conversation.</p>
            <button className="btn3d" onClick={() => setQuit(false)}>Continuer à parler</button>
            <button className="btn3d ghost" onClick={onExit}>Quitter</button>
          </div>
        </>
      )}
    </div>
  );
}
