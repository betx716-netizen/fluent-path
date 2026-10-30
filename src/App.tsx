import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Section, Unit } from "./data/types";
import type { Scenario } from "./data/scenarios";
import { syncUnitCards } from "./lib/review";
import { scenarioFromLesson } from "./data/general";
import { ReviewTab } from "./screens/Review";
import { Accents } from "./screens/Accents";
import { Roleplay, type RoleplayOutcome } from "./screens/Roleplay";
import { RoleplayReport } from "./screens/RoleplayReport";
import { Talk } from "./screens/Talk";
import { BottomNav, TopBar, type Tab } from "./components/Chrome";
import { Chest, Gem } from "./components/Icons";
import { Zazou } from "./components/Zazou";
import { GEMS_PER_CHEST, buildTest, finishLesson, finishTest, openChest, type LessonResult, type Reward, type TestOutcome } from "./lib/game";
import { TestResult } from "./screens/TestResult";
import { getState, setState, useStore } from "./lib/store";
import { sfx } from "./lib/sfx";
import { logSession, startSync } from "./lib/sync";
import { Lesson } from "./screens/Lesson";
import { Onboarding } from "./screens/Onboarding";
import { PathMap } from "./screens/PathMap";
import { Profile } from "./screens/Profile";
import { Victory } from "./screens/Victory";

type View =
  | { kind: "tabs" }
  | { kind: "roleplay"; sc: Scenario }
  | { kind: "report"; sc: Scenario; outcome: RoleplayOutcome }
  | { kind: "lesson"; unit: Unit }
  | { kind: "victory"; reward: Reward; seconds: number; unit: Unit }
  | { kind: "test"; section: Section; unit: Unit }
  | { kind: "testResult"; section: Section; outcome: TestOutcome };

export default function App() {
  const onboarded = useStore(s => s.profile.onboarded);
  const [tab, setTab] = useState<Tab>("learn");
  const [view, setView] = useState<View>({ kind: "tabs" });
  const [chest, setChest] = useState<Section | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => startSync(setSession), []);
  // Les mots des unités déjà validées entrent dans les révisions.
  useEffect(() => {
    const s = getState();
    const next = syncUnitCards(s);
    if (next !== s) setState(() => next);
  }, []);
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
    setState(() => syncUnitCards(next));
    void logSession(r.unit.id, r.seconds, reward.xp);
    setView({ kind: "victory", reward, seconds: r.seconds, unit: r.unit });
  };

  if (view.kind === "lesson") {
    return (
      <div className="app">
        <Lesson unit={view.unit} onExit={() => setView({ kind: "tabs" })} onDone={done} />
      </div>
    );
  }
  const startTest = (section: Section) => setView({ kind: "test", section, unit: buildTest(section) });
  if (view.kind === "test") {
    return (
      <div className="app">
        <Lesson
          test
          unit={view.unit}
          onExit={() => setView({ kind: "tabs" })}
          onDone={r => {
            const { next, outcome } = finishTest(getState(), view.section, r.firstTry, r.total, r.seconds);
            setState(() => syncUnitCards(next));
            setView({ kind: "testResult", section: view.section, outcome });
          }}
        />
      </div>
    );
  }
  if (view.kind === "testResult") {
    return (
      <div className="app">
        <TestResult section={view.section} outcome={view.outcome} onRetry={() => startTest(view.section)} onDone={() => setView({ kind: "tabs" })} />
      </div>
    );
  }
  if (view.kind === "roleplay") {
    return (
      <div className="app">
        <Roleplay
          sc={view.sc}
          onExit={() => setView({ kind: "tabs" })}
          onFinish={outcome => setView({ kind: "report", sc: view.sc, outcome })}
        />
      </div>
    );
  }
  if (view.kind === "report") {
    return (
      <div className="app">
        <RoleplayReport sc={view.sc} outcome={view.outcome} onDone={() => setView({ kind: "tabs" })} />
      </div>
    );
  }
  if (view.kind === "victory") {
    return (
      <div className="app">
        <Victory
          reward={view.reward}
          seconds={view.seconds}
          next={view.unit.roleplay ? "Passer à la conversation" : undefined}
          onContinue={() => {
            // Leçon « Conversation » : les exercices finis, on enchaîne sur le jeu de rôle.
            const sc = scenarioFromLesson(view.unit);
            setView(sc ? { kind: "roleplay", sc } : { kind: "tabs" });
          }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <TopBar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {tab === "learn" && <PathMap onStart={unit => setView({ kind: "lesson", unit })} onChest={setChest} onTest={startTest} />}
        {tab === "review" && <ReviewTab toast={setToastMsg} />}
        {tab === "talk" && <Talk onStart={sc => setView({ kind: "roleplay", sc })} />}
        {tab === "accent" && <Accents toast={setToastMsg} />}
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
