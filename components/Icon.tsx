import type { ReactNode } from "react";

export type IconName =
  | "activity"
  | "arrow"
  | "badge"
  | "bar-chart"
  | "bot"
  | "boxes"
  | "building"
  | "calendar"
  | "check"
  | "clipboard"
  | "cog"
  | "cpu"
  | "dollar"
  | "factory"
  | "file"
  | "files"
  | "globe"
  | "handshake"
  | "layers"
  | "lightbulb"
  | "mail"
  | "megaphone"
  | "message"
  | "network"
  | "newspaper"
  | "package"
  | "radar"
  | "radio"
  | "rocket"
  | "search"
  | "send"
  | "sparkles"
  | "star"
  | "target"
  | "telescope"
  | "trending"
  | "trophy"
  | "user"
  | "users"
  | "waves"
  | "wind"
  | "wrench";

const paths: Record<IconName, ReactNode> = {
  activity: <path d="M3 12h4l2-7 4 14 2-7h6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  badge: <path d="m8 21 4-2 4 2V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16Z" />,
  "bar-chart": <path d="M4 19V5M8 19v-7M12 19V8M16 19v-4M20 19V4" />,
  bot: <path d="M8 8V5m8 3V5M6 10h12v8H6zM9 14h.01M15 14h.01" />,
  boxes: <path d="m3 8 6-3 6 3-6 3-6-3Zm6 3v7l-6-3V8m6 10 6-3V8m0 0 6 3v7l-6 3" />,
  building: <path d="M4 21V5h16v16M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01M9 21v-4h6v4" />,
  calendar: <path d="M7 3v4m10-4v4M4 9h18M5 5h18v17H5z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  clipboard: <path d="M8 4h8l1 3H7l1-3Zm-2 3h12v16H6zM9 12h6M9 16h6" />,
  cog: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v3m0 14v3M4.9 4.9l2.1 2.1m10 10 2.1 2.1M2 12h3m14 0h3M4.9 19.1l2.1-2.1m10-10 2.1-2.1" />,
  cpu: <path d="M8 8h8v8H8zM4 10h4m8 0h4M4 14h4m8 0h4M10 4v4m4-4v4m-4 8v4m4-4v4" />,
  dollar: <path d="M12 2v20M17 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7" />,
  factory: <path d="M3 21V9l6 4V9l6 4h6v8H3Zm4-4h2m4 0h2m4 0h2" />,
  file: <path d="M6 3h9l5 5v18H6zM14 3v6h6M9 14h8M9 18h8" />,
  files: <path d="M8 7h10v14H8zM5 4h10" />,
  globe: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-9-10h18M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" />,
  handshake: <path d="m7 12 3-3 3 3 4-4 4 4-7 7-4-4-3 3-4-4 4-4Z" />,
  layers: <path d="m12 3 9 5-9 5-9-5 9-5Zm-7 9 7 4 7-4M5 16l7 4 7-4" />,
  lightbulb: <path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z" />,
  mail: <path d="M4 6h20v16H4zM4 7l10 8 10-8" />,
  megaphone: <path d="M4 14h4l12 5V5L8 10H4v4Zm4 0 2 6" />,
  message: <path d="M4 5h20v14H8l-4 4V5Z" />,
  network: <path d="M6 6h.01M18 6h.01M12 18h.01M6 6l12 0M6 6l6 12m6-12-6 12" />,
  newspaper: <path d="M4 5h18v18H4zM8 9h6M8 13h10M8 17h10" />,
  package: <path d="m4 8 8-4 8 4-8 4-8-4Zm0 0v9l8 4 8-4V8M12 12v9" />,
  radar: <path d="M12 12 21 3M4 12a8 8 0 0 0 8 8m-4-8a4 4 0 0 0 4 4m0-12a8 8 0 0 1 8 8m-4 0a4 4 0 0 0-4-4" />,
  radio: <path d="M5 9h14v11H5zM8 13h.01M12 13h6M8 17h10M9 5l3 4 3-4" />,
  rocket: <path d="M5 19c2-5 6-10 14-14-1 8-6 12-14 14Zm6-6 6 6M8 16l-4 4" />,
  search: <path d="M11 19a8 8 0 1 1 5.7-2.3L22 22M9 12l2 2 4-5" />,
  send: <path d="m3 12 20-9-9 20-3-8-8-3Z" />,
  sparkles: <path d="m12 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" />,
  star: <path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z" />,
  target: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-4a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  telescope: <path d="m4 14 8-8 4 4-8 8-4-4Zm11-8 3-3 3 3-3 3M8 18l-2 4m5-5 3 5" />,
  trending: <path d="m3 17 7-7 4 4 7-8M15 6h6v6" />,
  trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0V4Zm0 2H4c0 4 2 6 5 6m7-6h4c0 4-2 6-5 6M12 13v5m-4 4h8" />,
  user: <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-8 10a8 8 0 0 1 16 0" />,
  users: <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-1a3 3 0 1 0 0-6M3 22a7 7 0 0 1 14 0m2 0a5 5 0 0 0-4-5" />,
  waves: <path d="M3 9c3 0 3-2 6-2s3 2 6 2 3-2 6-2M3 15c3 0 3-2 6-2s3 2 6 2 3-2 6-2" />,
  wind: <path d="M3 8h12a3 3 0 1 0-3-3M3 14h18M3 20h12a3 3 0 1 1-3 3" />,
  wrench: <path d="M14 6a5 5 0 0 0 7 7L12 22l-5-5 9-9Z" />
};

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      className="ui-icon"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        {paths[name]}
      </g>
    </svg>
  );
}

export function IconBadge({ name }: { name: IconName }) {
  return (
    <span className="icon-badge" aria-hidden="true">
      <Icon name={name} />
    </span>
  );
}

export function InlineIcon({ name }: { name: IconName }) {
  return (
    <span className="inline-icon" aria-hidden="true">
      <Icon name={name} />
    </span>
  );
}
