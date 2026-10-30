import { useEffect, useRef, useState } from "react";
import { Cross, Mic, Speaker, Stop } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { canListen, listen } from "../lib/listen";
import { ANSWER_SECONDS, LEVELS, QUESTIONS, TEST_SECONDS, estimate, scoreAnswer, startInfo } from "../lib/placement";
import { speak } from "../lib/speech";
import { sfx } from "../lib/sfx";
import type { Level } from "../lib/store";

const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.max(0, sec) % 60).padStart(2, "0")}`;

export function LevelBar({ level, label = "Niveau estimé" }: { level: Level; label?: string }) {
  const k = LEVELS.indexOf(level);
  return (
    <div className="level-bar" aria-label={`${label} : ${level}`}>
      <small>{label}</small>
      <div className="level-steps">
        {LEVELS.map((l, i) => (
          <span key={l} className={i < k ? "past" : i === k ? "now" : ""}>{l}</span>
        ))}
      </div>
    </div>
  );
}

export function PlacementTest({ onDone, onExit }: { onDone: (level: Level) => void; onExit: () => void }) {
  const mic = canListen();
  const [qi, setQi] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [left, setLeft] = useState(TEST_SECONDS);
  const [answerLeft, setAnswerLeft] = useState(ANSWER_SECONDS);
  const [rec, setRec] = useState(false);
  const [heard, setHeard] = useState("");
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<Level | null>(null);
  const handle = useRef<ReturnType<typeof listen> | null>(null);
  const advanceAfterStop = useRef(false);
  const q = QUESTIONS[qi];

  // Minuteur global de 3 minutes.
  useEffect(() => {
    if (result) return;
    const t = window.setInterval(() => setLeft(x => x - 1), 1000);
    return () => window.clearInterval(t);
  }, [result]);
  useEffect(() => {
    if (left <= 0 && !result) {
      handle.current?.abort();
      finish(scores);
    }
  }, [left]);

  // Minuteur de 30 s par réponse.
  useEffect(() => {
    if (!rec) return;
    setAnswerLeft(ANSWER_SECONDS);
    const t = window.setInterval(() => setAnswerLeft(x => x - 1), 1000);
    return () => window.clearInterval(t);
  }, [rec]);
  useEffect(() => {
    if (rec && answerLeft <= 0) handle.current?.stop();
  }, [answerLeft, rec]);

  // Zazou lit chaque question.
  useEffect(() => {
    if (!result) void speak(q.en, { rate: 0.88 });
  }, [qi]);
  useEffect(() => () => handle.current?.abort(), []);

  function finish(list: number[]) {
    const all = [...list, ...Array(QUESTIONS.length - list.length).fill(0)];
    window.speechSynthesis?.cancel();
    sfx.victory();
    setResult(estimate(all));
  }

  function commit(answer: string) {
    const list = [...scores, scoreAnswer(q, answer)];
    setScores(list);
    setHeard("");
    setTyped("");
    if (qi + 1 >= QUESTIONS.length) finish(list);
    else setQi(qi + 1);
  }

  const start = async () => {
    window.speechSynthesis?.cancel();
    setHeard("");
    const h = listen({ lang: "en-US", onInterim: setHeard });
    handle.current = h;
    setRec(true);
    let text = "";
    try {
      text = (await h.promise).text;
    } catch {
      /* rien entendu : réponse vide */
    }
    handle.current = null;
    setRec(false);
    setHeard(text);
    if (advanceAfterStop.current) {
      advanceAfterStop.current = false;
      commit(text);
    }
  };

  const next = () => {
    if (rec) {
      advanceAfterStop.current = true;
      handle.current?.stop();
      return;
    }
    commit(mic ? heard : typed);
  };
  const skip = () => {
    advanceAfterStop.current = false;
    handle.current?.abort();
    commit("");
  };

  const live = estimate(scores);

  if (result) {
    const info = startInfo(result);
    return (
      <div className="onboard placement-result">
        <div className="hero">
          <Zazou mood="cheer" size={150} />
          <div className="bubble">Bravo ! Ton niveau est <b>{result}</b>.</div>
        </div>
        <div className="card" style={{ display: "grid", gap: 12 }}>
          <LevelBar level={result} label="Ton niveau" />
          <p>
            Tu commences au <b>Chapitre {info.chapter.number} · {info.chapter.title}</b>, unité {info.unitTitle}.
          </p>
          {!info.ready && (
            <p className="muted small">Ce chapitre arrive bientôt. En attendant, tout le chapitre 1 et l'Anglais pro de ton niveau sont ouverts.</p>
          )}
        </div>
        <button className="btn3d" onClick={() => onDone(result)}>C'est parti</button>
      </div>
    );
  }

  return (
    <div className="placement">
      <div className="lesson-top">
        <button className="icon-btn" aria-label="Quitter le test" onClick={() => { handle.current?.abort(); window.speechSynthesis?.cancel(); onExit(); }}>
          <Cross />
        </button>
        <div className="q-steps" aria-label={`Question ${qi + 1} sur ${QUESTIONS.length}`}>
          {QUESTIONS.map((_, i) => <i key={i} className={i < qi ? "done" : i === qi ? "now" : ""} />)}
        </div>
        <span className={`test-clock${left <= 30 ? " low" : ""}`} aria-label="Temps restant">{clock(left)}</span>
      </div>

      <div className="placement-body">
        <small className="eyebrow-s">Question {qi + 1} sur {QUESTIONS.length}</small>
        <div className="ask">
          <Zazou mood={rec ? "think" : "happy"} size={72} />
          <div className="bubble ask-bubble">
            <div className="row" style={{ gap: 10, alignItems: "flex-start" }}>
              <button className="speak-btn" aria-label="Réécouter la question" onClick={() => void speak(q.en, { rate: 0.88 })}>
                <Speaker />
              </button>
              <div>
                <b>{q.en}</b>
                <p className="muted small">{q.fr}</p>
              </div>
            </div>
          </div>
        </div>

        {mic ? (
          <div className={`rec-zone${rec ? " live" : ""}`}>
            <div className="rec-head">
              <span className="rec-dot" />
              <b>{rec ? "Enregistrement" : heard ? "Réponse enregistrée" : "Prêt à t'écouter"}</b>
              <span className="rec-timer">{clock(rec ? answerLeft : ANSWER_SECONDS)}</span>
            </div>
            <div className="wave" aria-hidden>
              {Array.from({ length: 28 }, (_, i) => <i key={i} style={{ animationDelay: `${(i * 137) % 900}ms` }} />)}
            </div>
            <p className="rec-text" aria-live="polite">
              {heard || (rec ? "Parle maintenant…" : "Appuie sur le micro rouge et réponds en anglais.")}
            </p>
          </div>
        ) : (
          <label className="field" htmlFor="placement-answer">Écris ta réponse en anglais
            <textarea id="placement-answer" rows={3} value={typed} onChange={e => setTyped(e.target.value)} placeholder="My name is…" />
          </label>
        )}

        <LevelBar level={live} />
      </div>

      <div className="placement-foot">
        <button className="btn3d ghost" onClick={skip}>Je ne sais pas</button>
        {mic && (
          <button
            className={`rec-btn${rec ? " live" : ""}`}
            aria-label={rec ? "Arrêter l'enregistrement" : "Répondre au micro"}
            onClick={() => (rec ? handle.current?.stop() : void start())}
          >
            {rec ? <Stop /> : <Mic />}
          </button>
        )}
        <button className="btn3d" disabled={!rec && !(mic ? heard : typed).trim()} onClick={next}>Suivant</button>
      </div>
    </div>
  );
}
