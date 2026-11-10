import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const Base = ({ children, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const SpeakerIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M11 5 6 9H3v6h3l5 4z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </Base>
);

export const TurtleIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 15c0-4 3.5-7 8-7s8 3 8 7z" />
    <path d="M20 13h1.5a1.5 1.5 0 0 0 0-3H20" />
    <path d="M7 15v2.5M17 15v2.5" />
    <path d="M9 11l2 4M15 11l-2 4" />
  </Base>
);

export const StopIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </Base>
);

export const StarIcon = ({ filled, ...props }: IconProps & { filled?: boolean }) => (
  <Base {...props} fill={filled ? "currentColor" : "none"}>
    <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />
  </Base>
);

export const TrashIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 7h16M10 11v6M14 11v6" />
    <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    <path d="M9 7V4h6v3" />
  </Base>
);

export const TranslateIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 5h8M8 3v2M5.5 5c.8 3 3 5.5 6 7" />
    <path d="M10.5 5c-.8 3.5-3 6.5-6 8" />
    <path d="m12.5 21 4-10 4 10M14 17.5h5" />
  </Base>
);

export const HistoryIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" />
    <path d="M5 17a3 3 0 0 1 3-3h11" />
    <path d="M9 8h6" />
  </Base>
);

export const CardsIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="3" y="7" width="13" height="14" rx="2" />
    <path d="M8 4h11a2 2 0 0 1 2 2v12" />
  </Base>
);

export const AlphabetIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="m3 18 4-11 4 11M4.5 14h5" />
    <path d="M14 7h4a2.5 2.5 0 0 1 0 5h-4zM14 12h4.5a3 3 0 0 1 0 6H14z" />
  </Base>
);

export const LogoutIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
    <path d="M10 8l-4 4 4 4M6 12h10" />
  </Base>
);

export const SearchIcon = (props: IconProps) => (
  <Base {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Base>
);

export const SendIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M5 12h13M13 6l6 6-6 6" />
  </Base>
);

export const CheckIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Base>
);

export const XIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

export const BookIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z" />
    <path d="M4 5v17" />
    <path d="M9 8h6" />
  </Base>
);

export const SunIcon = (props: IconProps) => (
  <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden="true" {...props}>
    <g fill="#f2b632">
      <circle cx="24" cy="24" r="8" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <rect key={deg} x="23" y="4" width="2" height="8" rx="1" transform={`rotate(${deg} 24 24)`} />
      ))}
    </g>
  </svg>
);
