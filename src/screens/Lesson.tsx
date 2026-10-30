import { useMemo, useRef, useState } from "react";
import type { Unit } from "../data/types";
import { Check, Cross } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { ExerciseView, SpeakButton, explanation, isCorrect, solution, title, type Answer } from "../exercises/Exercises";
import { sfx } from "../lib/sfx";
import type { LessonResult } from "../lib/game";

const CHEERS = ["Excellent !", "Bravo !", "Parfait !", "Bien joué !", "Super !"];

export function Lesson({ unit, onExit, onDone }: { unit: Unit; onExit: () => void; onDone: (r: LessonResult) => void }) {
  const total = unit.exercises.length;
  const started = useRef(Date.now());
  const [intro, setIntro] = useState(true);
  const [queue, setQueue] = useState<number[]>(() => unit.exercises.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [verdict, setVerdict] = useState<null | boolean>(null);
  const [missed, setMissed] = useState<Set<number>>(new Set());
  const [solved, setSolved] = useState(0);
  const [combo, setCombo] = useState(0);
  const [quit, setQuit] = useState(false);
  const cheer = useMemo(() => CHEERS[Math.floor(Math.random() * CHEERS.length)], [pos]);

  const idx = queue[pos];
  const ex = unit.exercises[idx];

  const check = (a: Answer | null = answer) => {
    if (a === null || verdict !== null) return;
    const ok = isCorrect(ex, a);
    setVerdict(ok);
    if (ok) {
      sfx.correct();
      setSolved(n => n + 1);
      setCombo(c => c + 1);
    } else {
      sfx.wrong();
      setCombo(0);
      setMissed(m => new Set(m).add(idx));
      setQueue(q => [...q, idx]);
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

  const progress = intro ? 0 : solved / total;

  return (
    <div className="lesson">
      <div className="lesson-top">
        <button className="icon-btn" aria-label="Quitter la leçon" onClick={() => setQuit(true)}>
          <Cross />
        </button>
        <div className={`progress${combo >= 3 ? " combo" : ""}`} role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <i style={{ width: `${Math.max(progress * 100, 3)}%` }} />
        </div>
        {combo >= 3 && <span className="combo-label">{combo} d'affilée</span>}
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
              <button className="btn3d mint" disabled={answer === null || ex.type === "pairs"} onClick={() => check()}>
                Vérifier
              </button>
            </div>
          ) : (
            <div className={`feedback ${verdict ? "ok" : "ko"}`} role="status">
              <h3>
                {verdict ? <Check /> : <Cross />}
                {verdict ? cheer : ex.type === "pairs" ? "Quelques erreurs" : "Bonne réponse :"}
              </h3>
              {!verdict && solution(ex) && <p className="fb-text" style={{ fontWeight: 700 }}>{solution(ex)}</p>}
              {explanation(ex) && <p className="fb-text">{explanation(ex)}</p>}
              {!verdict && <p className="fb-text muted">Cette question reviendra à la fin.</p>}
              <button className={`btn3d ${verdict ? "mint" : "coral"}`} onClick={next} autoFocus>
                Continuer
              </button>
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
