import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import type { Scenario } from "../data/scenarios";
import { Bolt, Check, Mic, Target, Trophy } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { AI_MESSAGES, AiError } from "../lib/ai";
import { ACHIEVEMENTS, XP_OBJECTIVE, XP_ROLEPLAY, addActivity, withAchievements } from "../lib/game";
import { addCards } from "../lib/review";
import { sfx } from "../lib/sfx";
import { speak } from "../lib/speech";
import { getState, setState } from "../lib/store";
import { tutorReport, type Report } from "../lib/tutor";
import type { RoleplayOutcome } from "./Roleplay";

interface Reward {
  xp: number;
  unlocked: string[];
}

export function RoleplayReport({ sc, outcome, onDone }: { sc: Scenario; outcome: RoleplayOutcome; onDone: () => void }) {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reward, setReward] = useState<Reward | null>(null);
  const awarded = useRef(false);
  const pron = outcome.confidences.length
    ? Math.round((outcome.confidences.reduce((a, b) => a + b, 0) / outcome.confidences.length) * 100)
    : null;

  const award = useCallback(
    (r: Report | null) => {
      if (awarded.current) return;
      awarded.current = true;
      const xp = XP_ROLEPLAY + XP_OBJECTIVE * outcome.objectives.length;
      const before = getState();
      let { next } = addActivity(before, xp, outcome.seconds);
      if (r) {
        const prev = next.roleplays[sc.id];
        next = {
          ...next,
          roleplays: {
            ...next.roleplays,
            [sc.id]: { best: Math.max(prev?.best ?? 0, r.score), plays: (prev?.plays ?? 0) + 1, lastAt: new Date().toISOString() }
          }
        };
        next = addCards(next, r.new_words);
      }
      if (pron !== null) next = { ...next, speechScores: [...next.speechScores, pron].slice(-50) };
      const res = withAchievements(before, next);
      setState(() => res.next);
      setReward({ xp, unlocked: res.unlocked });
      sfx.victory();
      if (r && r.score >= 70 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.3 }, colors: ["#4b3fe0", "#ffb020", "#22b97f", "#ff6b5b"] });
      }
    },
    [outcome, pron, sc.id]
  );

  const load = useCallback(async () => {
    setError(null);
    try {
      const r = await tutorReport(sc, outcome.history, outcome.objectives);
      setReport(r);
      award(r);
    } catch (e) {
      setError(e instanceof AiError ? AI_MESSAGES[e.code] : AI_MESSAGES.network);
    }
  }, [sc, outcome, award]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!report && !reward) {
    return (
      <div className="victory">
        <Zazou mood="think" size={140} />
        {error ? (
          <>
            <h2>Bilan indisponible</h2>
            <p className="muted">{error}</p>
            <button className="btn3d" onClick={() => void load()}>Réessayer</button>
            <button className="btn3d ghost" onClick={() => { award(null); }}>Terminer sans bilan</button>
          </>
        ) : (
          <>
            <h2>Zazou prépare ton bilan…</h2>
            <p className="muted">Il relit ta conversation avec {sc.partner.name}.</p>
          </>
        )}
      </div>
    );
  }

  const fallbackErrors = outcome.corrections.slice(0, 3).map(c => ({ original: c.original, better: c.better, rule_fr: c.why_fr }));
  const errors = report?.errors.length ? report.errors : fallbackErrors;

  return (
    <div className="screen" style={{ paddingTop: 24 }}>
      <div style={{ display: "grid", justifyItems: "center", gap: 8, textAlign: "center" }}>
        <Zazou mood={report && report.score >= 70 ? "cheer" : "happy"} size={120} />
        <h1>{report && report.score < 50 ? "Bien essayé !" : "Super !"}</h1>
        <p className="muted">Conversation terminée avec {sc.partner.name}.</p>
        {report?.summary_fr && <p className="muted">{report.summary_fr}</p>}
      </div>

      <div className="tiles">
        <div className="tile" style={{ "--c": "var(--blue)" } as React.CSSProperties}>
          <b>Note</b>
          <span><Target style={{ color: "var(--blue)" }} />{report ? report.score : "–"}</span>
        </div>
        <div className="tile" style={{ "--c": "var(--mint)" } as React.CSSProperties}>
          <b>Voix</b>
          <span><Mic style={{ color: "var(--mint-dark)" }} />{pron ?? "–"}</span>
        </div>
        <div className="tile" style={{ "--c": "var(--sun)" } as React.CSSProperties}>
          <b>XP</b>
          <span><Bolt style={{ color: "var(--sun-dark)" }} />{reward?.xp ?? 0}</span>
        </div>
      </div>
      {pron === null && <p className="muted small" style={{ textAlign: "center" }}>Parle au micro la prochaine fois pour obtenir une note de prononciation.</p>}

      <div className="card" style={{ display: "grid", gap: 8 }}>
        <h3>Objectifs</h3>
        {sc.objectives.map(o => (
          <p key={o.id} className={`obj-line${outcome.objectives.includes(o.id) ? " on" : ""}`}>
            {outcome.objectives.includes(o.id) ? <Check /> : <i />} {o.fr}
          </p>
        ))}
      </div>

      <div className="card" style={{ display: "grid", gap: 12 }}>
        <h3>{errors.length > 1 ? `Tes ${errors.length} erreurs à retenir` : errors.length ? "Ton erreur à retenir" : "Aucune erreur importante"}</h3>
        {errors.map((e, i) => (
          <div key={i} className="err-card">
            <p><span className="del">{e.original}</span></p>
            <p className="row" style={{ gap: 8 }}>
              <span className="ins">{e.better}</span>
              <button className="speak-mini" aria-label={`Écouter : ${e.better}`} onClick={() => void speak(e.better, { rate: 0.85 })}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path fill="currentColor" d="M3 9h4l5-4v14l-5-4H3z" /></svg>
              </button>
            </p>
            <p className="muted small">{e.rule_fr}</p>
          </div>
        ))}
      </div>

      {report && report.new_words.length > 0 && (
        <div className="card" style={{ display: "grid", gap: 4 }}>
          <h3>Mots ajoutés à tes révisions</h3>
          {report.new_words.map(w => (
            <div className="vocab-row" key={w.en}>
              <b>{w.en}</b>
              <span className="muted">{w.fr}</span>
            </div>
          ))}
        </div>
      )}

      {report?.next_focus_fr && (
        <p className="notice info"><b>La prochaine fois : </b>{report.next_focus_fr}</p>
      )}

      {reward?.unlocked.map(a => (
        <div className="ach on row" key={a}>
          <Trophy />
          <div>
            <b>Trophée : {ACHIEVEMENTS[a].title}</b>
            <p className="muted">{ACHIEVEMENTS[a].desc}</p>
          </div>
        </div>
      ))}

      <button className="btn3d" onClick={onDone}>Continuer</button>
    </div>
  );
}
