import { Fragment, useState } from "react";
import { SECTIONS } from "../data/units";
import type { Section, Unit } from "../data/types";
import { Book, Check, Chest, Crown, Lock, Star } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { CHEST_AFTER, PASS_STARS, chestId, chestReady, sectionOpen, unitState } from "../lib/game";
import { dailyGoalXp, useStore } from "../lib/store";
import { today } from "../lib/day";

// Zigzag : décalage horizontal de chaque pastille (en px).
const OFFSETS = [0, 52, 78, 52, 0, -52, -78, -52];

export function PathMap({ onStart, onChest }: { onStart: (u: Unit) => void; onChest: (s: Section) => void }) {
  const s = useStore(x => x);
  const [preview, setPreview] = useState<Unit | null>(null);
  const goal = dailyGoalXp(s.profile.minutes);
  const todayXp = s.xpByDay[today()] ?? 0;

  return (
    <div className="screen">
      <div className="card row" style={{ gap: 12 }}>
        <Zazou mood={todayXp >= goal ? "cheer" : "happy"} size={64} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <b>Objectif du jour</b>
          <div className="progress" style={{ margin: "6px 0 4px" }}>
            <i style={{ width: `${Math.min(100, (todayXp / goal) * 100)}%`, background: "var(--sun)" }} />
          </div>
          <small className="muted">
            {todayXp >= goal ? "Objectif atteint, bravo !" : `${todayXp} / ${goal} XP aujourd'hui`}
          </small>
        </div>
      </div>

      {SECTIONS.map((section, si) => {
        const open = sectionOpen(s, section);
        const done = section.units.filter(u => (s.units[u.id]?.stars ?? 0) >= PASS_STARS).length;
        return (
          <Fragment key={section.id}>
            <div className={`section-banner ${open ? section.theme : "locked"}`}>
              <div style={{ minWidth: 0 }}>
                <div className="eyebrow">
                  Section {si + 1} · {section.level} {section.cefr}
                </div>
                <h2>{section.title}</h2>
              </div>
              <span className="count">
                {section.units.length ? `${done} / ${section.units.length}` : "Bientôt"}
              </span>
            </div>
            {section.units.length > 0 ? (
              <SectionPath section={section} onPick={setPreview} onChest={onChest} />
            ) : (
              <p className="muted" style={{ textAlign: "center", padding: "4px 0 12px" }}>
                {section.plannedUnits} unités prévues dans la phase 4
              </p>
            )}
          </Fragment>
        );
      })}

      {preview && (
        <UnitSheet
          unit={preview}
          stars={s.units[preview.id]?.stars ?? 0}
          onClose={() => setPreview(null)}
          onStart={() => {
            setPreview(null);
            onStart(preview);
          }}
        />
      )}
    </div>
  );
}

function SectionPath({ section, onPick, onChest }: { section: Section; onPick: (u: Unit) => void; onChest: (s: Section) => void }) {
  const s = useStore(x => x);
  const nodes: JSX.Element[] = [];
  let n = 0;
  const offset = () => OFFSETS[n++ % OFFSETS.length];

  section.units.forEach((unit, i) => {
    const st = unitState(s, section, i);
    const stars = s.units[unit.id]?.stars ?? 0;
    const x = offset();
    nodes.push(
      <div className="node-wrap" key={unit.id} style={{ transform: `translateX(${x}px)` }}>
        {st === "current" && <span className="start-bubble">{stars ? "REFAIRE" : "COMMENCER"}</span>}
        {st === "current" && <span className="node-ring current" />}
        <button
          className={`node ${st}`}
          style={st !== "locked" && st !== "done" ? ({ "--c": `var(--${section.theme})`, "--cd": `var(--${section.theme}-dark)` } as React.CSSProperties) : undefined}
          aria-label={`${unit.title}${st === "locked" ? " (verrouillée)" : ""}`}
          disabled={st === "locked"}
          onClick={() => onPick(unit)}
        >
          {st === "locked" ? <Lock /> : st === "done" ? <Check /> : <Book />}
        </button>
        {st === "done" && (
          <div className="stars" aria-label={`${stars} étoiles sur 5`}>
            {[1, 2, 3, 4, 5].map(k => (
              <Star key={k} on={k <= stars} />
            ))}
          </div>
        )}
      </div>
    );
    if (i === CHEST_AFTER - 1) {
      const ready = chestReady(s, section);
      const opened = !!s.chests[chestId(section)];
      nodes.push(
        <div className="node-wrap" key="chest" style={{ transform: `translateX(${offset()}px)` }}>
          {ready && <span className="start-bubble">OUVRIR</span>}
          <button
            className={`node chest${ready ? " ready" : ""}`}
            aria-label={opened ? "Coffre déjà ouvert" : ready ? "Ouvrir le coffre" : "Coffre verrouillé"}
            disabled={!ready}
            onClick={() => onChest(section)}
            style={{ opacity: opened ? 0.45 : 1 }}
          >
            <Chest />
          </button>
        </div>
      );
    }
  });

  const allDone = section.units.every(u => (s.units[u.id]?.stars ?? 0) >= PASS_STARS);
  nodes.push(
    <div className="node-wrap" key="boss" style={{ transform: `translateX(${offset()}px)` }}>
      <button className={`node boss ${allDone ? "done" : "locked"}`} disabled aria-label="Test de section, arrive en phase 4">
        <Crown />
      </button>
      <small className="muted" style={{ marginTop: 10 }}>Test de section</small>
    </div>
  );

  return <div className="path">{nodes}</div>;
}

function UnitSheet({ unit, stars, onClose, onStart }: { unit: Unit; stars: number; onClose: () => void; onStart: () => void }) {
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={unit.title}>
        <span className={`tag ${unit.context}`} style={{ justifySelf: "start" }}>
          {unit.context}
        </span>
        <h2>{unit.title}</h2>
        <p className="muted">{unit.goal}</p>
        <div className="row muted" style={{ fontSize: "0.9rem" }}>
          <span>{unit.exercises.length} exercices</span>·<span>{unit.vocab.length} mots</span>·<span>environ 5 min</span>
        </div>
        {stars > 0 && (
          <div className="stars" aria-label={`Meilleur résultat : ${stars} étoiles`}>
            {[1, 2, 3, 4, 5].map(k => (
              <Star key={k} on={k <= stars} width={22} height={22} />
            ))}
          </div>
        )}
        <button className="btn3d" onClick={onStart}>
          {stars ? `Refaire (+${unit.exercises.length * 10} XP max)` : `Commencer (+${unit.exercises.length * 10} XP)`}
        </button>
      </div>
    </>
  );
}
