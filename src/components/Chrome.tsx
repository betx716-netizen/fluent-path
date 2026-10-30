import { SECTIONS } from "../data/units";
import { sectionOpen } from "../lib/game";
import { useStore } from "../lib/store";
import { today } from "../lib/day";
import { Bolt, Flame, Gem, NavAccent, NavLearn, NavProfile, NavReview, NavTalk } from "./Icons";

export type Tab = "learn" | "review" | "talk" | "accent" | "profile";

export function TopBar() {
  const s = useStore(x => x);
  const current = [...SECTIONS].reverse().find(sec => sectionOpen(s, sec)) ?? SECTIONS[0];
  const activeToday = s.lastActiveDay === today();
  return (
    <header className="topbar">
      <span className="level-chip">{current.cefr}</span>
      <span className={`stat flame${activeToday ? "" : " off"}`} title="Série de jours">
        <Flame /> {s.streak}
      </span>
      <span className="stat gem" title="Gemmes">
        <Gem /> {s.gems}
      </span>
      <span className="stat xp" title="Points d'expérience">
        <Bolt /> {s.xpTotal}
      </span>
    </header>
  );
}

const TABS: [Tab, string, typeof NavLearn][] = [
  ["learn", "Apprendre", NavLearn],
  ["review", "Réviser", NavReview],
  ["talk", "Parler", NavTalk],
  ["accent", "Accents", NavAccent],
  ["profile", "Profil", NavProfile]
];

export function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <nav className="bottomnav" aria-label="Navigation principale">
      {TABS.map(([id, label, Icon]) => (
        <button key={id} aria-current={tab === id ? "page" : undefined} onClick={() => onTab(id)}>
          <span className="navicon">
            <Icon />
          </span>
          {label}
        </button>
      ))}
    </nav>
  );
}
