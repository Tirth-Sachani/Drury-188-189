"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollRefresher from "@/components/ScrollRefresher";

export default function GlobalShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // High-level check to exclude lander layout from Admin and Login paths
  const isAdminPath = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  if (isAdminPath) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <Navbar />
      <ScrollRefresher />
      {children}
      <Footer />
    </SmoothScroll>
  );
}
