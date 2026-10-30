import { useEffect, useRef, useState } from "react";
import type { Scenario } from "../data/scenarios";
import { Check, Cross, Keyboard, Mic, Send } from "../components/Icons";
import { AI_MESSAGES, AiError, type Turn } from "../lib/ai";
import { LISTEN_MESSAGES, ListenError, canListen, listen } from "../lib/listen";
import { speak } from "../lib/speech";
import { sfx } from "../lib/sfx";
import { tutorTurn, type TutorReply } from "../lib/tutor";

interface Msg {
  role: "user" | "model";
  text: string;
  fr?: string;
  hint?: string;
}

export interface RoleplayOutcome {
  history: Turn[];
  objectives: string[];
  corrections: NonNullable<TutorReply["correction"]>[];
  confidences: number[];
  seconds: number;
}

export function Roleplay({ sc, onExit, onFinish }: { sc: Scenario; onExit: () => void; onFinish: (o: RoleplayOutcome) => void }) {
  const started = useRef(Date.now());
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "model", text: sc.opening, fr: sc.openingFr }]);
  const [history, setHistory] = useState<Turn[]>([{ role: "model", text: sc.opening }]);
  const [done, setDone] = useState<string[]>([]);
  const [corrections, setCorrections] = useState<RoleplayOutcome["corrections"]>([]);
  const [confidences, setConfidences] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"mic" | "keys">(canListen() ? "mic" : "keys");
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [text, setText] = useState("");
  const [showFr, setShowFr] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState<Set<number>>(new Set());
  const [quit, setQuit] = useState(false);
  const handle = useRef<ReturnType<typeof listen> | null>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const learnerCount = history.filter(t => t.role === "user").length;

  useEffect(() => {
    const t = setTimeout(() => void speak(sc.opening, { accent: sc.partner.voice }), 400);
    return () => {
      clearTimeout(t);
      handle.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, [sc]);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, busy, interim]);

  const send = async (said: string, confidence?: number) => {
    const clean = said.trim();
    if (!clean || busy) return;
    setError(null);
    const nextHistory: Turn[] = [...history, { role: "user", text: clean }];
    setHistory(nextHistory);
    setMsgs(m => [...m, { role: "user", text: clean }]);
    if (confidence !== undefined) setConfidences(c => [...c, confidence]);
    setBusy(true);
    try {
      const r = await tutorTurn(sc, nextHistory);
      setHistory(h => [...h, { role: "model", text: r.reply }]);
      setMsgs(m => [...m, { role: "model", text: r.reply, fr: r.reply_fr, hint: r.hint }]);
      const newly = r.objectives_done.filter(o => !done.includes(o));
      if (newly.length) sfx.correct();
      setDone(d => [...new Set([...d, ...r.objectives_done])]);
      if (r.correction) setCorrections(c => [...c, r.correction!]);
      const allDone = new Set([...done, ...r.objectives_done]).size === sc.objectives.length;
      if (r.finished || allDone || nextHistory.filter(t => t.role === "user").length >= 12) setFinished(true);
      void speak(r.reply, { accent: sc.partner.voice });
    } catch (e) {
      setError(e instanceof AiError ? AI_MESSAGES[e.code] : AI_MESSAGES.network);
      // Le message reste dans l'historique : un nouvel envoi reprendra la conversation.
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
      setInterim("");
      setListening(false);
      void send(heard.text, heard.confidence);
    } catch (e) {
      setListening(false);
      setInterim("");
      const code = e instanceof ListenError ? e.code : "aborted";
      if (code === "unsupported" || code === "denied") setMode("keys");
      if (LISTEN_MESSAGES[code]) setError(LISTEN_MESSAGES[code]);
    }
  };

  const finish = () =>
    onFinish({ history, objectives: done, corrections, confidences, seconds: Math.round((Date.now() - started.current) / 1000) });

  const toggle = (set: Set<number>, i: number) => {
    const n = new Set(set);
    if (n.has(i)) n.delete(i);
    else n.add(i);
    return n;
  };

  return (
    <div className="lesson">
      <div className="lesson-top">
        <button className="icon-btn" aria-label="Quitter la conversation" onClick={() => setQuit(true)}>
          <Cross />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <b>{sc.partner.name}</b> <span className="muted">· {sc.partner.role}, {sc.partner.origin}</span>
        </div>
        {learnerCount >= 2 && !finished && (
          <button className="linkbtn" onClick={finish}>
            Terminer
          </button>
        )}
      </div>

      <div className="objectives" aria-label="Objectifs">
        {sc.objectives.map(o => (
          <span key={o.id} className={`obj${done.includes(o.id) ? " on" : ""}`}>
            {done.includes(o.id) ? <Check /> : <i />} {o.fr}
          </span>
        ))}
      </div>

      <div className="chat">
        <p className="notice info">{sc.goal}</p>
        {msgs.map((m, i) =>
          m.role === "model" ? (
            <div className="msg them" key={i}>
              <span className={`avatar small v-${sc.partner.voice}`} aria-hidden>{sc.partner.name[0]}</span>
              <div className="msg-col">
                <div className="bubble">{m.text}</div>
                <div className="msg-tools">
                  <button className="speak-mini" aria-label="Réécouter" onClick={() => void speak(m.text, { accent: sc.partner.voice })}>
                    <SpeakIcon />
                  </button>
                  {m.fr && <button className="linkbtn" onClick={() => setShowFr(s => toggle(s, i))}>Traduire</button>}
                  {m.hint && <button className="linkbtn" onClick={() => setShowHint(s => toggle(s, i))}>Aide</button>}
                </div>
                {showFr.has(i) && <p className="muted small">{m.fr}</p>}
                {showHint.has(i) && m.hint && (
                  <p className="hint">
                    Tu peux dire : <b>{m.hint}</b> <SpeakButtonInline text={m.hint} />
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="msg me" key={i}>
              <div className="bubble">{m.text}</div>
            </div>
          )
        )}
        {listening && (
          <div className="msg me">
            <div className="bubble live">{interim || "…"}</div>
          </div>
        )}
        {busy && (
          <div className="msg them">
            <span className={`avatar small v-${sc.partner.voice}`} aria-hidden>{sc.partner.name[0]}</span>
            <div className="bubble typing"><i /><i /><i /></div>
          </div>
        )}
        {error && <p className="notice">{error}</p>}
        <div ref={chatEnd} />
      </div>

      <div className="lesson-foot talk-foot">
        {finished ? (
          <button className="btn3d sun" onClick={finish}>Voir mon bilan</button>
        ) : mode === "mic" ? (
          <div className="mic-row">
            <button className="icon-btn" aria-label="Écrire au clavier" onClick={() => setMode("keys")}>
              <Keyboard />
            </button>
            <button className={`mic-btn${listening ? " live" : ""}`} disabled={busy} aria-label={listening ? "J'ai fini de parler" : "Parler"} onClick={() => void toggleMic()}>
              <Mic />
            </button>
            <span className="muted small" style={{ width: 70 }}>{listening ? "Appuie quand tu as fini" : "Appuie pour parler"}</span>
          </div>
        ) : (
          <form
            className="compose"
            onSubmit={e => {
              e.preventDefault();
              void send(text);
              setText("");
            }}
          >
            {canListen() && (
              <button type="button" className="icon-btn" aria-label="Parler au micro" onClick={() => setMode("mic")}>
                <Mic />
              </button>
            )}
            <input id="talk-input" type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Écris ta réponse en anglais…" autoComplete="off" />
            <button className="send-btn" disabled={busy || !text.trim()} aria-label="Envoyer">
              <Send />
            </button>
          </form>
        )}
      </div>

      {quit && (
        <>
          <div className="sheet-backdrop" onClick={() => setQuit(false)} />
          <div className="sheet" role="dialog" aria-modal="true" aria-label="Quitter la conversation">
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

function SpeakIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden width="18" height="18">
      <path fill="currentColor" d="M3 9h4l5-4v14l-5-4H3z" />
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M15.5 8.5a5 5 0 0 1 0 7" />
    </svg>
  );
}

function SpeakButtonInline({ text }: { text: string }) {
  return (
    <button className="speak-mini" aria-label={`Écouter : ${text}`} onClick={() => void speak(text, { rate: 0.85 })}>
      <SpeakIcon />
    </button>
  );
}

