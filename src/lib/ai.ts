import { getState } from "./store";

// Tuteur IA à 0 € : trois chemins possibles, choisis automatiquement.
// 1. Aperçu dans Claude : l'IA de ton compte Claude (capacité « sample »).
// 2. Clé Gemini gratuite enregistrée dans Profil → appel direct depuis le téléphone.
// 3. App en ligne sur Vercel : la fonction /api/tutor garde la clé côté serveur.

export interface Turn {
  role: "user" | "model";
  text: string;
}

export type AiMode = "claude" | "gemini-key" | "server";

export class AiError extends Error {
  constructor(public code: "no_ai" | "quota" | "busy" | "model" | "denied" | "network" | "bad_reply", message: string) {
    super(message);
  }
}

export const AI_MESSAGES: Record<AiError["code"], string> = {
  no_ai: "Le tuteur IA n'est pas configuré. Ajoute ta clé Gemini gratuite dans Profil → Tuteur IA.",
  quota: "Limite gratuite atteinte pour le moment. Réessaie dans une minute.",
  busy: "Le tuteur est très demandé en ce moment. Réessaie dans quelques secondes.",
  model: "Le modèle Gemini choisi n'existe plus. Dans Profil → Tuteur IA, mets « gemini-flash-lite-latest ».",
  denied: "Accès refusé : vérifie ta clé Gemini ou ton code d'accès dans Profil.",
  network: "Pas de connexion au tuteur. Vérifie ton Internet et réessaie.",
  bad_reply: "Réponse incomplète du tuteur. Réessaie."
};

type Sample = ((input: unknown, opts?: unknown) => Promise<{ text: string }>) & {
  json: (input: unknown, opts?: unknown) => Promise<unknown>;
};

let samplePromise: Promise<Sample | null> | null = null;
function claudeSample(): Promise<Sample | null> {
  const w = window as unknown as { claude?: { use: (n: string) => Promise<Sample | null> } };
  if (!w.claude?.use) return Promise.resolve(null);
  samplePromise ??= w.claude.use("sample").catch(() => null);
  return samplePromise;
}

export async function detectMode(): Promise<AiMode | null> {
  if (await claudeSample()) return "claude";
  if (getState().ai.geminiKey) return "gemini-key";
  if (await serverAvailable()) return "server";
  return null;
}

let serverCheck: Promise<boolean> | null = null;
function serverAvailable() {
  serverCheck ??= fetch("/api/tutor", { method: "GET" })
    .then(r => r.ok && !!r.headers.get("content-type")?.includes("json"))
    .catch(() => false);
  return serverCheck;
}

function parseJson(text: string): unknown {
  const t = text.trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
  try {
    return JSON.parse(t);
  } catch {
    const a = t.indexOf("{");
    const b = t.lastIndexOf("}");
    if (a >= 0 && b > a) return JSON.parse(t.slice(a, b + 1));
    throw new AiError("bad_reply", "JSON illisible");
  }
}

async function viaClaude(sample: Sample, system: string, turns: Turn[]) {
  const input = [
    { role: "user", content: system },
    ...turns.map(t => ({ role: t.role === "model" ? "assistant" : "user", content: t.text }))
  ];
  if (input[input.length - 1].role !== "user") input.push({ role: "user", content: "(continue)" });
  try {
    return await sample.json(input, { cache: false, modelTier: "quick" });
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code === "rate_limited") throw new AiError("quota", code);
    if (code === "not_granted" || code === "sampling_disabled") throw new AiError("denied", code);
    if (code === "invalid_json") throw new AiError("bad_reply", code);
    throw new AiError("network", code ?? "erreur");
  }
}

export function geminiBody(system: string, turns: Turn[]) {
  // Gemini veut des tours alternés qui commencent par l'utilisateur.
  const contents: { role: Turn["role"]; parts: { text: string }[] }[] = [];
  for (const t of turns) {
    const last = contents[contents.length - 1];
    if (last && last.role === t.role) last.parts[0].text += "\n" + t.text;
    else contents.push({ role: t.role, parts: [{ text: t.text }] });
  }
  if (contents[0]?.role === "model") contents.unshift({ role: "user", parts: [{ text: "(The conversation starts.)" }] });
  if (!contents.length || contents[contents.length - 1].role !== "user") {
    contents.push({ role: "user", parts: [{ text: "(continue)" }] });
  }
  return {
    systemInstruction: { parts: [{ text: system }] },
    contents,
    generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
  };
}

// Modèles rapides, du préféré au secours (Google en retire régulièrement).
export const DEFAULT_MODEL = "gemini-flash-lite-latest";
const FALLBACK_MODELS = [DEFAULT_MODEL, "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-flash-latest"];

async function viaGemini(system: string, turns: Turn[]) {
  const { geminiKey, model } = getState().ai;
  const body = JSON.stringify(geminiBody(system, turns));
  let r: Response | null = null;
  for (const m of [...new Set([model, ...FALLBACK_MODELS].filter(Boolean))]) {
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
        body
      });
    } catch {
      throw new AiError("network", "fetch");
    }
    if (![404, 429, 503].includes(r.status)) break;
  }
  return readGemini(r!);
}

async function viaServer(system: string, turns: Turn[]) {
  let r: Response;
  try {
    r = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-passcode": getState().ai.passcode },
      body: JSON.stringify({ system, turns })
    });
  } catch {
    throw new AiError("network", "fetch");
  }
  return readGemini(r);
}

async function readGemini(r: Response) {
  if (r.status === 429) throw new AiError("quota", "429");
  if (r.status === 503) throw new AiError("busy", "503");
  if (r.status === 404) throw new AiError("model", "404");
  if (r.status === 401 || r.status === 403 || r.status === 400) throw new AiError("denied", String(r.status));
  if (!r.ok) throw new AiError("network", String(r.status));
  const data = await r.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
  if (!text) throw new AiError("bad_reply", "vide");
  return parseJson(text);
}

export async function askJson<T>(system: string, turns: Turn[]): Promise<T> {
  const sample = await claudeSample();
  if (sample) return (await viaClaude(sample, system, turns)) as T;
  if (getState().ai.geminiKey) return (await viaGemini(system, turns)) as T;
  if (await serverAvailable()) return (await viaServer(system, turns)) as T;
  throw new AiError("no_ai", "aucun fournisseur");
}
