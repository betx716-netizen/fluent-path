import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { SECTIONS } from "../data/units";
import type { Section, Unit } from "../data/types";
import { Check, Chest, Crown, Guide, Lock, Mic, Star } from "../components/Icons";
import { SpeakButton } from "../exercises/Exercises";
import { Zazou } from "../components/Zazou";
import { CHEST_AFTER, PASS_STARS, TEST_PASS, TEST_SIZE, chestId, chestReady, sectionOpen, sectionUnitsDone, unitState } from "../lib/game";
import { dailyGoalXp, setState, useStore, type State } from "../lib/store";
import { today } from "../lib/day";

// Zigzag : décalage horizontal de chaque pastille (en px).
const OFFSETS = [0, 52, 78, 52, 0, -52, -78, -52];

// L'étape où Zazou se pose : l'unité en cours, ou le test de section quand
// toutes les unités sont faites, sinon la dernière étape validée.
function perchFor(s: State): string | null {
  let last: string | null = null;
  for (const section of SECTIONS) {
    for (let i = 0; i < section.units.length; i++) {
      const st = unitState(s, section, i);
      if (st === "current") return section.units[i].id;
      if (st === "done") last = section.units[i].id;
    }
    if (sectionUnitsDone(s, section) && sectionOpen(s, section) && !s.bosses[section.id]?.passed) return `${section.id}-boss`;
  }
  return last;
}

const PERCH = 64; // taille de Zazou sur la carte

export function PathMap({ onStart, onChest, onTest }: { onStart: (u: Unit) => void; onChest: (s: Section) => void; onTest: (s: Section) => void }) {
  const s = useStore(x => x);
  const [preview, setPreview] = useState<Unit | null>(null);
  const [testFor, setTestFor] = useState<Section | null>(null);
  const [guide, setGuide] = useState<Unit | null>(null);
  const goal = dailyGoalXp(s.profile.minutes);
  const todayXp = s.xpByDay[today()] ?? 0;
  const container = useRef<HTMLDivElement>(null);
  const bird = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLElement>());
  const target = perchFor(s);
  const [hopping, setHopping] = useState(false);

  // Position (dans la carte) où Zazou se tient debout sur une pastille.
  const spot = (id: string | null) => {
    const el = id ? nodes.current.get(id) : null;
    const box = container.current?.getBoundingClientRect();
    if (!el || !box) return null;
    const r = el.getBoundingClientRect();
    const cx = r.left - box.left + r.width / 2;
    const left = cx > box.width / 2;
    const w = bird.current?.offsetWidth ?? PERCH;
    return { x: left ? cx - r.width / 2 - w + 6 : cx + r.width / 2 - 6, y: r.top - box.top + r.height - PERCH + 4, left };
  };
  const [side, setSide] = useState<"left" | "right">("right");

  useLayoutEffect(() => {
    const el = bird.current;
    const to = spot(target);
    if (!el || !to) return;
    const place = (p: { x: number; y: number; left: boolean }) => {
      el.style.transform = `translate(${p.x}px, ${p.y}px)`;
      setSide(p.left ? "left" : "right");
    };
    const from = spot(s.zazouAt);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!from || s.zazouAt === target || reduce) {
      place(to);
      if (s.zazouAt !== target) setState(x => ({ ...x, zazouAt: target }));
      const onResize = () => { const p = spot(target); if (p) place(p); };
      window.addEventListener("resize", onResize);
      void document.fonts?.ready.then(onResize);
      return () => window.removeEventListener("resize", onResize);
    }
    // Nouvelle étape débloquée : Zazou part de l'ancienne et saute sur la nouvelle.
    place(from);
    nodes.current.get(target!)?.scrollIntoView({ behavior: "smooth", block: "center" });
    let anim: Animation | null = null;
    const t = window.setTimeout(() => {
      setHopping(true);
      const peak = Math.min(from.y, to.y) - 90;
      const mid = (a: number, b: number, k: number) => a + (b - a) * k;
      anim = el.animate(
        [
          { transform: `translate(${from.x}px, ${from.y}px) scale(1, 1)` },
          { transform: `translate(${from.x}px, ${from.y + 6}px) scale(1.12, 0.85)`, offset: 0.12 },
          { transform: `translate(${mid(from.x, to.x, 0.5)}px, ${peak}px) scale(0.95, 1.08)`, offset: 0.55 },
          { transform: `translate(${to.x}px, ${to.y + 6}px) scale(1.15, 0.82)`, offset: 0.88 },
          { transform: `translate(${to.x}px, ${to.y}px) scale(1, 1)` }
        ],
        { duration: 950, easing: "ease-in-out" }
      );
      anim.onfinish = () => {
        place(to);
        setHopping(false);
        setState(x => ({ ...x, zazouAt: target }));
      };
    }, 700);
    return () => {
      window.clearTimeout(t);
      anim?.cancel();
    };
  }, [target]);

  return (
    <div className="screen" ref={container} style={{ position: "relative" }}>
      {target && (
        <div className={`perch ${side}`} ref={bird} aria-hidden>
          <Zazou mood={hopping ? "cheer" : "happy"} size={PERCH} />
          <span className="perch-bubble">{hopping ? "Hop !" : target.endsWith("-boss") ? "Le test t'attend !" : "À toi !"}</span>
        </div>
      )}
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
              {open && section.units.length > 0 ? (
                <button className="guide-btn" onClick={() => setGuide(guideUnit(s, section))}>
                  <Guide /> Guide
                </button>
              ) : (
                <span className="count">{section.units.length ? `${done} / ${section.units.length}` : "Bientôt"}</span>
              )}
            </div>
            {!open && section.units.length > 0 && (
              <button className="btn3d ghost small-btn jump-btn" onClick={() => setTestFor(section)}>
                Déjà ce niveau ? Passer le test pour sauter ici
              </button>
            )}
            {section.units.length > 0 ? (
              <SectionPath
                section={section}
                onPick={setPreview}
                onChest={onChest}
                onBoss={() => setTestFor(section)}
                nodeRef={(id, el) => (el ? nodes.current.set(id, el) : nodes.current.delete(id))}
              />
            ) : (
              <p className="muted" style={{ textAlign: "center", padding: "4px 0 12px" }}>
                {section.plannedUnits} unités prévues dans la phase 4
              </p>
            )}
          </Fragment>
        );
      })}

      {guide && <GuideSheet unit={guide} onClose={() => setGuide(null)} onStart={() => { setGuide(null); onStart(guide); }} />}

      {testFor && (
        <>
          <div className="sheet-backdrop" onClick={() => setTestFor(null)} />
          <div className="sheet" role="dialog" aria-modal="true" aria-label="Test de section">
            <span className="tag" style={{ justifySelf: "start" }}>Test · {testFor.level} {testFor.cefr}</span>
            <h2>{testFor.title}</h2>
            <p className="muted">
              {TEST_SIZE} questions tirées de toute la section, sans seconde chance. Il faut {Math.ceil(TEST_SIZE * TEST_PASS)} bonnes réponses.
              {sectionUnitsDone(s, testFor) ? " La réussite ouvre la section suivante." : " Si tu réussis, toutes les unités de la section sont validées d'un coup."}
            </p>
            {s.bosses[testFor.id]?.best ? <p className="tag" style={{ justifySelf: "start" }}>Meilleur score : {s.bosses[testFor.id].best} %</p> : null}
            <button className="btn3d sun" onClick={() => { const sec = testFor; setTestFor(null); onTest(sec); }}>Commencer le test</button>
          </div>
        </>
      )}

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

function SectionPath({ section, onPick, onChest, onBoss, nodeRef }: {
  section: Section;
  onPick: (u: Unit) => void;
  onChest: (s: Section) => void;
  onBoss: () => void;
  nodeRef: (id: string, el: HTMLElement | null) => void;
}) {
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
        {st === "current" && <span className="node-ring current" />}
        <button
          ref={el => nodeRef(unit.id, el)}
          className={`node ${st}`}
          aria-label={`${unit.title}${st === "locked" ? " (verrouillée)" : st === "current" ? " (en cours)" : ""}`}
          disabled={st === "locked"}
          onClick={() => onPick(unit)}
        >
          {st === "locked" ? <Lock /> : st === "done" ? <Check /> : <Mic />}
        </button>
        {st === "current" && <span className="node-label">PARLER</span>}
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

  const passed = !!s.bosses[section.id]?.passed;
  const ready = sectionUnitsDone(s, section) && !passed;
  const open = sectionOpen(s, section);
  nodes.push(
    <div className="node-wrap" key="boss" style={{ transform: `translateX(${offset()}px)` }}>
      {ready && <span className="node-ring current" />}
      <button
        ref={el => nodeRef(`${section.id}-boss`, el)}
        className={`node boss ${passed ? "done" : ready ? "ready" : "locked"}`}
        disabled={!open}
        aria-label={passed ? "Test de section réussi" : "Test de section"}
        onClick={onBoss}
      >
        <Crown />
      </button>
      <small className="muted" style={{ marginTop: 10 }}>{passed ? `Réussi · ${s.bosses[section.id].best} %` : "Test de section"}</small>
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

// L'unité que le Guide présente : celle en cours dans la section, sinon la dernière.
function guideUnit(s: State, section: Section): Unit {
  const i = section.units.findIndex((_, k) => unitState(s, section, k) === "current");
  return section.units[i >= 0 ? i : section.units.length - 1];
}

function GuideSheet({ unit, onClose, onStart }: { unit: Unit; onClose: () => void; onStart: () => void }) {
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet guide-sheet" role="dialog" aria-modal="true" aria-label={`Guide : ${unit.title}`}>
        <div className="say">
          <Zazou mood="wave" size={72} />
          <div className="bubble">
            <b>Guide · {unit.title}</b>
            <p className="muted" style={{ fontSize: 15 }}>{unit.goal}</p>
          </div>
        </div>
        <div className="card intro-card">
          <h3>À retenir</h3>
          <ul>{unit.points.map(p => <li key={p}>{p}</li>)}</ul>
        </div>
        <div className="card intro-card">
          <h3>Phrases clés</h3>
          {unit.examples.map(([en, fr]) => (
            <div className="vocab-row" key={en}>
              <SpeakButton text={en} />
              <div><b>{en}</b><p className="muted">{fr}</p></div>
            </div>
          ))}
        </div>
        <button className="btn3d" onClick={onStart}>Commencer l'unité</button>
        <button className="btn3d ghost" onClick={onClose}>Fermer</button>
      </div>
    </>
  );
}
