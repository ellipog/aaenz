"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/lib/use-media-query";
import { WizardModal } from "./WizardModal";

type Props = {
  /** Pre-selected tier (start/vekst/tilpasset). */
  tier?: string;
  /** Pre-selected one-time service (logo/profilmanual). */
  service?: string;
  /** Visual variant. */
  variant?: "primary" | "secondary";
  /** Button label. */
  children: React.ReactNode;
  className?: string;
};

const variantCls = {
  primary: "bg-moss text-paper hover:bg-moss-deep",
  secondary: "bg-paper text-ink hover:bg-paper-deep",
};

/**
 * A pricing/service CTA that opens the wizard the right way:
 * - Mobile (< 768px): opens the iOS bottom-sheet modal
 * - Desktop: navigates to /start?tier=… (full-page wizard)
 *
 * Renders as a real <a href="/start?tier=X"> so it's keyboard/screen-reader
 * friendly and works without JS (progressive enhancement). On mobile the
 * click is intercepted to open the modal instead.
 */
export function WizardTrigger({
  tier,
  service,
  variant = "primary",
  children,
  className = "",
}: Props) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const params = new URLSearchParams();
  if (tier) params.set("tier", tier);
  if (service) params.set("service", service);
  const href = `/start${params.toString() ? `?${params.toString()}` : ""}`;

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (isMobile) {
      e.preventDefault();
      setOpen(true);
    }
    // Desktop: let the native <a> navigate to /start.
  }

  return (
    <>
      <a
        href={href}
        onClick={onClick}
        className={`inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss ${variantCls[variant]} ${className}`}
      >
        {children}
      </a>

      <WizardModal
        open={open}
        onClose={() => setOpen(false)}
        initialTier={tier}
        initialService={service}
      />
    </>
  );
}
