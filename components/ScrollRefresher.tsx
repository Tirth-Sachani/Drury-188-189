"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import gsap from "gsap";

export default function ScrollRefresher() {
  const pathname = usePathname();

  useEffect(() => {
    // We add a slight delay to allow the new page DOM to render and stabilize
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      // Also update Lenis if possible, but ScrollTrigger.refresh() is usually enough
      // to fix the trigger positions based on the new page height.
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
