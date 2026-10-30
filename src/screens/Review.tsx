import { useMemo, useState } from "react";
import { Bolt } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { SpeechTry } from "../components/SpeechTry";
import { SpeakButton } from "../exercises/Exercises";
import { addActivity, withAchievements } from "../lib/game";
import { dueCards, grade, type Grade } from "../lib/review";
import { getState, setState, useStore } from "../lib/store";
import { sfx } from "../lib/sfx";
import { canListen } from "../lib/listen";

const XP_PER_CARD = 2;
const GRADES: [Grade, string, string][] = [
  [0, "À revoir", "coral"],
  [1, "Difficile", "ghost"],
  [2, "Bien", "mint"],
  [3, "Facile", ""]
];

export function Review() {
  const cards = useStore(s => s.cards);
  const total = Object.keys(cards).length;
  // La file est figée au début de la séance ; « À revoir » remet la carte à la fin.
  const [queue, setQueue] = useState<string[]>(() => dueCards(getState()).map(([id]) => id));
  const [revealed, setRevealed] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const startedAt = useMemo(() => Date.now(), []);

  if (total === 0) {
    return (
      <div className="screen" style={{ justifyItems: "center", textAlign: "center", paddingTop: 48 }}>
        <Zazou mood="think" size={140} />
        <h1 style={{ fontSize: "1.6rem" }}>Pas encore de mots</h1>
        <p className="muted" style={{ maxWidth: 360 }}>Valide une unité ou termine un jeu de rôle : les nouveaux mots arriveront ici automatiquement.</p>
      </div>
    );
  }

  if (!queue.length) {
    const next = Object.values(cards).reduce((m, c) => Math.min(m, c.due), Infinity);
    return (
      <div className="screen" style={{ justifyItems: "center", textAlign: "center", paddingTop: 48 }}>
        <Zazou mood={doneCount ? "cheer" : "sleep"} size={140} />
        <h1 style={{ fontSize: "1.6rem" }}>{doneCount ? `${doneCount} cartes révisées !` : "Tout est à jour"}</h1>
        <p className="muted" style={{ maxWidth: 360 }}>
          {total} mots dans ton paquet. Prochaine révision {Number.isFinite(next) ? "demain ou plus tard" : "bientôt"}.
        </p>
      </div>
    );
  }

  const id = queue[0];
  const card = cards[id];

  const rate = (g: Grade) => {
    sfx.tap();
    const before = getState();
    const graded = grade(before.cards[id], g);
    const withCard = { ...before, cards: { ...before.cards, [id]: graded } };
    const { next } = addActivity(withCard, XP_PER_CARD, queue.length === 1 ? (Date.now() - startedAt) / 1000 : 0);
    setState(() => withAchievements(before, next).next);
    setDoneCount(c => c + 1);
    setRevealed(false);
    setQueue(q => (g === 0 ? [...q.slice(1), id] : q.slice(1)));
  };

  return (
    <div className="screen">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1 style={{ fontSize: "1.5rem" }}>Révisions</h1>
        <span className="tag">{queue.length} à revoir</span>
      </div>
      <div className="card flash">
        <div className="row" style={{ justifyContent: "center", gap: 12 }}>
          <span className="flash-word">{card.en}</span>
          <SpeakButton text={card.en} />
        </div>
        {revealed ? (
          <>
            <p style={{ fontSize: "1.3rem" }}>{card.fr}</p>
            {card.ipa && <p className="ipa muted">{card.ipa}</p>}
            {canListen() && <SpeechTry text={card.en} onResult={() => {}} />}
          </>
        ) : (
          <p className="muted">Que veut dire ce mot ? Dis-le dans ta tête, puis retourne la carte.</p>
        )}
      </div>
      {revealed ? (
        <div className="grades">
          {GRADES.map(([g, label, cls]) => (
            <button key={g} className={`btn3d ${cls}`} onClick={() => rate(g)}>
              {label}
            </button>
          ))}
        </div>
      ) : (
        <button className="btn3d" onClick={() => setRevealed(true)}>Retourner la carte</button>
      )}
      <p className="muted small row" style={{ justifyContent: "center" }}>
        <Bolt width={16} height={16} /> +{XP_PER_CARD} XP par carte · {total} mots au total
      </p>
    </div>
  );
}
