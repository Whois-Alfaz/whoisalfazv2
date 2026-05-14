"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { usePathname } from "next/navigation";

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Sanity Studio uses its own motion components.
  // Wrapping it in LazyMotion strict mode causes a crash.
  if (pathname?.startsWith("/studio")) {
    return <>{children}</>;
  }

  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
