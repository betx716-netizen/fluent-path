import { useEffect, useRef, useState } from "react";
import { LISTEN_MESSAGES, ListenError, canListen, listen } from "../lib/listen";
import { PASS_SPEECH, scoreSpeech, type WordScore } from "../lib/score";
import { speak } from "../lib/speech";
import { sfx } from "../lib/sfx";
import { Mic } from "./Icons";
import { COURSE_SETTINGS } from "../data/course";

// Bouton micro + note mot à mot. Réutilisé dans les leçons et les révisions.
// Couleur de la note : parfait (≥ 85), presque (60–84), réessaie (< 60).
export function scoreBand(score: number): { cls: "perfect" | "almost" | "retry"; label: string } {
  if (score >= COURSE_SETTINGS.scoreColors.perfect) return { cls: "perfect", label: "Parfait !" };
  if (score >= COURSE_SETTINGS.scoreColors.almost) return { cls: "almost", label: "Presque !" };
  return { cls: "retry", label: "Réessaie" };
}

export function SpeechTry({
  text,
  disabled,
  pass = PASS_SPEECH,
  onResult
}: {
  text: string;
  disabled?: boolean;
  pass?: number;
  onResult: (r: { score: number; words: WordScore[]; heard: string }) => void;
}) {
  const [state, setState] = useState<"idle" | "listening" | "done">("idle");
  const [interim, setInterim] = useState("");
  const [result, setResult] = useState<{ score: number; words: WordScore[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handle = useRef<ReturnType<typeof listen> | null>(null);

  useEffect(() => () => handle.current?.abort(), []);

  const start = async () => {
    if (state === "listening") {
      handle.current?.stop();
      return;
    }
    setError(null);
    setInterim("");
    window.speechSynthesis?.cancel();
    const h = listen({ lang: "en-US", onInterim: setInterim });
    handle.current = h;
    setState("listening");
    try {
      const heard = await h.promise;
      const r = scoreSpeech(text, heard.text, heard.confidence);
      setResult(r);
      setState("done");
      if (r.score >= pass) sfx.correct();
      onResult({ ...r, heard: heard.text });
    } catch (e) {
      setState(result ? "done" : "idle");
      const code = e instanceof ListenError ? e.code : "aborted";
      if (LISTEN_MESSAGES[code]) setError(LISTEN_MESSAGES[code]);
    }
  };

  if (!canListen()) return <p className="notice">{LISTEN_MESSAGES.unsupported}</p>;

  return (
    <div className="speech-try">
      {result ? (
        <p className="spoken">
          {result.words.map((w, i) => (
            <button key={i} className={w.ok ? "w-ok" : "w-ko"} onClick={() => void speak(w.word, { rate: 0.8 })} title="Écouter ce mot">
              {w.word}
            </button>
          ))}
        </p>
      ) : null}
      <button
        className={`mic-btn${state === "listening" ? " live" : ""}`}
        disabled={disabled}
        aria-label={state === "listening" ? "Arrêter l'écoute" : "Parler"}
        onClick={() => void start()}
      >
        <Mic />
      </button>
      <p className="muted mic-label" aria-live="polite">
        {state === "listening"
          ? interim || "Je t'écoute… appuie encore quand tu as fini"
          : result
            ? <span className={`score-badge ${scoreBand(result.score).cls}`}>{scoreBand(result.score).label} {result.score}/100</span>
            : "Appuie sur le micro et parle"}
        {result && result.score < pass && state !== "listening" && <><br />Il faut {pass}/100 : appuie pour réessayer</>}
      </p>
      {error && <p className="notice">{error}</p>}
    </div>
  );
}
