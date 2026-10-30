import { createClient, type SupabaseClient, type Session } from "@supabase/supabase-js";
import { getState, replaceState, subscribe, type State } from "./store";

// Sauvegarde en ligne facultative (Supabase, offre gratuite).
// Sans VITE_SUPABASE_URL, l'app fonctionne entièrement sur le téléphone.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
export const syncEnabled = !!supabase;

export async function sendMagicLink(email: string) {
  if (!supabase) throw new Error("Sauvegarde en ligne non configurée.");
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
  if (error) throw error;
}

export async function signOut() {
  await supabase?.auth.signOut();
}

async function push(session: Session, s: State) {
  if (!supabase) return;
  const user_id = session.user.id;
  await supabase.from("profiles").upsert({
    id: user_id,
    display_name: s.profile.name,
    goal: s.profile.goal,
    daily_minutes: s.profile.minutes,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  await supabase.from("gamification").upsert({
    user_id,
    xp_total: s.xpTotal,
    gems: s.gems,
    streak: s.streak,
    streak_best: s.streakBest,
    last_active_day: s.lastActiveDay,
    freezes: s.freezes,
    state: s,
    updated_at: s.updatedAt
  });
  const rows = Object.entries(s.units).map(([unit_id, u]) => ({
    user_id,
    unit_id,
    stars: u.stars,
    best_score: u.best,
    plays: u.plays,
    completed_at: u.completedAt
  }));
  if (rows.length) await supabase.from("unit_progress").upsert(rows);
}

export async function logSession(unitId: string, seconds: number, xp: number) {
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  if (!data.session) return;
  const ended = new Date();
  await supabase.from("sessions").insert({
    user_id: data.session.user.id,
    kind: "lesson",
    unit_id: unitId,
    started_at: new Date(ended.getTime() - seconds * 1000).toISOString(),
    ended_at: ended.toISOString(),
    minutes: Math.max(1, Math.round(seconds / 60)),
    xp_earned: xp
  });
}

// Au premier branchement d'un appareil, on garde la version la plus récente.
async function pull(session: Session) {
  if (!supabase) return;
  const { data } = await supabase.from("gamification").select("state, updated_at").eq("user_id", session.user.id).maybeSingle();
  const remote = data?.state as State | undefined;
  if (remote && remote.updatedAt > getState().updatedAt) replaceState(remote);
}

export function startSync(onSession: (s: Session | null) => void) {
  if (!supabase) return () => {};
  let session: Session | null = null;
  let timer: number | undefined;
  supabase.auth.getSession().then(({ data }) => {
    session = data.session;
    onSession(session);
    if (session) void pull(session);
  });
  const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
    const first = !session && s;
    session = s;
    onSession(s);
    if (first && s) void pull(s);
  });
  const unsub = subscribe(() => {
    if (!session) return;
    window.clearTimeout(timer);
    const current = session;
    timer = window.setTimeout(() => void push(current, getState()).catch(() => {}), 1500);
  });
  return () => {
    sub.subscription.unsubscribe();
    unsub();
  };
}

// Connexion par code SMS (Supabase Auth, téléphone). Il faut un fournisseur SMS
// branché dans Supabase (Twilio, MessageBird…), sinon l'envoi échoue.
export async function sendSmsCode(phone: string) {
  if (!supabase) throw new Error("Connexion par SMS non configurée.");
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw error;
}

export async function verifySmsCode(phone: string, token: string) {
  if (!supabase) throw new Error("Connexion par SMS non configurée.");
  const { error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
  if (error) throw error;
}
