import { useState } from "react";
import { CARDS_PER_QUIZ, TOPICS, type GrammarTopic } from "../data/grammar";
import type { Unit } from "../data/types";
import { Book, Check, Speaker } from "../components/Icons";
import { Zazou } from "../components/Zazou";
import { buildQuiz, emptyProgress, progressOf, quizReady } from "../lib/grammar";
import { speak } from "../lib/speech";
import { setState, useStore } from "../lib/store";

// Le thème ouvert est gardé par App, pour y revenir après le mini-exercice.
export function Grammar({ onQuiz, topicId, onTopic }: { onQuiz: (u: Unit) => void; topicId: string | null; onTopic: (id: string | null) => void }) {
  const open = TOPICS.find(t => t.id === topicId) ?? null;
  const setOpen = (t: GrammarTopic | null) => onTopic(t?.id ?? null);
  const s = useStore(x => x);
  if (open) return <TopicView topic={open} onQuiz={onQuiz} />;

  return (
    <div className="screen">
      <div className="row" style={{ gap: 12, flexWrap: "nowrap" }}>
        <Zazou mood="think" size={72} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: "1.5rem" }}>Grammaire</h1>
          <p className="muted small">Révise {CARDS_PER_QUIZ} cartes, puis un mini-exercice vérifie que tu as compris et que tu sais prononcer.</p>
        </div>
      </div>
      {TOPICS.map(t => {
        const p = progressOf(s, t.id);
        const seen = Math.min(t.items.length, p.passed * CARDS_PER_QUIZ + p.since);
        return (
          <button key={t.id} className={`topic-card ${t.color}`} onClick={() => setOpen(t)}>
            <span className="goal-icon"><Book /></span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <b>{t.title}</b>
              <small>{t.intro}</small>
              <span className="mastery ok"><i style={{ width: `${(seen / t.items.length) * 100}%` }} /></span>
              <small>
                {quizReady(p) ? "Mini-exercice à faire" : `${p.since}/${CARDS_PER_QUIZ} cartes avant le mini-exercice`} · {p.passed} réussi{p.passed > 1 ? "s" : ""}
              </small>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TopicView({ topic, onQuiz }: { topic: GrammarTopic; onQuiz: (u: Unit) => void }) {
  // On sélectionne l'objet stocké (stable) puis on complète : sinon la page boucle.
  const saved = useStore(s => s.grammar[topic.id]);
  const p = saved ?? emptyProgress();
  const [showRules, setShowRules] = useState(p.quizzes === 0 && p.since === 0);
  const card = topic.items[p.cursor % topic.items.length];
  const ready = quizReady(p);

  const next = () =>
    setState(s => {
      const cur = progressOf(s, topic.id);
      return { ...s, grammar: { ...s.grammar, [topic.id]: { ...cur, cursor: (cur.cursor + 1) % topic.items.length, since: cur.since + 1 } } };
    });

  return (
    <div className="screen">
      <h1 style={{ fontSize: "1.5rem" }}>{topic.title}</h1>

      <div className="card intro-card">
        <button className="row linkbtn" style={{ justifyContent: "space-between", width: "100%" }} onClick={() => setShowRules(!showRules)}>
          <h3>À retenir</h3>
          <span>{showRules ? "Masquer" : "Afficher"}</span>
        </button>
        {showRules && <ul>{topic.rules.map(r => <li key={r}>{r}</li>)}</ul>}
      </div>

      <div className="review-steps" aria-label={`${Math.min(p.since, CARDS_PER_QUIZ)} cartes sur ${CARDS_PER_QUIZ}`}>
        {Array.from({ length: CARDS_PER_QUIZ }, (_, i) => <i key={i} className={i < p.since ? "on" : ""} />)}
      </div>

      {ready ? (
        <div className="card quiz-call">
          <Zazou mood="cheer" size={110} />
          <h2>Mini-exercice</h2>
          <p className="muted">Tu as révisé {CARDS_PER_QUIZ} cartes. 6 questions : 4 pour vérifier que tu as compris, 2 à dire au micro pour ta prononciation. Il faut 70 % pour passer aux cartes suivantes.</p>
          {p.quizzes > p.passed && <p className="notice">Le dernier essai n'était pas suffisant : réessaie.</p>}
          <button className="btn3d" onClick={() => onQuiz(buildQuiz(topic, p))}>Commencer le mini-exercice</button>
        </div>
      ) : (
        <div className="card gram-card">
          <div className="row" style={{ flexWrap: "nowrap", gap: 12 }}>
            <button className="speak-btn" aria-label={`Écouter ${card.en}`} onClick={() => void speak(card.en, { rate: 0.8 })}>
              <Speaker />
            </button>
            <div style={{ minWidth: 0 }}>
              <b className="gram-word">{card.en}</b>
              <p className="muted">se dit « {card.say} » · {card.fr}</p>
            </div>
          </div>
          <div className="gram-ex">
            <button className="speak-mini" aria-label="Écouter l'exemple" onClick={() => void speak(card.ex, { rate: 0.85 })}>
              <Speaker />
            </button>
            <div>
              <b>{card.ex}</b>
              <p className="muted small">{card.exFr}</p>
            </div>
          </div>
          {card.note && <p className="notice info">{card.note}</p>}
          <button className="btn3d" onClick={next}>
            {p.since + 1 >= CARDS_PER_QUIZ ? "Terminer les révisions" : "Carte suivante"}
          </button>
        </div>
      )}
      <p className="muted small row" style={{ gap: 6 }}><Check width={16} height={16} /> {p.passed} mini-exercice{p.passed > 1 ? "s" : ""} réussi{p.passed > 1 ? "s" : ""} sur ce thème.</p>
    </div>
  );
}
