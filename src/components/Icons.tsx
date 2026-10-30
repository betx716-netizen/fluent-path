import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", "aria-hidden": true } as const;

export const Flame = (p: P) => (
  <svg {...base} {...p}>
    <path fill="#ffb020" d="M12 2c1 3.5 5.5 6 5.5 11.2A5.5 5.5 0 0 1 12 19a5.5 5.5 0 0 1-5.5-5.8c0-2.4 1.3-4 2.6-5.2.2 1.6.9 2.8 2 3.4C11 9.5 10.8 5.5 12 2Z" />
    <path fill="#ff7a1a" d="M12 10.5c.6 1.8 2.8 3 2.8 5.3A2.8 2.8 0 0 1 12 18.6a2.8 2.8 0 0 1-2.8-2.8c0-1.4.9-2.4 1.6-3 .2.8.6 1.3 1.1 1.5-.3-1.4-.2-2.6.1-3.8Z" />
  </svg>
);
export const Gem = (p: P) => (
  <svg {...base} {...p}>
    <path fill="#3cc4f5" d="M6 3h12l4 6-10 12L2 9z" />
    <path fill="#1aa3d9" d="M2 9h20L12 21z" />
    <path fill="#a6e7ff" d="M6 3l3 6h6l3-6z" />
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
