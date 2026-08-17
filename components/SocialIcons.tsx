import type { SVGProps } from "react";

/**
 * Lucide dropped brand/logo icons some time ago, so the four social marks
 * used in the footer and "connect" section are hand-drawn here at the
 * same 24x24 / stroke-based proportions as the rest of the lucide icons
 * elsewhere on the page, to keep the icon language consistent.
 */
type IconProps = SVGProps<SVGSVGElement>;

const commonProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M14 8.5h2.5V5.2c-.43-.06-1.9-.2-3.24-.2-3.2 0-4.51 1.94-4.51 4.62v2.13H6v3.6h2.75V21.8h3.63v-6.45h2.9l.44-3.6h-3.34V9.9c0-.94.28-1.4 1.62-1.4Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <line x1="7.5" y1="10.5" x2="7.5" y2="16.5" />
      <circle cx="7.5" cy="7.3" r="0.4" fill="currentColor" stroke="none" />
      <path d="M11.5 16.5v-3.6c0-1.32.9-2.4 2.3-2.4 1.3 0 2.2 1 2.2 2.4v3.6" />
      <line x1="11.5" y1="10.5" x2="11.5" y2="16.5" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...commonProps} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="4" />
      <path d="M10.5 9.7v4.6l4-2.3-4-2.3Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
