import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Section, Unit } from "./data/types";
import { BottomNav, TopBar, type Tab } from "./components/Chrome";
import { Chest, Gem } from "./components/Icons";
import { Zazou } from "./components/Zazou";
import { GEMS_PER_CHEST, finishLesson, openChest, type LessonResult, type Reward } from "./lib/game";
import { getState, setState, useStore } from "./lib/store";
import { sfx } from "./lib/sfx";
import { logSession, startSync } from "./lib/sync";
import { ComingSoon } from "./screens/ComingSoon";
import { Lesson } from "./screens/Lesson";
import { Onboarding } from "./screens/Onboarding";
import { PathMap } from "./screens/PathMap";
import { Profile } from "./screens/Profile";
import { Victory } from "./screens/Victory";

type View =
  | { kind: "tabs" }
  | { kind: "lesson"; unit: Unit }
  | { kind: "victory"; reward: Reward; seconds: number };

export default function App() {
  const onboarded = useStore(s => s.profile.onboarded);
  const [tab, setTab] = useState<Tab>("learn");
  const [view, setView] = useState<View>({ kind: "tabs" });
  const [chest, setChest] = useState<Section | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => startSync(setSession), []);
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2400);
    return () => clearTimeout(t);
  }, [toastMsg]);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view.kind, tab]);

  if (!onboarded) return <div className="app"><Onboarding /></div>;

  const done = (r: LessonResult) => {
    const { next, reward } = finishLesson(getState(), r);
    setState(() => next);
    void logSession(r.unit.id, r.seconds, reward.xp);
    setView({ kind: "victory", reward, seconds: r.seconds });
  };

  if (view.kind === "lesson") {
    return (
      <div className="app">
        <Lesson unit={view.unit} onExit={() => setView({ kind: "tabs" })} onDone={done} />
      </div>
    );
  }
  if (view.kind === "victory") {
    return (
      <div className="app">
        <Victory reward={view.reward} seconds={view.seconds} onContinue={() => setView({ kind: "tabs" })} />
      </div>
    );
  }

  return (
    <div className="app">
      <TopBar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {tab === "learn" && <PathMap onStart={unit => setView({ kind: "lesson", unit })} onChest={setChest} />}
        {tab === "review" && <ComingSoon kind="review" />}
        {tab === "talk" && <ComingSoon kind="talk" />}
        {tab === "accent" && <ComingSoon kind="accent" />}
        {tab === "profile" && <Profile session={session} toast={setToastMsg} />}
      </main>
      <BottomNav tab={tab} onTab={setTab} />

      {chest && <ChestSheet onClose={() => setChest(null)} onOpen={() => setState(s => openChest(s, chest))} />}
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
    </div>
  );
}

function ChestSheet({ onOpen, onClose }: { onOpen: () => void; onClose: () => void }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <div className="sheet-backdrop" onClick={opened ? onClose : undefined} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Coffre" style={{ justifyItems: "center", textAlign: "center" }}>
        {opened ? <Zazou mood="cheer" size={120} /> : <Chest width={120} height={120} className="shake" />}
        <h2>{opened ? "Trésor trouvé !" : "Un coffre t'attend"}</h2>
        {opened && (
          <p className="row" style={{ justifyContent: "center", fontFamily: "var(--f-display)", fontWeight: 800, fontSize: "1.4rem" }}>
            +{GEMS_PER_CHEST} <Gem width={28} height={28} />
          </p>
        )}
        <button
          className="btn3d sun"
          onClick={() => {
            if (opened) return onClose();
            sfx.chest();
            onOpen();
            setOpened(true);
          }}
        >
          {opened ? "Super" : "Ouvrir"}
        </button>
      </div>
    </>
  );
}
