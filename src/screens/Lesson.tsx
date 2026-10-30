import { useMemo, useRef, useState } from "react";
import type { Unit } from "../data/types";
import { Check, Cross, Heart } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { ExerciseView, SpeakButton, explanation, isCorrect, solution, title, type Answer } from "../exercises/Exercises";
import { sfx } from "../lib/sfx";
import { LIVES, type LessonResult } from "../lib/game";
import { canListen } from "../lib/listen";
import { setState } from "../lib/store";

// « Signaler » : garde l'exercice dans Profil → Erreurs signalées.
function ReportLink({ unitId, ex }: { unitId: string; ex: Unit["exercises"][number] }) {
  const [sent, setSent] = useState(false);
  const label = "prompt" in ex ? ex.prompt : "sentence" in ex ? ex.sentence : "fr" in ex ? ex.fr : "audio" in ex ? ex.audio : ex.pairs.map(p => p.join(" = ")).join(", ");
  return (
    <button
      className="linkbtn report-link"
      disabled={sent}
      onClick={() => {
        setState(s => ({ ...s, reports: [...s.reports, { at: new Date().toISOString(), unit: unitId, text: `${title(ex)} : ${label}${solution(ex) ? ` → ${solution(ex)}` : ""}` }].slice(-100) }));
        setSent(true);
      }}
    >
      {sent ? "Merci, c'est noté" : "Signaler une erreur dans cet exercice"}
    </button>
  );
}

const isSpoken = (e: Unit["exercises"][number]) => e.type === "speak" || e.type === "speak_translate";

const CHEERS = ["Excellent !", "Bravo !", "Parfait !", "Bien joué !", "Super !"];

export function Lesson({ unit, onExit, onDone, test = false }: { unit: Unit; onExit: () => void; onDone: (r: LessonResult) => void; test?: boolean }) {
  const started = useRef(Date.now());
  const [intro, setIntro] = useState(!test && (unit.exercises[0]?.type !== "discover" || !!unit.grammarIntro));
  const [queue, setQueue] = useState<number[]>(() =>
    unit.exercises.map((_, i) => i).filter(i => !isSpoken(unit.exercises[i]) || canListen())
  );
  const [total, setTotal] = useState(queue.length);
  const [pos, setPos] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [verdict, setVerdict] = useState<null | boolean>(null);
  const [missed, setMissed] = useState<Set<number>>(new Set());
  const [solved, setSolved] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [combo, setCombo] = useState(0);
  const [quit, setQuit] = useState(false);
  const cheer = useMemo(() => CHEERS[Math.floor(Math.random() * CHEERS.length)], [pos]);

  const idx = queue[pos];
  const ex = unit.exercises[idx];

  const check = (a: Answer | null = answer) => {
    if (a === null || verdict !== null) return;
    const ok = isCorrect(ex, a);
    setVerdict(ok);
    setAnswered(n => n + 1);
    if (ok) {
      sfx.correct();
      setSolved(n => n + 1);
      setCombo(c => c + 1);
    } else {
      sfx.wrong();
      setCombo(0);
      setMissed(m => new Set(m).add(idx));
      // En test, pas de seconde chance : l'erreur compte et on avance.
      if (!test) setQueue(q => [...q, idx]);
    }
  };

  // « Je ne peux pas parler maintenant » : on retire les exercices oraux restants.
  const skipSpeaking = () => {
    const rest = queue.slice(pos).filter(i => !isSpoken(unit.exercises[i]));
    const removed = new Set(queue.slice(pos).filter(i => isSpoken(unit.exercises[i])));
    setTotal(t => t - removed.size);
    setMissed(m => new Set([...m].filter(i => !removed.has(i))));
    const nextQueue = [...queue.slice(0, pos), ...rest];
    setQueue(nextQueue);
    setAnswer(null);
    setVerdict(null);
    if (pos >= nextQueue.length) {
      onDone({ unit, firstTry: total - removed.size - [...missed].filter(i => !removed.has(i)).length, total: total - removed.size, seconds: Math.round((Date.now() - started.current) / 1000) });
    }
  };

  const next = () => {
    if (pos + 1 >= queue.length) {
      onDone({ unit, firstTry: total - missed.size, total, seconds: Math.round((Date.now() - started.current) / 1000) });
      return;
    }
    setPos(p => p + 1);
    setAnswer(null);
    setVerdict(null);
  };

  const onAnswer = (a: Answer | null) => {
    setAnswer(a);
    if (ex.type === "pairs" && a !== null) check(a);
  };

  const progress = intro ? 0 : (test ? answered : solved) / total;

  return (
    <div className="lesson">
      <div className="lesson-top">
        <button className="icon-btn" aria-label="Quitter la leçon" onClick={() => setQuit(true)}>
          <Cross />
        </button>
        <div className={`progress${combo >= 3 ? " combo" : ""}`} role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <i style={{ width: `${Math.max(progress * 100, 3)}%` }} />
        </div>
        {test && <span className="combo-label" style={{ color: "var(--muted)" }}>{Math.min(answered + (verdict === null ? 1 : 0), total)}/{total}</span>}
        <span className="lives" aria-label={`${Math.max(0, LIVES - missed.size)} vies`}>
          <Heart /> {Math.max(0, LIVES - missed.size)}
        </span>
      </div>

      {intro ? (
        <>
          <div className="lesson-body">
            <div className="say">
              <Zazou mood="wave" size={96} />
              <div className="bubble">
                <span className={`tag ${unit.context}`}>{unit.context}</span>
                <p style={{ marginTop: 6 }}>{unit.goal}</p>
              </div>
            </div>
            <h2>{unit.title}</h2>
            <div className="card intro-card">
              <h3>À retenir</h3>
              <ul>
                {unit.points.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="card intro-card">
              <h3>Exemples</h3>
              {unit.examples.map(([en, fr]) => (
                <div className="vocab-row" key={en}>
                  <SpeakButton text={en} />
                  <div>
                    <b>{en}</b>
                    <p className="muted">{fr}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card intro-card">
              <h3>Vocabulaire</h3>
              {unit.vocab.map(([en, fr, ipa]) => (
                <div className="vocab-row" key={en}>
                  <SpeakButton text={en} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b>{en}</b> <span className="ipa muted">{ipa}</span>
                    <p className="muted">{fr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lesson-foot">
            <button className="btn3d mint" onClick={() => setIntro(false)}>
              C'est parti
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="lesson-body" key={pos}>
            {missed.has(idx) && pos >= total && <span className="tag" style={{ justifySelf: "start" }}>Erreur précédente</span>}
            <h2>{title(ex)}</h2>
            <ExerciseView ex={ex} checked={verdict !== null} onAnswer={onAnswer} />
          </div>
          {verdict === null ? (
            <div className="lesson-foot">
              {ex.type === "discover" ? (
                <button
                  className="btn3d mint"
                  onClick={() => {
                    sfx.tap();
                    setSolved(n => n + 1);
                    next();
                  }}
                >
                  Continuer
                </button>
              ) : (
                <button className="btn3d mint" disabled={answer === null || ex.type === "pairs"} onClick={() => check()}>
                  Vérifier
                </button>
              )}
              {isSpoken(ex) && (
                <button className="btn3d ghost" style={{ marginTop: 12 }} onClick={skipSpeaking}>
                  Je ne peux pas parler maintenant
                </button>
              )}
            </div>
          ) : (
            <div className={`feedback ${verdict ? "ok" : "ko"}`} role="status">
              <div className="fb-zazou" aria-hidden>
                <Zazou mood={verdict ? "cheer" : "sad"} size={64} />
              </div>
              {verdict && !test && <span className="xp-pop" aria-hidden>+10 XP</span>}
              <h3>
                {verdict ? <Check /> : <Cross />}
                {verdict ? cheer : ex.type === "pairs" ? "Quelques erreurs" : "Bonne réponse :"}
              </h3>
              {!verdict && solution(ex) && <p className="fb-text" style={{ fontWeight: 700 }}>{solution(ex)}</p>}
              {explanation(ex) && <p className="fb-text">{explanation(ex)}</p>}
              {!verdict && !test && <p className="fb-text muted">Cette question reviendra à la fin.</p>}
              <button className={`btn3d ${verdict ? "mint" : "coral"}`} onClick={next} autoFocus>
                Continuer
              </button>
              <ReportLink unitId={unit.id} ex={ex} key={pos} />
            </div>
          )}
        </>
      )}

      {quit && (
        <>
          <div className="sheet-backdrop" onClick={() => setQuit(false)} />
          <div className="sheet" role="dialog" aria-modal="true" aria-label="Quitter la leçon">
            <div className="row" style={{ justifyContent: "center" }}>
              <Zazou mood="sad" size={96} />
            </div>
            <h2 style={{ textAlign: "center" }}>Tu veux vraiment partir ?</h2>
            <p className="muted" style={{ textAlign: "center" }}>
              Ta progression dans cette leçon sera perdue.
            </p>
            <button className="btn3d" onClick={() => setQuit(false)}>
              Continuer la leçon
            </button>
            <button className="btn3d ghost" onClick={onExit}>
              Quitter
            </button>
          </div>
        </>
      )}
    </div>
  );
}
