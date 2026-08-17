import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-emerald text-white shadow-card hover:bg-emerald-bright hover:shadow-[0_16px_36px_-10px_rgba(0,201,130,0.55)]",
  secondary: "bg-transparent text-white border border-white/35 hover:border-white hover:bg-white/10",
  ghost: "bg-transparent text-navy-deep border border-navy-deep/15 hover:border-navy-deep/40 hover:bg-navy-deep/5",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2";

interface CommonProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/** Shared CTA styling for every button/link across the page — variants
 * map directly to the primary (emerald)/secondary (outline) pairing the
 * design spec uses throughout. */
export function Button({ variant = "primary", className = "", children, href, ...rest }: ButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
