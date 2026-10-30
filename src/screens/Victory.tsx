import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Bolt, Clock, Flame, Gem, Star, Target, Trophy } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { ACHIEVEMENTS, PASS_STARS, type Reward } from "../lib/game";
import { sfx } from "../lib/sfx";

function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export function Victory({ reward, seconds, onContinue }: { reward: Reward; seconds: number; onContinue: () => void }) {
  const xp = useCountUp(reward.xp);
  const [step, setStep] = useState<"result" | "streak">("result");
  const passed = reward.stars >= PASS_STARS;

  useEffect(() => {
    sfx.victory();
    if (passed && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.35 }, colors: ["#4b3fe0", "#ffb020", "#22b97f", "#ff6b5b"] });
    }
  }, [passed]);

  if (step === "streak") {
    return (
      <div className="victory">
        <Flame width={140} height={140} />
        <h1 style={{ fontSize: "3.2rem" }}>{reward.streak}</h1>
        <h2>{reward.streak === 1 ? "jour de série !" : "jours de série !"}</h2>
        <p className="muted">Reviens demain pour garder ta flamme allumée.</p>
        <button className="btn3d sun" onClick={onContinue}>
          Continuer
        </button>
      </div>
    );
  }

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return (
    <div className="victory">
      <Zazou mood={passed ? "cheer" : "think"} size={150} />
      <h1>{passed ? "Super !" : "Presque !"}</h1>
      {passed && <p className="muted">Leçon terminée.</p>}
      {!passed && <p className="muted">Il faut 3 étoiles pour débloquer la suite. Refais la leçon, tu y es presque.</p>}
      <div className="big-stars" aria-label={`${reward.stars} étoiles sur 5`}>
        {[1, 2, 3, 4, 5].map(k => (
          <Star key={k} on={k <= reward.stars} style={{ animationDelay: `${k * 0.12}s` }} />
        ))}
      </div>
      <div className="tiles">
        <div className="tile" style={{ "--c": "var(--sun)" } as React.CSSProperties}>
          <b>XP gagnés</b>
          <span>
            <Bolt style={{ color: "var(--sun-dark)" }} />
            {xp}
          </span>
        </div>
        <div className="tile" style={{ "--c": "var(--mint)" } as React.CSSProperties}>
          <b>Précision</b>
          <span>
            <Target style={{ color: "var(--mint-dark)" }} />
            {Math.round(reward.accuracy * 100)}%
          </span>
        </div>
        <div className="tile" style={{ "--c": "var(--blue)" } as React.CSSProperties}>
          <b>Temps</b>
          <span>
            <Clock style={{ color: "var(--blue)" }} />
            {min}:{String(sec).padStart(2, "0")}
          </span>
        </div>
      </div>
      <p className="row muted" style={{ justifyContent: "center" }}>
        <Gem width={22} height={22} /> +{reward.gems} gemmes
        {reward.bonus > 0 && <> · bonus sans faute +{reward.bonus} XP</>}
      </p>
      {reward.newAchievements.map(a => (
        <div className="ach on row" key={a} style={{ width: "100%" }}>
          <Trophy />
          <div style={{ textAlign: "left" }}>
            <b>Trophée : {ACHIEVEMENTS[a].title}</b>
            <p className="muted">{ACHIEVEMENTS[a].desc}</p>
          </div>
        </div>
      ))}
      <button className="btn3d" onClick={() => (reward.streakUp ? setStep("streak") : onContinue())}>
        Continuer
      </button>
    </div>
  );
}
