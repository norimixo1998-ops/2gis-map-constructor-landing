"use client";

import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";
import { publicAsset } from "../../lib/public-asset";
import { HolidayGarland } from "./HolidayGarland";
import styles from "./CampaignHeader.module.css";

type HeaderMode = "top" | "sticky";

const STICKY_AFTER_PX = 180;

const navigation = [
  { label: "Акция", href: "#key-points" },
  { label: "Как работает", href: "#workflow" },
  { label: "Кому подходит", href: "#delivery-scenarios" },
  { label: "Вопросы", href: "#faq" },
];

export function CampaignHeader({ holidayGarland = false }: { holidayGarland?: boolean }) {
  const [mode, setMode] = useState<HeaderMode>("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      setMode(window.scrollY >= STICKY_AFTER_PX ? "sticky" : "top");
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const desktop = window.matchMedia("(min-width: 769px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  function trapMenuFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const focusable = menuRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

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
              <button ref={menuButtonRef} className={styles.menuToggle} type="button" aria-label="Открыть меню" aria-expanded={menuOpen} aria-controls="campaign-mobile-menu" onClick={() => setMenuOpen(true)}>
                <img className={styles.menuIcon} src={publicAsset("/icons/header/icon-menu.svg")} alt="" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        {holidayGarland ? <HolidayGarland /> : null}
        {menuOpen ? (
          <div id="campaign-mobile-menu" ref={menuRef} className={styles.menuOverlay} role="dialog" aria-modal="true" aria-label="Меню" onKeyDown={trapMenuFocus}>
            <div className={styles.menuContent}>
              <div className={styles.menuTop}>
                <img className={styles.logo} src={publicAsset("/brand/logo-2gis.svg")} alt="2ГИС" />
                <button ref={closeButtonRef} className={styles.menuClose} type="button" aria-label="Закрыть меню" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }} />
              </div>
              <nav className={styles.menuNavigation} aria-label="Навигация по лендингу">
                {navigation.map(({ label, href }) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
              </nav>
              <a className={styles.menuAction} href="#connect" onClick={() => setMenuOpen(false)}>Подключить курьеров</a>
            </div>
          </div>
        ) : null}
      </header>
      <div className={styles.space} aria-hidden="true" />
    </>
  );
}
