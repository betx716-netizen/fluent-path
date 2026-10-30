import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { allUnits } from "../data/units";
import { Bolt, Book, Clock, Flame, Gem, Snow, Trophy } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { ACHIEVEMENTS, FREEZE_PRICE, PASS_STARS, buyFreeze } from "../lib/game";
import { dailyGoalXp, initialState, replaceState, setState, useStore } from "../lib/store";
import { dayLabel, today } from "../lib/day";
import { sendMagicLink, signOut, syncEnabled } from "../lib/sync";

export function Profile({ session, toast }: { session: Session | null; toast: (m: string) => void }) {
  const s = useStore(x => x);
  const [confirmReset, setConfirmReset] = useState(false);
  const goal = dailyGoalXp(s.profile.minutes);
  const days = Array.from({ length: 7 }, (_, i) => today() - 6 + i);
  const max = Math.max(goal, ...days.map(d => s.xpByDay[d] ?? 0));
  const unitsDone = allUnits.filter(u => (s.units[u.id]?.stars ?? 0) >= PASS_STARS).length;

  return (
    <div className="screen">
      <div className="row" style={{ gap: 14 }}>
        <Zazou mood="wave" size={88} />
        <div>
          <h1 style={{ fontSize: "1.6rem" }}>{s.profile.name || "Apprenant"}</h1>
          <p className="muted">Objectif : {s.profile.minutes} min par jour · {goal} XP</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><Flame /><div><b>{s.streak}</b><small>série (record {s.streakBest})</small></div></div>
        <div className="stat-card"><Bolt style={{ color: "var(--indigo)" }} /><div><b>{s.xpTotal}</b><small>XP au total</small></div></div>
        <div className="stat-card"><Book style={{ color: "var(--mint)" }} /><div><b>{unitsDone}</b><small>unités validées</small></div></div>
        <div className="stat-card"><Clock style={{ color: "var(--coral)" }} /><div><b>{s.minutesTotal}</b><small>minutes apprises</small></div></div>
      </div>

      <div className="card" style={{ display: "grid", gap: 12 }}>
        <h3>Tes 7 derniers jours</h3>
        <div className="week">
          {days.map(d => {
            const v = s.xpByDay[d] ?? 0;
            return (
              <div className="bar" key={d} title={`${v} XP`}>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{v || ""}</span>
                <i className={v >= goal ? "hit" : ""} style={{ height: `${(v / max) * 80}%` }} />
                <span style={{ fontWeight: d === today() ? 800 : 400 }}>{dayLabel(d)}</span>
              </div>
            );
          })}
        </div>
        <small className="muted">Barre pleine = objectif du jour atteint ({goal} XP).</small>
      </div>

      <div className="card" style={{ display: "grid", gap: 10 }}>
        <div className="row">
          <Snow width={32} height={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <b>Gels de série : {s.freezes} / 2</b>
            <p className="muted" style={{ fontSize: "0.9rem" }}>Un gel protège ta série si tu rates un jour.</p>
          </div>
        </div>
        <button
          className="btn3d ghost"
          disabled={s.gems < FREEZE_PRICE || s.freezes >= 2}
          onClick={() => {
            const next = buyFreeze(s);
            if (next) {
              setState(() => next);
              toast("Gel de série acheté");
            }
          }}
        >
          <span className="row" style={{ justifyContent: "center", gap: 6 }}>
            Acheter un gel · {FREEZE_PRICE} <Gem width={20} height={20} />
          </span>
        </button>
      </div>

      <h3>Trophées</h3>
      <div className="achievements">
        {Object.entries(ACHIEVEMENTS).map(([k, a]) => (
          <div className={`ach${s.achievements[k] ? " on" : ""}`} key={k}>
            <Trophy />
            <b>{a.title}</b>
            <small className="muted">{a.desc}</small>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 6 }}>Réglages</h3>
        <div className="switch">
          <span>Temps par jour</span>
          <div className="seg">
            {([10, 20, 30] as const).map(m => (
              <button key={m} aria-pressed={s.profile.minutes === m} onClick={() => setState(x => ({ ...x, profile: { ...x.profile, minutes: m } }))}>
                {m} min
              </button>
            ))}
          </div>
        </div>
        <div className="switch">
          <span>Sons et vibrations</span>
          <div className="seg">
            <button aria-pressed={s.sound} onClick={() => setState(x => ({ ...x, sound: true }))}>Oui</button>
            <button aria-pressed={!s.sound} onClick={() => setState(x => ({ ...x, sound: false }))}>Non</button>
          </div>
        </div>
        <div className="switch" style={{ display: "grid", gap: 8 }}>
          {confirmReset ? (
            <>
              <span>Effacer toute ta progression ? C'est définitif.</span>
              <div className="row">
                <button className="btn3d coral" style={{ flex: 1 }} onClick={() => { replaceState(initialState()); setConfirmReset(false); }}>Effacer</button>
                <button className="btn3d ghost" style={{ flex: 1 }} onClick={() => setConfirmReset(false)}>Annuler</button>
              </div>
            </>
          ) : (
            <button className="btn3d ghost" onClick={() => setConfirmReset(true)}>Recommencer à zéro</button>
          )}
        </div>
      </div>

      <CloudCard session={session} toast={toast} />
    </div>
  );
}

function CloudCard({ session, toast }: { session: Session | null; toast: (m: string) => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => setSent(false), [session]);

  if (!syncEnabled) {
    return (
      <div className="card" style={{ display: "grid", gap: 6 }}>
        <h3>Sauvegarde</h3>
        <p className="muted">Ta progression est enregistrée sur ce téléphone. La sauvegarde en ligne (Supabase gratuit) s'active dans la configuration de l'app.</p>
      </div>
    );
  }
  return (
    <div className="card" style={{ display: "grid", gap: 10 }}>
      <h3>Sauvegarde en ligne</h3>
      {session ? (
        <>
          <p className="muted">Connecté : {session.user.email}. Ta progression est sauvegardée automatiquement.</p>
          <button className="btn3d ghost" onClick={() => void signOut()}>Se déconnecter</button>
        </>
      ) : sent ? (
        <p className="muted">Lien envoyé à {email}. Ouvre-le sur ce téléphone pour te connecter.</p>
      ) : (
        <form
          style={{ display: "grid", gap: 10 }}
          onSubmit={async e => {
            e.preventDefault();
            setBusy(true);
            try {
              await sendMagicLink(email.trim());
              setSent(true);
            } catch {
              toast("Envoi impossible. Vérifie l'adresse et ta connexion.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <p className="muted">Reçois un lien de connexion par e-mail pour ne jamais perdre ta progression.</p>
          <input id="email" type="email" required placeholder="ton@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          <button className="btn3d" disabled={busy}>Recevoir le lien</button>
        </form>
      )}
    </div>
  );
}
