// Zazou, le calao de Fluent Path. Dessin original en SVG, animé en CSS.
export type Mood = "happy" | "cheer" | "think" | "sad" | "sleep" | "wave";

export function Zazou({ mood = "happy", size = 120 }: { mood?: Mood; size?: number }) {
  const closed = mood === "happy" || mood === "cheer" || mood === "sleep";
  const wingUp = mood === "cheer" || mood === "wave";
  return (
    <svg
      className={`zazou zazou-${mood}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Zazou le calao"
    >
      <ellipse cx="60" cy="112" rx="30" ry="5" fill="var(--shadow-soft)" />
      <g className="zazou-body">
        {/* queue */}
        <path d="M44 92 L30 108 L48 102 Z" fill="var(--zz-dark)" />
        {/* corps */}
        <ellipse cx="58" cy="76" rx="27" ry="29" fill="var(--zz-dark)" />
        <ellipse cx="60" cy="84" rx="17" ry="19" fill="var(--zz-belly)" />
        {/* aile */}
        <g className={wingUp ? "zazou-wing up" : "zazou-wing"}>
          <path d="M36 70 C28 80 30 96 42 100 C44 88 44 78 36 70 Z" fill="var(--zz-wing)" />
        </g>
        <g className={mood === "wave" ? "zazou-wing2 wave" : "zazou-wing2"}>
          <path d="M80 70 C88 80 86 96 76 100 C74 88 74 78 80 70 Z" fill="var(--zz-wing)" />
        </g>
        {/* tête */}
        <circle cx="62" cy="40" r="21" fill="var(--zz-dark)" />
        {/* casque */}
        <path d="M66 22 C78 14 96 16 104 26 C94 24 82 26 74 32 Z" fill="var(--zz-casque)" />
        {/* bec */}
        <path d="M74 34 C92 30 108 36 112 50 C100 44 88 44 76 48 Z" fill="var(--zz-beak)" />
        <path d="M76 48 C88 46 102 48 112 50 C102 56 88 56 76 52 Z" fill="var(--zz-beak-low)" />
        {/* joue */}
        <circle cx="70" cy="48" r="4" fill="var(--zz-cheek)" opacity="0.8" />
        {/* œil */}
        {closed ? (
          <path
            d={mood === "sleep" ? "M56 38 Q61 41 66 38" : "M56 39 Q61 33 66 39"}
            stroke="var(--zz-eye)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <g className="zazou-eye">
            <circle cx="61" cy="37" r="7" fill="#fff" />
            <circle cx={mood === "think" ? 63 : 62} cy={mood === "think" ? 34 : 38} r="3.6" fill="var(--zz-eye)" />
            <circle cx={mood === "think" ? 64 : 63} cy={mood === "think" ? 33 : 37} r="1.2" fill="#fff" />
          </g>
        )}
        {mood === "sad" && <path d="M54 29 L66 32" stroke="var(--zz-eye)" strokeWidth="2.5" strokeLinecap="round" />}
        {/* pattes */}
        <path d="M52 104 v6 M66 104 v6" stroke="var(--zz-beak)" strokeWidth="4" strokeLinecap="round" />
      </g>
      {mood === "sleep" && (
        <text x="92" y="22" className="zazou-z" fontSize="14" fontWeight="800" fill="var(--muted)">
          z
        </text>
      )}
      {mood === "think" && (
        <g className="zazou-dots" fill="var(--muted)">
          <circle cx="94" cy="20" r="3" />
          <circle cx="102" cy="12" r="4" />
        </g>
      )}
    </svg>
  );
}
