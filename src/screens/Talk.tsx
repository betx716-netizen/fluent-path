import { SCENARIOS, type Scenario } from "../data/scenarios";
import { GENERAL_SCENARIOS } from "../data/general";
import { allUnits } from "../data/units";
import { Lock, Star } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { PASS_STARS } from "../lib/game";
import { useStore } from "../lib/store";

export function scenarioOpen(units: Record<string, { stars: number }>, sc: Scenario) {
  return !sc.unlockAfter || (units[sc.unlockAfter]?.stars ?? 0) >= PASS_STARS;
}

const scoreStars = (score: number) => (score >= 90 ? 3 : score >= 70 ? 2 : score > 0 ? 1 : 0);

export function Talk({ onStart }: { onStart: (sc: Scenario) => void }) {
  const s = useStore(x => x);
  return (
    <div className="screen">
      <div className="row" style={{ gap: 12 }}>
        <Zazou mood="wave" size={80} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: "1.5rem" }}>Parler</h1>
          <p className="muted">Des situations de la vie réelle, du maquis au port de Lomé. Parle au micro, ton interlocuteur te répond.</p>
        </div>
      </div>
      {([["Anglais général", GENERAL_SCENARIOS], ["Anglais pro", SCENARIOS]] as const).map(([label, list]) => (
      <div key={label} style={{ display: "grid", gap: 12 }}>
        <h3 className="chapter-title">{label}</h3>
        {list.map(sc => {
          const open = scenarioOpen(s.units, sc);
          const best = s.roleplays[sc.id]?.best ?? 0;
          const need = allUnits.find(u => u.id === sc.unlockAfter);
          return (
            <button key={sc.id} className={`scenario${open ? "" : " locked"}`} disabled={!open} onClick={() => onStart(sc)}>
              <span className={`avatar v-${sc.partner.voice}`} aria-hidden>
                {sc.partner.name[0]}
              </span>
              <span className="sc-body">
                <span className="row" style={{ gap: 6 }}>
                  <span className={`tag ${sc.context}`}>{sc.context}</span>
                  <span className="tag">{sc.level}</span>
                </span>
                <b>{sc.title}</b>
                <small className="muted">
                  {open
                    ? `Avec ${sc.partner.name}, ${sc.partner.role} · ${sc.partner.origin}`
                    : `Se débloque après l'unité « ${need?.title ?? ""} »`}
                </small>
              </span>
              {open ? (
                <span className="stars" aria-label={best ? `Meilleur score ${best}` : "Pas encore joué"}>
                  {[1, 2, 3].map(k => (
                    <Star key={k} on={k <= scoreStars(best)} />
                  ))}
                </span>
              ) : (
                <Lock width={24} height={24} style={{ color: "var(--muted)" }} />
              )}
            </button>
          );
        })}
      </div>
      ))}
    </div>
  );
}
