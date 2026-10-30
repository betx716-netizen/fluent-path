import { useStore } from "../lib/store";

// Zazou : une boule mangue aux coins arrondis, grands yeux, antenne orange.
export type Mood = "happy" | "cheer" | "think" | "sad" | "sleep" | "wave";

export const OUTFITS: { id: string; name: string; price: number }[] = [
  { id: "cap", name: "Casquette", price: 100 },
  { id: "tie", name: "Cravate de pro", price: 150 },
  { id: "kente", name: "Écharpe kente", price: 200 },
  { id: "glasses", name: "Lunettes de soleil", price: 300 },
  { id: "crown", name: "Couronne", price: 500 }
];

const MANGO = "#ffb31a";
const MANGO_DARK = "#e08a00";
const ORANGE = "#ff7a1a";
const INK = "#1f1a2e";

export function Zazou({ mood = "happy", size = 120, outfit }: { mood?: Mood; size?: number; outfit?: string | null }) {
  const worn = useStore(s => s.outfits.worn);
  const wear = outfit === undefined ? worn : outfit;
  const eyesClosed = mood === "sleep";
  const look = mood === "think" ? { x: 2, y: -3 } : { x: 1.5, y: 1.5 };
  return (
    <svg className={`zazou zazou-${mood}`} width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Zazou">
      <ellipse cx="60" cy="113" rx="30" ry="4.5" fill="var(--shadow-soft)" />
      <g className="zazou-body">
        {/* antenne */}
        <g className="zazou-antenna">
          <path d="M60 24 C60 16 64 12 68 9" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="69" cy="8" r="5.5" fill={ORANGE} />
          <circle cx="67.5" cy="6.5" r="1.8" fill="#fff" opacity=".6" />
        </g>
        {/* pieds */}
        <ellipse cx="45" cy="104" rx="10" ry="6" fill={MANGO_DARK} />
        <ellipse cx="75" cy="104" rx="10" ry="6" fill={MANGO_DARK} />
        {/* bras */}
        <g className={mood === "cheer" ? "zazou-arm-l up" : "zazou-arm-l"}>
          <ellipse cx="17" cy="70" rx="7" ry="12" fill={MANGO_DARK} />
        </g>
        <g className={mood === "cheer" ? "zazou-arm-r up" : mood === "wave" ? "zazou-arm-r wave" : "zazou-arm-r"}>
          <ellipse cx="103" cy="70" rx="7" ry="12" fill={MANGO_DARK} />
        </g>
        {/* corps */}
        <rect x="18" y="22" width="84" height="82" rx="34" fill={MANGO} />
        <path d="M18 70 C22 96 40 104 60 104 C80 104 98 96 102 70 C98 92 82 98 60 98 C38 98 22 92 18 70 Z" fill={MANGO_DARK} opacity=".35" />
        <ellipse cx="40" cy="36" rx="11" ry="6" fill="#fff" opacity=".35" transform="rotate(-20 40 36)" />
        {/* joues */}
        <circle cx="32" cy="74" r="6.5" fill={ORANGE} opacity=".35" />
        <circle cx="88" cy="74" r="6.5" fill={ORANGE} opacity=".35" />
        {/* yeux */}
        {eyesClosed ? (
          <g stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M36 58 Q45 63 54 58" />
            <path d="M66 58 Q75 63 84 58" />
          </g>
        ) : (
          <g className="zazou-eye">
            <circle cx="45" cy="56" r="13" fill="#fff" />
            <circle cx="75" cy="56" r="13" fill="#fff" />
            <circle cx={45 + look.x} cy={56 + look.y} r="6.5" fill={INK} />
            <circle cx={75 + look.x} cy={56 + look.y} r="6.5" fill={INK} />
            <circle cx={47.5 + look.x} cy={53.5 + look.y} r="2.2" fill="#fff" />
            <circle cx={77.5 + look.x} cy={53.5 + look.y} r="2.2" fill="#fff" />
          </g>
        )}
        {mood === "sad" && (
          <g stroke={INK} strokeWidth="3" strokeLinecap="round">
            <path d="M34 44 L50 38" />
            <path d="M86 44 L70 38" />
          </g>
        )}
        {/* bouche */}
        {mood === "cheer" ? (
          <g>
            <path d="M47 76 Q60 96 73 76 Z" fill={INK} />
            <path d="M53 86 Q60 92 67 86 Q60 82 53 86 Z" fill="#ff6b7a" />
          </g>
        ) : mood === "sad" ? (
          <path d="M50 86 Q60 78 70 86" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        ) : mood === "think" ? (
          <path d="M53 82 Q60 80 68 83" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        ) : mood === "sleep" ? (
          <ellipse cx="60" cy="82" rx="4" ry="3" fill={INK} />
        ) : (
          <path d="M49 77 Q60 89 71 77" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        )}

        {/* tenues */}
        {wear === "glasses" && (
          <g>
            <circle cx="45" cy="56" r="14" fill="#1b1b2b" />
            <circle cx="75" cy="56" r="14" fill="#1b1b2b" />
            <path d="M59 54 h2" stroke="#1b1b2b" strokeWidth="4" />
            <path d="M38 50 l6 -3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".6" />
            <path d="M68 50 l6 -3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".6" />
          </g>
        )}
        {wear === "tie" && (
          <g>
            <path d="M55 94 h10 l-2 5 h-6 z" fill="#6c47ff" />
            <path d="M57 99 h6 l2 6 l-5 5 l-5 -5 z" fill="#6c47ff" />
          </g>
        )}
        {wear === "kente" && (
          <g>
            <path d="M22 86 Q60 100 98 86 L96 95 Q60 108 24 95 Z" fill={ORANGE} />
            <path d="M32 90 v8 M44 93 v8 M56 95 v8 M68 95 v8 M80 93 v8 M90 90 v7" stroke="#22b55e" strokeWidth="3" />
          </g>
        )}
        {wear === "cap" && (
          <g>
            <path d="M24 38 C26 18 50 14 66 16 C82 18 94 26 96 38 Z" fill="#6c47ff" />
            <path d="M80 34 C92 32 104 34 110 40 L84 40 Z" fill="#4e2fd6" />
            <circle cx="56" cy="17" r="3" fill="#ffc93c" />
          </g>
        )}
        {wear === "crown" && (
          <g>
            <path d="M30 28 L32 10 L41 19 L48 6 L55 19 L63 11 L62 28 Z" fill="#ffc93c" stroke={MANGO_DARK} strokeWidth="2" strokeLinejoin="round" />
            <circle cx="46" cy="22" r="2.5" fill="#f04452" />
          </g>
        )}
      </g>
      {mood === "sleep" && (
        <text x="98" y="22" className="zazou-z" fontSize="16" fontWeight="900" fill="var(--muted)">
          z
        </text>
      )}
      {mood === "think" && (
        <g className="zazou-dots" fill="var(--muted)">
          <circle cx="100" cy="20" r="3" />
          <circle cx="108" cy="11" r="4" />
        </g>
      )}
    </svg>
  );
}
