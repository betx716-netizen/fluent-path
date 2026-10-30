import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", "aria-hidden": true } as const;

export const Flame = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M12 2c1 3.5 5.5 6 5.5 11.2A5.5 5.5 0 0 1 12 19a5.5 5.5 0 0 1-5.5-5.8c0-2.4 1.3-4 2.6-5.2.2 1.6.9 2.8 2 3.4C11 9.5 10.8 5.5 12 2Z" />
    <path fill="#ffc93c" d="M12 10.5c.6 1.8 2.8 3 2.8 5.3A2.8 2.8 0 0 1 12 18.6a2.8 2.8 0 0 1-2.8-2.8c0-1.4.9-2.4 1.6-3 .2.8.6 1.3 1.1 1.5-.3-1.4-.2-2.6.1-3.8Z" />
  </svg>
);
export const Gem = (p: P) => (
  <svg {...base} {...p}>
    <path fill="#ffc93c" d="M6 3h12l4 6-10 12L2 9z" />
    <path fill="#f2a900" d="M2 9h20L12 21z" />
    <path fill="#ffe7a3" d="M6 3l3 6h6l3-6z" />
  </svg>
);
export const Bolt = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M13 2 4 14h6l-1 8 9-12h-6z" />
  </svg>
);
export const Star = ({ on = true, ...p }: P & { on?: boolean }) => (
  <svg {...base} {...p} className={on ? "on" : undefined}>
    <path
      fill={on ? "#ffb020" : "var(--locked)"}
      stroke={on ? "#d98a00" : "var(--locked-dark)"}
      strokeWidth="1.2"
      strokeLinejoin="round"
      d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"
    />
  </svg>
);
export const Lock = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M7 10V8a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V8a3 3 0 0 0-6 0z" />
  </svg>
);
export const Book = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5a.5.5 0 0 0 0 1H20v3H6.5A2.5 2.5 0 0 1 4 19.5z" />
  </svg>
);
export const Check = (p: P) => (
  <svg {...base} {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const Cross = (p: P) => (
  <svg {...base} {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Speaker = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M3 9h4l5-4v14l-5-4H3z" />
    <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" />
  </svg>
);
export const Chest = (p: P) => (
  <svg {...base} {...p}>
    <path fill="#c97a2b" d="M3 10h18v10H3z" />
    <path fill="#e8973c" d="M3 10V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z" />
    <path fill="#ffcf5a" d="M3 10h18v2H3zM10 10h4v5h-4z" />
    <circle cx="12" cy="13" r="1" fill="#7a4210" />
  </svg>
);
export const Crown = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="m3 7 5 4 4-7 4 7 5-4-2 12H5z" />
  </svg>
);
export const Trophy = (p: P) => (
  <svg {...base} {...p}>
    <path fill="#ffb020" d="M7 3h10v6a5 5 0 0 1-10 0z" />
    <path fill="none" stroke="#d98a00" strokeWidth="2" d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" />
    <path fill="#d98a00" d="M10 14h4v3h3v4H7v-4h3z" />
  </svg>
);
export const Clock = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M12 7v5l3 2" />
  </svg>
);
export const Target = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);
export const Snow = (p: P) => (
  <svg {...base} {...p}>
    <path fill="none" stroke="#3cc4f5" strokeWidth="2.2" strokeLinecap="round" d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 2 3-2M9 20l3-2 3 2" />
  </svg>
);

export const Mic = (p: P) => (
  <svg {...base} {...p}>
    <rect x="8.5" y="2" width="7" height="12.5" rx="3.5" fill="currentColor" />
    <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M5 11a7 7 0 0 0 14 0M12 18v3.5" />
  </svg>
);
export const Keyboard = (p: P) => (
  <svg {...base} {...p}>
    <rect x="2" y="5" width="20" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
    <path fill="currentColor" d="M6 9h2v2H6zm4 0h2v2h-2zm4 0h2v2h-2zM6 13h2v2H6zm10-4h2v2h-2zm-6 4h6v2h-6zm6 0h2v2h-2z" />
  </svg>
);
export const Send = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M3 20.5 21 12 3 3.5l2.5 7L15 12l-9.5 1.5z" />
  </svg>
);

export const Heart = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.4.7-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21Z" />
    <ellipse cx="7.4" cy="8.6" rx="1.8" ry="1.2" fill="#fff" opacity=".45" transform="rotate(-30 7.4 8.6)" />
  </svg>
);
export const Bulb = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M12 2.5a7 7 0 0 0-4.2 12.6c.7.5 1.2 1.3 1.2 2.2v.7h6v-.7c0-.9.5-1.7 1.2-2.2A7 7 0 0 0 12 2.5Z" />
    <rect x="9" y="19" width="6" height="2.5" rx="1.2" fill="currentColor" />
  </svg>
);
export const Slow = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M4 15.5C4 10.8 7.6 7 12 7s8 3.8 8 8.5H4Z" />
    <path fill="currentColor" d="M19 14.5h1.6a2.4 2.4 0 1 0 0-4.8c-.7 0-1.3.3-1.7.7 .1 1.3.2 2.7.1 4.1Z" />
    <rect x="5" y="16" width="3.2" height="3.5" rx="1.4" fill="currentColor" />
    <rect x="15.8" y="16" width="3.2" height="3.5" rx="1.4" fill="currentColor" />
    <path d="M8.5 9.5 12 12.5l3.5-3" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".7" />
  </svg>
);
export const Explain = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M4 3.5h11a2.5 2.5 0 0 1 2.5 2.5v6A2.5 2.5 0 0 1 15 14.5H9l-4 3.5v-3.5H4A2.5 2.5 0 0 1 1.5 12V6A2.5 2.5 0 0 1 4 3.5Z" />
    <path fill="currentColor" opacity=".55" d="M19 8h1a2.5 2.5 0 0 1 2.5 2.5v5A2.5 2.5 0 0 1 20 18h-.5v3l-3.5-3h-4.5a2.5 2.5 0 0 1-2-1h5.5a4 4 0 0 0 4-4V8Z" />
    <path d="M6 7.5h7M6 10.5h4.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
export const Sparkle = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M11 2.5c.6 4.4 2.4 6.2 6.8 6.8-4.4.6-6.2 2.4-6.8 6.8-.6-4.4-2.4-6.2-6.8-6.8C8.6 8.7 10.4 6.9 11 2.5Z" />
    <path fill="currentColor" d="M18.5 14c.3 2.1 1.2 3 3.3 3.3-2.1.3-3 1.2-3.3 3.3-.3-2.1-1.2-3-3.3-3.3 2.1-.3 3-1.2 3.3-3.3Z" />
  </svg>
);
export const Guide = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M3 5.2C5.8 3.9 8.6 4 11 5.6V20c-2.4-1.5-5.2-1.6-8-.4V5.2Z" />
    <path fill="currentColor" opacity=".75" d="M21 5.2c-2.8-1.3-5.6-1.2-8 .4V20c2.4-1.5 5.2-1.6 8-.4V5.2Z" />
  </svg>
);

// Icônes de navigation
export const NavLearn = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
);
export const NavReview = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="6" width="13" height="15" rx="3" fill="currentColor" opacity=".45" />
    <rect x="8" y="3" width="13" height="15" rx="3" fill="currentColor" />
  </svg>
);
export const NavTalk = (p: P) => (
  <svg {...base} {...p}>
    <rect x="8" y="2" width="8" height="13" rx="4" fill="currentColor" />
    <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M5 11a7 7 0 0 0 14 0M12 18v4" />
  </svg>
);
export const NavAccent = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" />
    <path fill="none" stroke="currentColor" strokeWidth="2" d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
  </svg>
);
export const NavProfile = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4.5" fill="currentColor" />
    <path fill="currentColor" d="M3.5 21a8.5 8.5 0 0 1 17 0z" />
  </svg>
);
export const NavSounds = (p: P) => (
  <svg {...base} {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4" />
  </svg>
);
export const NavLeague = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M12 2 20 5v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5z" />
    <path fill="var(--star, #fff)" opacity=".85" d="m12 7 1.5 3 3.3.5-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.5z" />
  </svg>
);
export const Stop = (p: P) => (
  <svg {...base} {...p}>
    <rect x="6" y="6" width="12" height="12" rx="3" fill="currentColor" />
  </svg>
);
export const Share = (p: P) => (
  <svg {...base} {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
  </svg>
);
export const Briefcase = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="7" width="18" height="13" rx="3" fill="currentColor" />
    <path fill="none" stroke="currentColor" strokeWidth="2" d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path fill="#fff" opacity=".5" d="M3 12h18v2H3z" />
  </svg>
);
export const Plane = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z" />
  </svg>
);
export const Cap = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M12 3 1 9l11 6 9-4.9V17h2V9z" />
    <path fill="currentColor" opacity=".7" d="M5 13.2V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-3.8l-7 3.8z" />
  </svg>
);
export const Chart = (p: P) => (
  <svg {...base} {...p}>
    <path fill="currentColor" d="M4 20h4v-7H4zM10 20h4V9h-4zM16 20h4V4h-4z" />
  </svg>
);
