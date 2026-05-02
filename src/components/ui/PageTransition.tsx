"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reset to start state
    el.style.opacity = "0";
    el.style.transform = "translateX(18px)";

    // Force reflow so the browser registers the start state
    void el.offsetHeight;

    // Animate to final state
    el.style.transition = "opacity 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    el.style.opacity = "1";
    el.style.transform = "translateX(0px)";

    return () => {
      el.style.transition = "";
    };
  }, [pathname]);

  return (
    <div ref={ref} className="flex flex-col flex-1 min-h-0" style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
