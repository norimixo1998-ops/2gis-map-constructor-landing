"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "../site-header/SiteHeader";
import { SiteFooter } from "../site-footer/SiteFooter";

export function SiteChrome({ position }: { position: "header" | "footer" }) {
  const pathname = usePathname();
  if (pathname === "/geoflow-hero-preview") return null;
  return position === "header" ? <SiteHeader /> : <SiteFooter />;
}
