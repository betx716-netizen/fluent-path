import { useEffect } from "react";
import confetti from "canvas-confetti";
import type { Section } from "../data/types";
import { Bolt, Crown, Gem, Target, Trophy } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { ACHIEVEMENTS, TEST_PASS, TEST_SIZE, type TestOutcome } from "../lib/game";
import { sfx } from "../lib/sfx";

export function TestResult({ section, outcome, onRetry, onDone }: { section: Section; outcome: TestOutcome; onRetry: () => void; onDone: () => void }) {
  const need = Math.ceil(TEST_SIZE * TEST_PASS);
  const got = Math.round(outcome.score * TEST_SIZE);

  useEffect(() => {
    if (outcome.passed) {
      sfx.victory();
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        confetti({ particleCount: 160, spread: 100, origin: { y: 0.3 }, colors: ["#4b3fe0", "#ffb020", "#22b97f", "#ff6b5b"] });
      }
    } else sfx.wrong();
  }, [outcome.passed]);

  return (
    <div className="victory">
      <Zazou mood={outcome.passed ? "cheer" : "sad"} size={150} />
      {outcome.passed ? (
        <>
          <Crown width={56} height={56} style={{ color: "var(--sun)" }} />
          <h1>{outcome.jumped ? "Section sautée !" : "Section validée !"}</h1>
          <p className="muted">
            {outcome.jumped
              ? `Tu maîtrises déjà le niveau ${section.cefr} : toutes ses unités sont validées.`
              : `Bravo, le niveau ${section.cefr} est à toi. La section suivante est ouverte.`}
          </p>
        </>
      ) : (
        <>
          <h1 style={{ color: "var(--coral-dark)" }}>Pas encore…</h1>
          <p className="muted">
            Il fallait {need} bonnes réponses sur {TEST_SIZE}. Révise les unités de la section, puis retente ta chance.
          </p>
        </>
      )}
      <div className="tiles">
        <div className="tile" style={{ "--c": outcome.passed ? "var(--mint)" : "var(--coral)" } as React.CSSProperties}>
          <b>Score</b>
          <span><Target style={{ color: outcome.passed ? "var(--mint-dark)" : "var(--coral-dark)" }} />{got}/{TEST_SIZE}</span>
        </div>
        <div className="tile" style={{ "--c": "var(--sun)" } as React.CSSProperties}>
          <b>XP</b>
          <span><Bolt style={{ color: "var(--sun-dark)" }} />{outcome.xp}</span>
        </div>
        <div className="tile" style={{ "--c": "var(--indigo)" } as React.CSSProperties}>
          <b>Gemmes</b>
          <span><Gem />{outcome.gems}</span>
        </div>
      </div>
      {outcome.newAchievements.map(a => (
        <div className="ach on row" key={a} style={{ width: "100%" }}>
          <Trophy />
          <div style={{ textAlign: "left" }}>
            <b>Trophée : {ACHIEVEMENTS[a]?.title}</b>
            <p className="muted">{ACHIEVEMENTS[a]?.desc}</p>
          </div>
        </div>
      ))}
      {!outcome.passed && <button className="btn3d" onClick={onRetry}>Réessayer le test</button>}
      <button className={`btn3d${outcome.passed ? "" : " ghost"}`} onClick={onDone}>Continuer</button>
    </div>
  );
}
