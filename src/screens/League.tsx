import { useEffect, useState } from "react";
import { NavLeague } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { DEMOTE, GROUP_SIZE, LEAGUES, PROMOTE, standings, weekProgress } from "../lib/league";
import { today, weekEndsAt, weekOf } from "../lib/day";
import { setState, useStore } from "../lib/store";

export function LeagueBadge({ tier, size = 44, locked }: { tier: number; size?: number; locked?: boolean }) {
  const L = LEAGUES[tier];
  return (
    <span className={`league-badge${locked ? " locked" : ""}`} style={{ width: size, height: size, ["--c" as string]: L.color, ["--cd" as string]: L.dark }}>
      <NavLeague width={size * 0.62} height={size * 0.62} />
    </span>
  );
}

function countdown(ms: number) {
  const m = Math.max(0, Math.floor(ms / 60000));
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  return d > 0 ? `${d} j ${h} h` : `${h} h ${m % 60} min`;
}

export function League() {
  const s = useStore(x => x);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(t);
  }, []);
  const week = weekOf(today());
  const tier = s.league.tier;
  const L = LEAGUES[tier];
  const board = standings(s, tier, week, weekProgress(new Date(now)));
  const top = tier < LEAGUES.length - 1;
  const bottom = tier > 0;
  const last = s.league.last;

  return (
    <div className="screen">
      <div className="league-badges" aria-label="Ligues">
        {LEAGUES.map((_, i) => <LeagueBadge key={i} tier={i} size={i === tier ? 46 : 34} locked={i > tier} />)}
      </div>

      <div className="league-hero" style={{ ["--c" as string]: L.color, ["--cd" as string]: L.dark }}>
        <LeagueBadge tier={tier} size={88} />
        <h1>Ligue {L.name}</h1>
        <p>
          Fin de la semaine dans <b>{countdown(weekEndsAt(week) - now)}</b>
        </p>
        <small>
          {top ? `Les ${PROMOTE} premiers montent en ligue ${LEAGUES[tier + 1].name}.` : "Tu es dans la meilleure ligue."}
          {bottom ? ` Les ${DEMOTE} derniers descendent.` : ""}
        </small>
      </div>

      {last && (
        <div className={`notice ${last.change >= 0 ? "info" : ""} row`} style={{ gap: 10 }}>
          <Zazou mood={last.change > 0 ? "cheer" : last.change < 0 ? "sad" : "happy"} size={48} />
          <span style={{ flex: 1 }}>
            Semaine dernière : {last.rank}<sup>e</sup>.{" "}
            {last.change > 0 ? `Tu montes en ligue ${L.name} !` : last.change < 0 ? `Tu redescends en ligue ${L.name}.` : `Tu restes en ligue ${L.name}.`}
          </span>
          <button className="linkbtn" onClick={() => setState(x => ({ ...x, league: { ...x.league, last: null } }))}>OK</button>
        </div>
      )}

      <ol className="board">
        {board.map((p, i) => {
          const rank = i + 1;
          const zone = top && rank <= PROMOTE ? "up" : bottom && rank > GROUP_SIZE - DEMOTE ? "down" : "";
          return (
            <li key={p.name + i} className={`${zone}${p.me ? " me" : ""}`}>
              <span className="rank">{rank}</span>
              <span className="avatar small" aria-hidden>{p.name[0]}</span>
              <b className="pname">{p.me ? `${p.name} (toi)` : p.name}</b>
              <span className="pxp">{p.xp} XP</span>
              {top && rank === PROMOTE && <span className="zone-line up">Zone de montée</span>}
              {bottom && rank === GROUP_SIZE - DEMOTE && <span className="zone-line down">Zone de descente</span>}
            </li>
          );
        })}
      </ol>
      <p className="muted small">Les autres joueurs sont simulés tant que l'app n'a qu'un utilisateur. Ton XP de la semaine, lui, est bien réel.</p>
    </div>
  );
}
