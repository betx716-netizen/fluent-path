import { useId } from "react";
import { useStore } from "../lib/store";

// Zazou, l'ara bleu et or de Fluent Path. Dessin SVG d'après le logo, animé en CSS.
export type Mood = "happy" | "cheer" | "think" | "sad" | "sleep" | "wave";

export const OUTFITS: { id: string; name: string; price: number }[] = [
  { id: "cap", name: "Casquette", price: 100 },
  { id: "tie", name: "Cravate de pro", price: 150 },
  { id: "kente", name: "Écharpe kente", price: 200 },
  { id: "glasses", name: "Lunettes de soleil", price: 300 },
  { id: "crown", name: "Couronne", price: 500 }
];

export function Zazou({ mood = "happy", size = 120, outfit }: { mood?: Mood; size?: number; outfit?: string | null }) {
  const worn = useStore(s => s.outfits.worn);
  const wear = outfit === undefined ? worn : outfit;
  const closed = mood === "happy" || mood === "cheer" || mood === "sleep";
  const wingUp = mood === "cheer";
  const id = useId().replace(/:/g, "");
  const belly = `zb-${id}`;
  const blue = `zw-${id}`;
  return (
    <svg className={`zazou zazou-${mood}`} width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Zazou l'ara">
      <defs>
        <linearGradient id={belly} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc928" />
          <stop offset="1" stopColor="#ff9a12" />
        </linearGradient>
        <linearGradient id={blue} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2aa7f0" />
          <stop offset="1" stopColor="#1462c8" />
        </linearGradient>
      </defs>
      <ellipse cx="62" cy="114" rx="28" ry="4.5" fill="var(--shadow-soft)" />
      <g className="zazou-body">
        {/* queue : longues plumes bleues, dessous jaune */}
        <path d="M44 86 L10 116 L18 117 L50 94 Z" fill="#e0b41a" />
        <path d="M46 82 L6 110 L12 114 L52 90 Z" fill={`url(#${blue})`} />
        <path d="M48 88 L16 118 L24 118 L54 96 Z" fill="#1a74d6" />
        {/* corps jaune-orangé */}
        <path d="M50 54 C40 66 42 92 56 102 C68 108 80 98 82 84 C84 68 80 56 70 50 Z" fill={`url(#${belly})`} />
        {/* pattes grises */}
        <g stroke="#6b6b73" strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d="M60 102 v8 M56 111 h9" />
          <path d="M72 100 v9 M68 110 h9" />
        </g>
        <g fill="#2b2b30">
          <circle cx="55" cy="111" r="1.6" />
          <circle cx="66" cy="111" r="1.6" />
          <circle cx="67" cy="110" r="1.6" />
          <circle cx="78" cy="110" r="1.6" />
        </g>
        {/* aile : couvertures vertes, plumes bleues */}
        <g className={wingUp ? "zazou-wing up" : mood === "wave" ? "zazou-wing wave" : "zazou-wing"}>
          <path d="M50 56 C36 62 32 82 36 100 C46 98 58 86 62 70 C64 62 58 54 50 56 Z" fill={`url(#${blue})`} />
          <path d="M50 56 C42 60 40 70 44 76 C52 76 60 70 62 64 C62 58 56 54 50 56 Z" fill="#5cc23d" />
          <path d="M44 76 C46 72 50 70 54 70" stroke="#e8d22a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M40 86 L54 74 M38 94 L52 80" stroke="#0f4fa8" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        {/* tête : nuque bleue, calotte verte, joues jaunes */}
        <circle cx="66" cy="38" r="20" fill={`url(#${blue})`} />
        <path d="M50 30 C54 18 70 14 82 22 C78 26 70 28 62 28 C56 28 52 30 50 30 Z" fill="#6cc644" />
        <path d="M58 46 C62 56 74 60 84 52 C86 44 82 40 76 42 C70 44 62 44 58 46 Z" fill="#ffb81c" />
        {/* masque blanc rayé de noir */}
        <path d="M66 30 C74 26 86 28 88 36 C88 44 82 48 74 46 C68 44 64 38 66 30 Z" fill="#f4f1ec" />
        <g stroke="#2b2b30" strokeWidth="1.1" strokeLinecap="round">
          <path d="M77 30 l6 -1 M78 33 l7 0 M78 41 l7 1 M76 44 l6 1" />
        </g>
        {/* collier noir sous le bec */}
        <path d="M72 50 C76 56 84 56 88 50 C86 54 80 58 74 55 Z" fill="#26262b" />
        {/* bec noir crochu */}
        <path d="M84 32 C96 30 104 38 102 52 C101 58 97 62 94 63 C96 56 95 50 90 46 C88 44 85 42 84 40 Z" fill="#2f2f35" />
        <path d="M86 45 C90 46 94 50 93 56 C90 54 86 52 84 49 Z" fill="#1b1b20" />
        <path d="M88 34 C94 34 98 38 99 44" stroke="#55555c" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* œil */}
        {closed ? (
          <path
            d={mood === "sleep" ? "M70 37 Q74 40 78 37" : "M70 38 Q74 33 78 38"}
            stroke="#1e1a3c"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <g className="zazou-eye">
            <circle cx="74" cy="36" r="4.4" fill="#f2b90f" stroke="#1e1a3c" strokeWidth="0.8" />
            <circle cx={mood === "think" ? 75 : 74.5} cy={mood === "think" ? 34.6 : 36.2} r="2" fill="#111" />
            <circle cx="75.6" cy="34.8" r="0.8" fill="#fff" />
          </g>
        )}
        {mood === "sad" && <path d="M68 29 L79 31" stroke="#1e1a3c" strokeWidth="2.2" strokeLinecap="round" />}

        {/* tenues */}
        {wear === "tie" && (
          <g>
            <path d="M68 55 h8 l-2 5 h-4 z" fill="#ff6b5b" />
            <path d="M70 60 h4 l3 17 l-5 5 l-5 -5 z" fill="#ff6b5b" />
            <path d="M70.5 65 l5 3 M69.5 72 l6 3" stroke="#d94b3c" strokeWidth="1.5" />
          </g>
        )}
        {wear === "kente" && (
          <g>
            <path d="M50 50 Q66 60 84 52 L84 59 Q66 67 50 57 Z" fill="#ffb020" />
            <path d="M55 53 v7 M63 56 v7 M71 57 v7 M79 55 v7" stroke="#1f9d55" strokeWidth="3" />
            <path d="M59 55 v7 M75 56 v7" stroke="#d94b3c" strokeWidth="2" />
            <path d="M52 56 l-4 15 l5 2 l3 -15 z" fill="#ffb020" />
          </g>
        )}
        {wear === "glasses" && (
          <g>
            <path d="M54 33 L66 34" stroke="#111" strokeWidth="2" />
            <rect x="65" y="30" width="18" height="12" rx="5" fill="#1b1b2b" />
            <path d="M68 33 l5 -1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity=".7" />
          </g>
        )}
        {wear === "cap" && (
          <g>
            <path d="M48 30 C48 14 68 10 80 20 L80 27 Z" fill="#4b3fe0" />
            <path d="M76 22 C84 20 92 22 96 27 L78 28 Z" fill="#3328b0" />
            <circle cx="62" cy="15" r="2" fill="#ffb020" />
          </g>
        )}
        {wear === "crown" && (
          <g>
            <path d="M54 23 L56 9 L62 16 L66 5 L71 16 L77 8 L77 23 Z" fill="#ffcf5a" stroke="#d98a00" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="66" cy="18" r="2" fill="#ff6b5b" />
          </g>
        )}
      </g>
      {mood === "sleep" && (
        <text x="94" y="20" className="zazou-z" fontSize="14" fontWeight="800" fill="var(--muted)">
          z
        </text>
      )}
      {mood === "think" && (
        <g className="zazou-dots" fill="var(--muted)">
          <circle cx="98" cy="18" r="3" />
          <circle cx="106" cy="10" r="4" />
        </g>
      )}
    </svg>
  );
}
