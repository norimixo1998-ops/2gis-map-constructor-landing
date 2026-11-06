"use client";

import { useEffect, useRef, useState } from "react";
import { publicAsset } from "../../lib/public-asset";
import styles from "./SiteHeader.module.css";

type HeaderMode = "top" | "hidden" | "returning";

const REVEAL_AFTER_PX = 160; // Working prototype value; confirm with design.
const DIRECTION_TOLERANCE_PX = 6;

const navigation = [
  "Все продукты",
  "Бизнесу",
  "Госсектору",
  "Партнерам",
  "Документация",
  "О данных",
  "Кейсы",
  "Контакты",
];

function HeaderIcon({ src, className = "" }: { src: string; className?: string }) {
  return <img className={className} src={publicAsset(src)} alt="" aria-hidden="true" />;
}

export function SiteHeader() {
  const [mode, setMode] = useState<HeaderMode>("top");
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    if (window.scrollY > REVEAL_AFTER_PX) setMode("hidden");

    function onScroll() {
      const currentY = Math.max(0, window.scrollY);
      const change = currentY - lastScrollY.current;

      if (currentY <= REVEAL_AFTER_PX) {
        setMode("top");
      } else if (change > DIRECTION_TOLERANCE_PX) {
        setMode("hidden");
      } else if (change < -DIRECTION_TOLERANCE_PX) {
        setMode("returning");
      }

      if (Math.abs(change) > DIRECTION_TOLERANCE_PX || currentY <= REVEAL_AFTER_PX) {
        lastScrollY.current = currentY;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${styles[mode]}`} data-header-mode={mode}>
        <div className={styles.inner}>
          <div className={styles.topRow}>
            <img className={styles.logo} src={publicAsset("/brand/logo-2GIS.svg")} alt="2ГИС" />

            <div className={styles.desktopControls}>
              <span className={styles.search}>
                <HeaderIcon src="/icons/header/magnifying-glass-stroke.svg" />
                <span>Поиск</span>
              </span>
              <span className={styles.language}>
                <HeaderIcon src="/icons/header/language-stroke.svg" />
                <span>RU</span>
                <HeaderIcon src="/icons/header/chevron-down-small-stroke.svg" />
              </span>
              <span className={styles.cabinet}>В кабинет</span>
              <span className={styles.consultation}>Получить консультацию</span>
            </div>

            <div className={styles.mobileControls}>
              <span className={styles.language}>
                <HeaderIcon src="/icons/header/language-stroke.svg" />
                <span>RU</span>
                <HeaderIcon src="/icons/header/chevron-down-small-stroke.svg" />
              </span>
              <HeaderIcon src="/icons/header/icon-menu.svg" className={styles.menuIcon} />
            </div>
          </div>

          <div className={styles.navRow} aria-label="Разделы сайта, предпросмотр">
            {navigation.map((item, index) => (
              <span className={index === 0 ? styles.navPrimary : undefined} key={item}>
                {item}
                {index === 0 && <HeaderIcon src="/icons/header/chevron-down-small-stroke.svg" />}
              </span>
            ))}
          </div>
        </div>
      </header>
      <div className={styles.space} aria-hidden="true" />
    </>
  );
}
