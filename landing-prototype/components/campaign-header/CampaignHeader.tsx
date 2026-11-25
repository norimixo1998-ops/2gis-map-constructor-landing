"use client";

import { useEffect, useState } from "react";
import { publicAsset } from "../../lib/public-asset";
import styles from "./CampaignHeader.module.css";

type HeaderMode = "top" | "sticky";

const STICKY_AFTER_PX = 180;

const navigation = [
  { label: "Акция", href: "#key-points" },
  { label: "Как работает", href: "#workflow" },
  { label: "Кому подходит", href: "#delivery-scenarios" },
  { label: "Вопросы", href: "#faq" },
];

export function CampaignHeader() {
  const [mode, setMode] = useState<HeaderMode>("top");

  useEffect(() => {
    function onScroll() {
      setMode(window.scrollY >= STICKY_AFTER_PX ? "sticky" : "top");
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${styles[mode]}`} data-header-mode={mode}>
        <div className={styles.inner}>
          <div className={styles.row}>
            <div className={styles.brand}>
              <img className={styles.logo} src={publicAsset("/brand/logo-2gis.svg")} alt="2ГИС" />
              <span className={styles.badge}>2ГИС Геопоток: Логистика</span>
            </div>
            <div className={styles.desktopControls}>
              <nav className={styles.navigation} aria-label="Навигация по лендингу">
                {navigation.map(({ label, href }) => href
                  ? <a key={label} href={href}>{label}</a>
                  : <span key={label}>{label}</span>)}
              </nav>
              <a className={styles.action} href="#connect">Подключить курьеров</a>
            </div>
            <div className={styles.mobileControls}>
              <img className={styles.menuIcon} src={publicAsset("/icons/header/icon-menu.svg")} alt="" aria-hidden="true" />
            </div>
          </div>
        </div>
      </header>
      <div className={styles.space} aria-hidden="true" />
    </>
  );
}
