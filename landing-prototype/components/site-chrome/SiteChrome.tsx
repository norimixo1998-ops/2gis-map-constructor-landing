"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "../site-header/SiteHeader";
import { SiteFooter } from "../site-footer/SiteFooter";

export function SiteChrome({ position }: { position: "header" | "footer" }) {
  const pathname = usePathname();
  const route = pathname.replace(/\/+$/, "");
  if (route === "/geoflow-hero-preview" || route === `${process.env.NEXT_PUBLIC_BASE_PATH}/geoflow-hero-preview`) return null;
  return position === "header" ? <SiteHeader /> : <SiteFooter />;
}
