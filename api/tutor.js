// Fonction serveur Vercel (offre gratuite) : transmet la conversation à Gemini
// sans exposer la clé. Variables à définir sur Vercel :
//   GEMINI_API_KEY  (obligatoire) — clé gratuite créée sur aistudio.google.com
//   GEMINI_MODEL    (facultatif)  — par défaut gemini-2.5-flash
//   APP_PASSCODE    (conseillé)   — code à recopier dans Profil → Tuteur IA,
//                                   pour que personne d'autre n'use ton quota
export const config = { runtime: "edge" };

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async function handler(req) {
  const key = process.env.GEMINI_API_KEY;
  if (req.method === "GET") return json(key ? 200 : 503, { ok: !!key });
  if (req.method !== "POST") return json(405, { error: "method" });
  if (!key) return json(503, { error: "GEMINI_API_KEY manquante" });

  const passcode = process.env.APP_PASSCODE;
  if (passcode && req.headers.get("x-passcode") !== passcode) return json(401, { error: "code d'accès" });

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "json" });
  }
  const { system, turns } = body ?? {};
  if (typeof system !== "string" || !Array.isArray(turns) || turns.length > 40 || system.length > 8000) {
    return json(400, { error: "format" });
  }

  const contents = [];
  for (const t of turns) {
    const role = t?.role === "model" ? "model" : "user";
    const text = String(t?.text ?? "").slice(0, 4000);
    const last = contents[contents.length - 1];
    if (last && last.role === role) last.parts[0].text += "\n" + text;
    else contents.push({ role, parts: [{ text }] });
  }
  if (contents[0]?.role === "model") contents.unshift({ role: "user", parts: [{ text: "(The conversation starts.)" }] });
  if (!contents.length || contents[contents.length - 1].role !== "user") contents.push({ role: "user", parts: [{ text: "(continue)" }] });

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
    })
  });
  return new Response(await r.text(), { status: r.status, headers: { "Content-Type": "application/json" } });
}
