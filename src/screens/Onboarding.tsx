import { useState } from "react";
import { Zazou } from "../components/Zazou";
import { Briefcase, Cap, Chart, Plane } from "../components/Icons";
import { applyPlacement } from "../lib/placement";
import { setState, type DailyMinutes, type Goal, type Level } from "../lib/store";
import { sendSmsCode, syncEnabled, verifySmsCode } from "../lib/sync";
import { PlacementTest } from "./PlacementTest";

const GOALS: [Goal, string, string, typeof Briefcase, string][] = [
  ["travail", "Travail", "Collègues, clients, réunions", Briefcase, "indigo"],
  ["voyage", "Voyages", "Aéroport, hôtel, rencontres", Plane, "blue"],
  ["etudes", "Études", "Cours, examens, lectures", Cap, "mint"],
  ["business", "Business", "Commerce, transit, négociation", Chart, "sun"]
];
const TIMES: [DailyMinutes, string][] = [
  [5, "Juste un peu"],
  [10, "Tranquille"],
  [15, "Sérieux"],
  [20, "Intensif"]
];

// Numéro ivoirien : 10 chiffres depuis 2021 (8 avant).
const cleanPhone = (p: string) => p.replace(/\D/g, "");
const phoneOk = (p: string) => /^\d{8,10}$/.test(cleanPhone(p));

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState<Goal>("travail");
  const [minutes, setMinutes] = useState<DailyMinutes>(10);
  const [testing, setTesting] = useState(false);
  const [sms, setSms] = useState<"idle" | "sending" | "sent" | "verified">("idle");
  const [code, setCode] = useState("");
  const [smsError, setSmsError] = useState<string | null>(null);

  const full = `+225${cleanPhone(phone)}`;
  const finish = (level: Level | null) =>
    setState(s => {
      const next = {
        ...s,
        profile: { name: name.trim(), goal, minutes, onboarded: true, phone: phone.trim() ? full : undefined, verified: sms === "verified" }
      };
      return level ? applyPlacement(next, level) : next;
    });

  if (testing) return <PlacementTest onDone={finish} onExit={() => setTesting(false)} />;

  const sendCode = async () => {
    setSmsError(null);
    setSms("sending");
    try {
      await sendSmsCode(full);
      setSms("sent");
    } catch {
      setSms("idle");
      setSmsError("Envoi du SMS impossible pour l'instant. Tu peux continuer sans code.");
    }
  };
  const checkCode = async () => {
    setSmsError(null);
    try {
      await verifySmsCode(full, code.trim());
      setSms("verified");
    } catch {
      setSmsError("Code incorrect ou expiré.");
    }
  };

  return (
    <div className="onboard signup">
      <div className="steps" aria-label={`Étape ${step} sur 3`}>
        <div className="steps-bar">
          {[1, 2, 3].map(k => <i key={k} className={k <= step ? "on" : ""} />)}
        </div>
        <b>{step}/3</b>
      </div>

      <div className="hero-row">
        <Zazou mood={step === 3 ? "cheer" : "wave"} size={96} />
        <div className="bubble">
          {step === 1 && "Salut ! Moi c'est Zazou. Dis-moi qui tu es et pourquoi tu veux parler anglais."}
          {step === 2 && `Super${name.trim() ? `, ${name.trim()}` : ""} ! Combien de temps par jour veux-tu pratiquer ?`}
          {step === 3 && "Dernière étape : un petit test oral pour trouver ton niveau. 6 questions, 3 minutes."}
        </div>
      </div>

      {step === 1 && (
        <div className="signup-form">
          <label className="field" htmlFor="name">Prénom
            <input id="name" type="text" autoComplete="given-name" placeholder="Ton prénom" value={name} onChange={e => setName(e.target.value)} />
          </label>
          <label className="field" htmlFor="phone">Numéro WhatsApp
            <span className="phone-input">
              <span className="prefix">+225</span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="07 00 00 00 00"
                value={phone}
                disabled={sms === "verified"}
                onChange={e => { setPhone(e.target.value); setSms("idle"); }}
              />
            </span>
          </label>
          {syncEnabled ? (
            sms === "verified" ? (
              <p className="notice info">Numéro vérifié : ta progression sera sauvegardée.</p>
            ) : sms === "sent" ? (
              <div className="row code-row">
                <input id="sms-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="Code à 6 chiffres" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} />
                <button className="btn3d small-btn" disabled={code.length < 6} onClick={() => void checkCode()}>Vérifier</button>
              </div>
            ) : (
              <button className="btn3d ghost small-btn" disabled={!phoneOk(phone) || sms === "sending"} onClick={() => void sendCode()}>
                {sms === "sending" ? "Envoi…" : "Recevoir le code par SMS"}
              </button>
            )
          ) : (
            <p className="muted small">Facultatif. La connexion par code SMS s'active avec la sauvegarde en ligne ; en attendant, tout reste sur ce téléphone.</p>
          )}
          {smsError && <p className="notice">{smsError}</p>}

          <b className="form-label">Ton objectif</b>
          <div className="goal-grid">
            {GOALS.map(([g, t, d, Icon, c]) => (
              <button key={g} className={`goal-card ${c}`} aria-pressed={goal === g} onClick={() => setGoal(g)}>
                <span className="goal-icon"><Icon /></span>
                <b>{t}</b>
                <small>{d}</small>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="option-grid" style={{ alignContent: "start" }}>
          {TIMES.map(([m, t]) => (
            <button key={m} className="choice row" style={{ justifyContent: "space-between" }} aria-pressed={minutes === m} onClick={() => setMinutes(m)}>
              <b>{m} min par jour</b>
              <span className="muted">{t}</span>
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="option-grid" style={{ alignContent: "start" }}>
          <div className="card test-intro">
            <b>Test de niveau oral</b>
            <p className="muted">Zazou te pose 6 questions en anglais. Réponds à voix haute, comme tu peux. Ton niveau final choisit ton unité de départ.</p>
          </div>
          <button className="btn3d ghost" onClick={() => finish(null)}>Je débute : commencer au début</button>
        </div>
      )}

      <div className="signup-foot">
        {step > 1 && <button className="linkbtn" onClick={() => setStep(step - 1)}>Retour</button>}
        <button
          className="btn3d"
          disabled={step === 1 && (!name.trim() || (!!phone.trim() && !phoneOk(phone)))}
          onClick={() => (step < 3 ? setStep(step + 1) : setTesting(true))}
        >
          {step < 3 ? "Continuer" : "Passer le test"}
        </button>
      </div>
    </div>
  );
}
