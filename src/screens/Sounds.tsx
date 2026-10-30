import { useState } from "react";
import { GROUPS, MASTERED, SOUNDS, UNLOCK_SCORE, soundOfWeek, soundOpen, type Sound, type SoundGroup } from "../data/sounds";
import { Lock, NavAccent, Speaker } from "../components/Icons";
import { SpeechTry } from "../components/SpeechTry";
import { Zazou } from "../components/Zazou";
import { canListen } from "../lib/listen";
import { speak } from "../lib/speech";
import { today, weekOf } from "../lib/day";
import { setState, useStore } from "../lib/store";

export function Mastery({ value }: { value: number }) {
  return (
    <span className={`mastery${value >= MASTERED ? " ok" : value > 0 ? " mid" : ""}`} aria-label={`Maîtrise ${value}/100`}>
      <i style={{ width: `${value}%` }} />
    </span>
  );
}

export function Sounds({ onAccents }: { onAccents: () => void }) {
  const mastery = useStore(s => s.sounds);
  const [group, setGroup] = useState<SoundGroup>("pieges");
  const [open, setOpen] = useState<Sound | null>(null);
  const week = soundOfWeek(weekOf(today()));
  const list = SOUNDS.filter(x => x.group === group);

  return (
    <div className="screen">
      <h1 style={{ fontSize: "1.5rem" }}>Sons</h1>

      <button className="week-sound" onClick={() => setOpen(week)}>
        <span className="ws-symbol ipa">/{week.ipa}/</span>
        <span className="ws-body">
          <small>Son de la semaine</small>
          <b>{week.word}</b>
          <span className="small">{week.tip}</span>
          <Mastery value={mastery[week.id] ?? 0} />
        </span>
      </button>

      <div className="seg wide" role="tablist" aria-label="Familles de sons">
        {GROUPS.map(([g, label]) => (
          <button key={g} role="tab" aria-pressed={group === g} onClick={() => setGroup(g)}>{label}</button>
        ))}
      </div>

      <div className="sound-grid">
        {list.map(snd => {
          const ok = soundOpen(mastery, snd) || snd.id === week.id;
          const v = mastery[snd.id] ?? 0;
          return (
            <button key={snd.id} className={`sound-cell${ok ? "" : " locked"}`} disabled={!ok} onClick={() => setOpen(snd)}>
              <span className="ipa sym">{snd.ipa}</span>
              <span className="ex">{snd.word}</span>
              {ok ? <Mastery value={v} /> : <Lock width={18} height={18} />}
            </button>
          );
        })}
      </div>
      <p className="muted small">Un son se débloque quand le précédent atteint {UNLOCK_SCORE}/100. Barre verte : maîtrisé ({MASTERED} et plus).</p>

      <button className="card row accent-link" onClick={onAccents}>
        <NavAccent width={36} height={36} style={{ color: "var(--blue)" }} />
        <span style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
          <b>Studio des accents</b>
          <br />
          <small className="muted">Nigérian, ghanéen, britannique, américain… Paires minimales et dictées.</small>
        </span>
      </button>

      {open && <SoundSheet sound={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function SoundSheet({ sound, onClose }: { sound: Sound; onClose: () => void }) {
  const best = useStore(s => s.sounds[sound.id] ?? 0);
  const words = [sound.word, ...sound.practice];
  const [k, setK] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const word = words[k];

  const record = (score: number) => {
    const list = [...scores];
    list[k] = Math.max(list[k] ?? 0, score);
    setScores(list);
    // Maîtrise = moyenne des mots déjà dits, on garde la meilleure.
    const avg = Math.round(list.reduce((a, b) => a + (b ?? 0), 0) / words.length);
    if (avg > best) setState(s => ({ ...s, sounds: { ...s.sounds, [sound.id]: avg } }));
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet sound-sheet" role="dialog" aria-modal="true" aria-label={`Son ${sound.ipa}`}>
        <div className="row" style={{ gap: 14 }}>
          <span className="ws-symbol ipa">/{sound.ipa}/</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b>{sound.word}</b>
            <Mastery value={best} />
          </div>
          <Zazou mood="happy" size={56} />
        </div>
        <p className="small">{sound.tip}</p>
        <div className="sound-words">
          {words.map((w, i) => (
            <button key={w} className={`chip${i === k ? " on" : ""}`} onClick={() => { setK(i); void speak(w, { rate: 0.8 }); }}>
              <Speaker width={16} height={16} /> {w}
              {scores[i] != null && <small> {scores[i]}</small>}
            </button>
          ))}
        </div>
        {canListen() ? (
          <SpeechTry key={word} text={word} pass={UNLOCK_SCORE} onResult={r => record(r.score)} />
        ) : (
          <p className="notice">Le micro n'est pas disponible ici : écoute les mots et répète-les à voix haute.</p>
        )}
        <div className="row">
          <button className="btn3d ghost" style={{ flex: 1 }} onClick={onClose}>Fermer</button>
          <button className="btn3d" style={{ flex: 1 }} disabled={k >= words.length - 1} onClick={() => { setK(k + 1); void speak(words[k + 1], { rate: 0.8 }); }}>Mot suivant</button>
        </div>
      </div>
    </>
  );
}
