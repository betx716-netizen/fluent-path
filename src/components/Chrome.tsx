import { sectionsOf } from "../data/units";
import { sectionOpen } from "../lib/game";
import { useStore } from "../lib/store";
import { today } from "../lib/day";
import { Flame, Gem, Heart, NavLeague, NavLearn, NavProfile, NavSounds, NavTalk } from "./Icons";
import { LIVES } from "../lib/game";

// « review » et « accent » sont des sous-écrans (Accueil et Sons).
export type Tab = "learn" | "talk" | "sounds" | "league" | "profile" | "review" | "accent";
const PARENT: Partial<Record<Tab, Tab>> = { review: "learn", accent: "sounds" };

export function TopBar() {
  const s = useStore(x => x);
  const list = sectionsOf(s.track).filter(sec => sec.units.length > 0);
  const current = [...list].reverse().find(sec => sectionOpen(s, sec)) ?? list[0];
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
      <span className="stat heart" title="Vies">
        <Heart /> {LIVES}
      </span>
    </header>
  );
}

const TABS: [Tab, string, typeof NavLearn][] = [
  ["learn", "Accueil", NavLearn],
  ["talk", "Parler", NavTalk],
  ["sounds", "Sons", NavSounds],
  ["league", "Ligue", NavLeague],
  ["profile", "Profil", NavProfile]
];

export function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const active = PARENT[tab] ?? tab;
  return (
    <nav className="bottomnav" aria-label="Navigation principale">
      {TABS.map(([id, label, Icon]) => (
        <button key={id} aria-current={active === id ? "page" : undefined} onClick={() => onTab(id)}>
          <span className="navicon">
            <Icon />
          </span>
          {label}
        </button>
      ))}
    </nav>
  );
}
