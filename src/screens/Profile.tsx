import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { allUnits } from "../data/units";
import { Bolt, Book, Clock, Flame, Gem, Mic, NavTalk, Snow, Trophy } from "../components/Icons";
import { detectMode, type AiMode } from "../lib/ai";
import { OUTFITS, Zazou } from "../components/Zazou";
import { award } from "../lib/award";
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
        <div className="stat-card"><Mic style={{ color: "var(--mint)" }} /><div><b>{s.speechScores.length ? Math.round(s.speechScores.reduce((a, b) => a + b, 0) / s.speechScores.length) : "–"}</b><small>prononciation /100</small></div></div>
        <div className="stat-card"><NavTalk style={{ color: "var(--indigo)" }} /><div><b>{Object.keys(s.roleplays).length}</b><small>jeux de rôle faits</small></div></div>
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

      <Shop toast={toast} />

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

      <AiCard toast={toast} />
      <ReportsCard toast={toast} />
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

const MODE_LABEL: Record<AiMode, string> = {
  claude: "Actif : IA de ton compte Claude (aperçu)",
  "gemini-key": "Actif : Gemini, avec ta clé gratuite",
  server: "Actif : serveur de l'app (Vercel)"
};

function AiCard({ toast }: { toast: (m: string) => void }) {
  const ai = useStore(x => x.ai);
  const [mode, setMode] = useState<AiMode | null | undefined>(undefined);
  const [key, setKey] = useState(ai.geminiKey);
  const [passcode, setPasscode] = useState(ai.passcode);
  const [model, setModel] = useState(ai.model);
  useEffect(() => {
    void detectMode().then(setMode);
  }, [ai]);

  return (
    <div className="card" style={{ display: "grid", gap: 10 }}>
      <h3>Tuteur IA</h3>
      <p className={mode ? "notice info" : "notice"}>
        {mode === undefined ? "Recherche du tuteur…" : mode ? MODE_LABEL[mode] : "Aucun tuteur configuré : les jeux de rôle ne marcheront pas."}
      </p>
      <p className="muted small">
        Gratuit : crée une clé sur aistudio.google.com (menu « Get API key »), sans carte bancaire, puis colle-la ici. Elle reste sur ce téléphone. Évite d'écrire des informations confidentielles : sur l'offre gratuite, Google peut utiliser les échanges.
      </p>
      <form
        style={{ display: "grid", gap: 10 }}
        onSubmit={e => {
          e.preventDefault();
          setState(x => ({ ...x, ai: { geminiKey: key.trim(), passcode: passcode.trim(), model: model.trim() || "gemini-flash-lite-latest" } }));
          toast("Réglages du tuteur enregistrés");
        }}
      >
        <label className="field" htmlFor="gemini-key">Clé Gemini (facultative si l'app est sur Vercel)
          <input id="gemini-key" type="password" autoComplete="off" value={key} onChange={e => setKey(e.target.value)} placeholder="AIza…" />
        </label>
        <label className="field" htmlFor="passcode">Code d'accès du serveur (si tu en as défini un)
          <input id="passcode" type="password" autoComplete="off" value={passcode} onChange={e => setPasscode(e.target.value)} />
        </label>
        <label className="field" htmlFor="model">Modèle Gemini
          <input id="model" type="text" value={model} onChange={e => setModel(e.target.value)} />
        </label>
        <button className="btn3d">Enregistrer</button>
      </form>
    </div>
  );
}

function Shop({ toast }: { toast: (m: string) => void }) {
  const gems = useStore(x => x.gems);
  const outfits = useStore(x => x.outfits);
  const [preview, setPreview] = useState<string | null>(outfits.worn);
  const item = OUTFITS.find(o => o.id === preview);
  const owned = !!item && outfits.owned.includes(item.id);

  const buy = () => {
    if (!item || owned || gems < item.price) return;
    const trophies = award(
      x => ({ ...x, gems: x.gems - item.price, outfits: { owned: [...x.outfits.owned, item.id], worn: item.id } }),
      0
    );
    toast(`${item.name} achetée !`);
    trophies.forEach(t => toast(`Trophée : ${t}`));
  };
  const wear = (id: string | null) => setState(x => ({ ...x, outfits: { ...x.outfits, worn: id } }));

  return (
    <div className="card shop" style={{ display: "grid", gap: 12 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3>Garde-robe de Zazou</h3>
        <span className="stat gem"><Gem /> {gems}</span>
      </div>
      <div className="shop-stage">
        <Zazou mood="cheer" size={130} outfit={preview} />
      </div>
      <div className="shop-items">
        <button className={`shop-item${preview === null ? " sel" : ""}`} onClick={() => setPreview(null)}>
          <b>Sans tenue</b>
          <small className="muted">{outfits.worn === null ? "Porté" : "Gratuit"}</small>
        </button>
        {OUTFITS.map(o => (
          <button key={o.id} className={`shop-item${preview === o.id ? " sel" : ""}`} onClick={() => setPreview(o.id)}>
            <b>{o.name}</b>
            <small className="muted row" style={{ gap: 4, justifyContent: "center" }}>
              {outfits.worn === o.id ? "Porté" : outfits.owned.includes(o.id) ? "À toi" : <>{o.price} <Gem width={14} height={14} /></>}
            </small>
          </button>
        ))}
      </div>
      {preview === null ? (
        <button className="btn3d ghost" disabled={outfits.worn === null} onClick={() => wear(null)}>Retirer la tenue</button>
      ) : owned ? (
        <button className="btn3d" disabled={outfits.worn === preview} onClick={() => wear(preview)}>
          {outfits.worn === preview ? "Déjà portée" : "Mettre cette tenue"}
        </button>
      ) : (
        <button className="btn3d sun" disabled={!item || gems < item.price} onClick={buy}>
          {item && gems < item.price ? `Encore ${item.price - gems} gemmes` : `Acheter pour ${item?.price} gemmes`}
        </button>
      )}
    </div>
  );
}

function ReportsCard({ toast }: { toast: (m: string) => void }) {
  const reports = useStore(x => x.reports);
  if (!reports.length) return null;
  const text = reports.map(r => `[${r.unit}] ${r.text}`).join("\n");
  return (
    <div className="card" style={{ display: "grid", gap: 8 }}>
      <h3>Erreurs signalées ({reports.length})</h3>
      <p className="muted small">Copie cette liste et envoie-la à Claude pour corriger les exercices.</p>
      <pre className="report-list">{text}</pre>
      <div className="row">
        <button
          className="btn3d"
          style={{ flex: 1 }}
          onClick={() => {
            navigator.clipboard?.writeText(text).then(() => toast("Liste copiée"), () => toast("Copie impossible : sélectionne le texte à la main"));
          }}
        >
          Copier la liste
        </button>
        <button className="btn3d ghost" style={{ flex: 1 }} onClick={() => setState(x => ({ ...x, reports: [] }))}>Vider</button>
      </div>
    </div>
  );
}
