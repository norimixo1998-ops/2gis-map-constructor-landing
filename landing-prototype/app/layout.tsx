import type { ReactNode } from "react";
import localFont from "next/font/local";
import { SiteHeader } from "../components/site-header/SiteHeader";
import { SiteFooter } from "../components/site-footer/SiteFooter";
import "./globals.css";

const suisse = localFont({
  src: [
    { path: "./Fonts/SuisseIntl-Regular.otf", weight: "400", style: "normal" },
    { path: "./Fonts/SuisseIntl-Medium.otf", weight: "500", style: "normal" },
  ],
  display: "swap",
  variable: "--font-suisse",
});

export const metadata = {
  title: "Конструктор карт 2ГИС для сайтов",
  description: "Карта с метками, линиями и областями для встраивания на сайт. Бесплатно и без программирования.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={suisse.variable}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
