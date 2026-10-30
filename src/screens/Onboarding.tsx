import { useState } from "react";
import { Zazou } from "../components/Zazou";
import { setState, type Goal } from "../lib/store";

const GOALS: [Goal, string, string][] = [
  ["travail", "Pour mon travail", "Commerce, transit, clients étrangers"],
  ["voyage", "Pour voyager", "Aéroport, hôtel, rencontres"],
  ["etudes", "Pour mes études", "Examens, cours, lectures"]
];
const TIMES: [10 | 20 | 30, string][] = [
  [10, "Tranquille"],
  [20, "Sérieux"],
  [30, "Intensif"]
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<Goal>("travail");
  const [minutes, setMinutes] = useState<10 | 20 | 30>(20);

  const finish = () =>
    setState(s => ({ ...s, profile: { name: name.trim(), goal, minutes, onboarded: true } }));

  return (
    <div className="onboard">
      <div className="hero">
        {step === 0 ? (
          <img className="zazou-logo" src="/zazou.webp" alt="Zazou, l'ara de Fluent Path" width={260} height={173} />
        ) : (
          <Zazou mood={step === 3 ? "cheer" : "happy"} size={140} />
        )}
        <div className="bubble">
          {step === 0 && "Salut ! Moi c'est Zazou. Je vais t'apprendre l'anglais, 20 minutes par jour."}
          {step === 1 && "Comment tu t'appelles ?"}
          {step === 2 && "Pourquoi veux-tu apprendre l'anglais ?"}
          {step === 3 && "Combien de temps par jour ?"}
        </div>
      </div>

      <div className="option-grid" style={{ alignContent: "start" }}>
        {step === 1 && (
          <input id="name" type="text" autoFocus placeholder="Ton prénom" value={name} onChange={e => setName(e.target.value)} />
        )}
        {step === 2 &&
          GOALS.map(([g, t, d]) => (
            <button key={g} className="choice" aria-pressed={goal === g} onClick={() => setGoal(g)}>
              <b>{t}</b>
              <br />
              <small className="muted">{d}</small>
            </button>
          ))}
        {step === 3 &&
          TIMES.map(([m, t]) => (
            <button key={m} className="choice row" style={{ justifyContent: "space-between" }} aria-pressed={minutes === m} onClick={() => setMinutes(m)}>
              <b>{m} min par jour</b>
              <span className="muted">{t}</span>
            </button>
          ))}
      </div>

      <button
        className="btn3d"
        disabled={step === 1 && !name.trim()}
        onClick={() => (step < 3 ? setStep(step + 1) : finish())}
      >
        {step === 0 ? "Commencer" : step < 3 ? "Continuer" : "C'est parti"}
      </button>
    </div>
  );
}
