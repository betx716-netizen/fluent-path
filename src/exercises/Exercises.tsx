import { useEffect, useMemo, useState } from "react";
import type { Exercise } from "../data/types";
import { shuffle } from "../lib/game";
import { speak } from "../lib/speech";
import { sfx } from "../lib/sfx";
import { Speaker } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { SpeechTry } from "../components/SpeechTry";
import { PASS_SPEECH } from "../lib/score";
import { setState } from "../lib/store";

function recordSpeech(score: number) {
  setState(s => ({ ...s, speechScores: [...s.speechScores, score].slice(-50) }));
}

export type Answer = number | string[] | { mistakes: number } | { speech: number };

export interface ExProps<E extends Exercise = Exercise> {
  ex: E;
  checked: boolean;
  onAnswer: (a: Answer | null) => void;
}

const norm = (s: string) =>
  s.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();

export function isCorrect(ex: Exercise, a: Answer): boolean {
  switch (ex.type) {
    case "mcq":
    case "fill":
    case "listen":
      return a === ex.answer;
    case "build":
    case "listen_order":
      return Array.isArray(a) && norm(a.join(" ")) === norm(ex.answer);
    case "pairs":
      return typeof a === "object" && "mistakes" in a && a.mistakes === 0;
    case "speak":
    case "speak_translate":
      return typeof a === "object" && "speech" in a && a.speech >= (ex.pass ?? PASS_SPEECH);
    case "discover":
      return true;
  }
}

export function solution(ex: Exercise): string {
  switch (ex.type) {
    case "mcq":
    case "listen":
      return ex.options[ex.answer];
    case "fill":
      return ex.sentence.replace("___", ex.options[ex.answer]);
    case "build":
      return ex.answer + (/[?]$/.test(ex.fr) ? "?" : ".");
    case "pairs":
    case "discover":
      return "";
    case "speak":
      return ex.text;
    case "listen_order":
      return ex.audio;
    case "speak_translate":
      return ex.answer;
  }
}

export function explanation(ex: Exercise): string {
  if (ex.type === "pairs" || ex.type === "discover") return "";
  if (ex.type === "speak") return "Écoute le modèle, puis réessaie : les mots en rouge n'ont pas été reconnus.";
  if (ex.type === "speak_translate") return "Écoute la bonne phrase avec le bouton bleu, puis répète-la.";
  if (ex.type === "listen_order") return `Traduction : ${ex.fr}`;
  return ex.explain;
}

export function title(ex: Exercise): string {
  return {
    mcq: "Choisis la bonne réponse",
    fill: "Complète la phrase",
    build: "Traduis cette phrase",
    listen: "Écoute et choisis ce que tu entends",
    pairs: "Associe les paires",
    speak: "Lis cette phrase à voix haute",
    discover: "Nouveau mot",
    listen_order: "Écoute et remets les mots dans l'ordre",
    speak_translate: "Dis cette phrase en anglais"
  }[ex.type];
}

export function SpeakButton({ text, big }: { text: string; big?: boolean }) {
  return (
    <button className={`speak-btn${big ? " big" : ""}`} aria-label={`Écouter : ${text}`} onClick={() => void speak(text)}>
      <Speaker />
    </button>
  );
}

function Choices({ options, order, checked, answer, onAnswer }: {
  options: string[];
  order: number[];
  checked: boolean;
  answer: number;
  onAnswer: (a: Answer | null) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="choices" role="radiogroup">
      {order.map(i => {
        let cls = "choice";
        if (checked && i === answer) cls += " right";
        else if (checked && i === picked) cls += " wrong";
        return (
          <button
            key={i}
            className={cls}
            role="radio"
            aria-checked={picked === i}
            aria-pressed={!checked && picked === i}
            disabled={checked}
            onClick={() => {
              sfx.tap();
              setPicked(i);
              onAnswer(i);
            }}
          >
            {options[i]}
          </button>
        );
      })}
    </div>
  );
}

function useOrder(n: number) {
  return useMemo(() => shuffle(Array.from({ length: n }, (_, i) => i)), [n]);
}

export function Mcq({ ex, checked, onAnswer }: ExProps<Extract<Exercise, { type: "mcq" }>>) {
  const order = useOrder(ex.options.length);
  return (
    <>
      <div className="say">
        <Zazou mood="think" size={84} />
        <div className="bubble">{ex.prompt}</div>
      </div>
      <Choices options={ex.options} order={order} checked={checked} answer={ex.answer} onAnswer={onAnswer} />
    </>
  );
}

export function Fill({ ex, checked, onAnswer }: ExProps<Extract<Exercise, { type: "fill" }>>) {
  const order = useOrder(ex.options.length);
  const [picked, setPicked] = useState<number | null>(null);
  const [before, after] = ex.sentence.split("___");
  return (
    <>
      <p className="gap-sentence">
        {before}
        <span className="gap-slot">{picked === null ? " " : ex.options[picked]}</span>
        {after}
      </p>
      <Choices
        options={ex.options}
        order={order}
        checked={checked}
        answer={ex.answer}
        onAnswer={a => {
          setPicked(a as number);
          onAnswer(a);
        }}
      />
    </>
  );
}

export function Listen({ ex, checked, onAnswer }: ExProps<Extract<Exercise, { type: "listen" }>>) {
  const order = useOrder(ex.options.length);
  useEffect(() => {
    const t = setTimeout(() => void speak(ex.audio), 300);
    return () => clearTimeout(t);
  }, [ex.audio]);
  return (
    <>
      <div className="row" style={{ justifyContent: "center", gap: 16 }}>
        <SpeakButton text={ex.audio} big />
        <button className="speak-btn" aria-label="Écouter lentement" onClick={() => void speak(ex.audio, { rate: 0.6 })} title="Lentement">
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.04em" }} aria-hidden>LENT</span>
        </button>
      </div>
      <Choices options={ex.options} order={order} checked={checked} answer={ex.answer} onAnswer={onAnswer} />
    </>
  );
}

export function Build({ ex, checked, onAnswer }: ExProps<Extract<Exercise, { type: "build" }>>) {
  const tiles = useMemo(() => shuffle([...ex.answer.split(" "), ...ex.extra]).map((w, i) => ({ w, i })), [ex]);
  const [chosen, setChosen] = useState<number[]>([]);
  const update = (next: number[]) => {
    setChosen(next);
    onAnswer(next.length ? next.map(i => tiles[i].w) : null);
  };
  return (
    <>
      <div className="say">
        <Zazou mood="happy" size={84} />
        <div className="bubble">{ex.fr}</div>
      </div>
      <div className="answer-line" aria-label="Ta phrase">
        {chosen.map(i => (
          <button key={i} className="word" disabled={checked} onClick={() => { sfx.tap(); update(chosen.filter(c => c !== i)); }}>
            {tiles[i].w}
          </button>
        ))}
      </div>
      <div className="bank" aria-label="Mots disponibles">
        {tiles.map(t => (
          <button
            key={t.i}
            className={`word${chosen.includes(t.i) ? " used" : ""}`}
            disabled={checked || chosen.includes(t.i)}
            onClick={() => {
              sfx.tap();
              void speak(t.w, { rate: 1 });
              update([...chosen, t.i]);
            }}
          >
            {t.w}
          </button>
        ))}
      </div>
    </>
  );
}

export function Pairs({ ex, checked, onAnswer }: ExProps<Extract<Exercise, { type: "pairs" }>>) {
  const left = useMemo(() => shuffle(ex.pairs.map((_, i) => i)), [ex]);
  const right = useMemo(() => shuffle(ex.pairs.map((_, i) => i)), [ex]);
  const [sel, setSel] = useState<{ side: "en" | "fr"; i: number } | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [bad, setBad] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const pick = (side: "en" | "fr", i: number) => {
    if (checked) return;
    if (side === "en") void speak(ex.pairs[i][0], { rate: 1 });
    if (!sel || sel.side === side) {
      sfx.tap();
      setSel({ side, i });
      return;
    }
    if (sel.i === i) {
      sfx.correct();
      const m = [...matched, i];
      setMatched(m);
      setSel(null);
      if (m.length === ex.pairs.length) onAnswer({ mistakes });
    } else {
      sfx.wrong();
      setMistakes(x => x + 1);
      setBad(`${side}-${i}`);
      setTimeout(() => setBad(null), 400);
      setSel(null);
    }
  };

  const cls = (side: "en" | "fr", i: number) =>
    "choice" +
    (matched.includes(i) ? " matched" : "") +
    (bad === `${side}-${i}` ? " wrong shake" : "");

  return (
    <div className="pairs">
      <div className="choices">
        {left.map(i => (
          <button key={i} className={cls("en", i)} aria-pressed={sel?.side === "en" && sel.i === i} onClick={() => pick("en", i)}>
            {ex.pairs[i][0]}
          </button>
        ))}
      </div>
      <div className="choices">
        {right.map(i => (
          <button key={i} className={cls("fr", i)} aria-pressed={sel?.side === "fr" && sel.i === i} onClick={() => pick("fr", i)}>
            {ex.pairs[i][1]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Speak({ ex, checked, onAnswer }: ExProps<Extract<Exercise, { type: "speak" }>>) {
  return (
    <>
      <div className="say">
        <SpeakButton text={ex.text} />
        <div className="bubble">
          <b>{ex.text}</b>
          <p className="muted" style={{ fontSize: "0.95rem" }}>{ex.fr}</p>
        </div>
      </div>
      <SpeechTry
        text={ex.text}
        pass={ex.pass}
        disabled={checked}
        onResult={r => {
          recordSpeech(r.score);
          onAnswer({ speech: r.score });
        }}
      />
    </>
  );
}

// Découverte d'un mot : rien à vérifier, on écoute et on retient.
export function Discover({ ex }: ExProps<Extract<Exercise, { type: "discover" }>>) {
  useEffect(() => {
    const t = setTimeout(() => void speak(ex.en), 300);
    return () => clearTimeout(t);
  }, [ex.en]);
  return (
    <div className="discover card">
      <SpeakButton text={ex.en} big />
      <p className="discover-en">{ex.en}</p>
      <p className="discover-say">se dit « {ex.say} »</p>
      <p className="discover-fr">{ex.fr}</p>
    </div>
  );
}

// Écoute une phrase puis remets les mots dans l'ordre (sans mots pièges).
export function ListenOrder({ ex, checked, onAnswer }: ExProps<Extract<Exercise, { type: "listen_order" }>>) {
  const tiles = useMemo(() => shuffle(ex.tiles).map((w, i) => ({ w, i })), [ex]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [showFr, setShowFr] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => void speak(ex.audio), 300);
    return () => clearTimeout(t);
  }, [ex.audio]);
  const update = (next: number[]) => {
    setChosen(next);
    onAnswer(next.length ? next.map(i => tiles[i].w) : null);
  };
  return (
    <>
      <div className="row" style={{ justifyContent: "center", gap: 16 }}>
        <SpeakButton text={ex.audio} big />
        <button className="speak-btn" aria-label="Écouter lentement" onClick={() => void speak(ex.audio, { rate: 0.6 })}>
          <span style={{ fontSize: 12, fontWeight: 900 }} aria-hidden>LENT</span>
        </button>
      </div>
      <button className="linkbtn" style={{ justifySelf: "center" }} onClick={() => setShowFr(v => !v)}>
        {showFr ? ex.fr : "Voir la traduction"}
      </button>
      <div className="answer-line" aria-label="Ta phrase">
        {chosen.map(i => (
          <button key={i} className="word" disabled={checked} onClick={() => { sfx.tap(); update(chosen.filter(c => c !== i)); }}>
            {tiles[i].w}
          </button>
        ))}
      </div>
      <div className="bank" aria-label="Mots disponibles">
        {tiles.map(t => (
          <button key={t.i} className={`word${chosen.includes(t.i) ? " used" : ""}`} disabled={checked || chosen.includes(t.i)} onClick={() => { sfx.tap(); update([...chosen, t.i]); }}>
            {t.w}
          </button>
        ))}
      </div>
    </>
  );
}

// Traduire à l'oral : on lit le français, on dit la phrase en anglais.
export function SpeakTranslate({ ex, checked, onAnswer }: ExProps<Extract<Exercise, { type: "speak_translate" }>>) {
  return (
    <>
      <div className="say">
        <Zazou mood="think" size={84} />
        <div className="bubble">
          <b>{ex.fr}</b>
          <p className="muted" style={{ fontSize: "0.95rem" }}>Dis-le en anglais, sans regarder la réponse.</p>
        </div>
      </div>
      <SpeechTry
        text={ex.answer}
        pass={ex.pass}
        disabled={checked}
        onResult={r => {
          recordSpeech(r.score);
          onAnswer({ speech: r.score });
        }}
      />
    </>
  );
}

export function ExerciseView(props: ExProps) {
  const { ex } = props;
  switch (ex.type) {
    case "mcq":
      return <Mcq {...props} ex={ex} />;
    case "fill":
      return <Fill {...props} ex={ex} />;
    case "listen":
      return <Listen {...props} ex={ex} />;
    case "build":
      return <Build {...props} ex={ex} />;
    case "pairs":
      return <Pairs {...props} ex={ex} />;
    case "speak":
      return <Speak {...props} ex={ex} />;
    case "discover":
      return <Discover {...props} ex={ex} />;
    case "listen_order":
      return <ListenOrder {...props} ex={ex} />;
    case "speak_translate":
      return <SpeakTranslate {...props} ex={ex} />;
  }
}
