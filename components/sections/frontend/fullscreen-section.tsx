import type React from "react";

type Props = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export function FullScreenSection({
  id,
  className = "",
  children,
  ariaLabel,
}: Props) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`relative w-screen min-h-screen overflow-hidden bg-background text-foreground flex items-center justify-center ${className}`}
    >
      {children}
    </section>
  );
}
