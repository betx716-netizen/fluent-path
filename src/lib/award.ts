import { ACHIEVEMENTS, addActivity, withAchievements } from "./game";
import { getState, setState, type State } from "./store";

// Applique un changement d'état, ajoute les XP (série, objectif du jour)
// et renvoie les noms des trophées débloqués.
export function award(change: (s: State) => State, xp: number, seconds = 0): string[] {
  const before = getState();
  const changed = change(before);
  const next = xp > 0 || seconds > 0 ? addActivity(changed, xp, seconds).next : changed;
  const res = withAchievements(before, next);
  setState(() => res.next);
  return res.unlocked.map(k => ACHIEVEMENTS[k].title);
}
