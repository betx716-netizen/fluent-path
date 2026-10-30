import { Zazou } from "../components/Zazou";

const TEXT = {
  review: ["Révisions", "Tes mots reviendront juste avant que tu les oublies, avec l'audio.", "Phase 2"],
  talk: ["Parler avec Zazou", "Des jeux de rôle à l'oral : client nigérian, agent maritime, fournisseur… Tu parles au micro, Zazou te répond et corrige.", "Phase 2"],
  accent: ["Studio des accents", "Une même phrase en accent américain, britannique, nigérian, ghanéen… avec le shadowing et la dictée.", "Phase 3"]
} as const;

export function ComingSoon({ kind }: { kind: keyof typeof TEXT }) {
  const [title, desc, phase] = TEXT[kind];
  return (
    <div className="screen" style={{ justifyItems: "center", textAlign: "center", paddingTop: 48 }}>
      <Zazou mood="sleep" size={150} />
      <span className="tag">{phase}</span>
      <h1 style={{ fontSize: "1.7rem" }}>{title}</h1>
      <p className="muted" style={{ maxWidth: 360 }}>{desc}</p>
      <p className="muted" style={{ maxWidth: 360 }}>En attendant, continue ton parcours dans l'onglet Apprendre.</p>
    </div>
  );
}
