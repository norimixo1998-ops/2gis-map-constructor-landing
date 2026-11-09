import type { CSSProperties } from "react";
import { publicAsset } from "../../lib/public-asset";
import type { HeroAction } from "./Hero";
import styles from "./HeroVariant2.module.css";

export type HeroVariant2Props = {
  title: string;
  description: string;
  actions: [HeroAction<"primary">] | [HeroAction<"secondary">, HeroAction<"primary">];
  image?: { src: string; mobileSrc?: string; alt: string };
  gridSrc?: string;
  glowSrc?: string;
  mobileBackgroundSrc?: string;
};

export function HeroVariant2({ title, description, actions, image, gridSrc, glowSrc, mobileBackgroundSrc }: HeroVariant2Props) {
  const assetStyles = {
    ...(gridSrc ? { "--hero-grid": `url("${publicAsset(gridSrc)}")` } : {}),
    ...(glowSrc ? { "--hero-glow": `url("${publicAsset(glowSrc)}")` } : {}),
  } as CSSProperties;

  return (
    <section className={styles.hero} style={assetStyles} aria-labelledby="hero-variant-2-title">
      <div className={`${styles.grid} ${gridSrc ? styles.assetGrid : ""}`} aria-hidden="true" />
      <div className={styles.content}>
        <div className={`${styles.glow} ${glowSrc ? styles.assetGlow : ""}`} aria-hidden="true" />
        <div className={`${styles.mobileBackground} ${mobileBackgroundSrc ? styles.assetMobileBackground : ""}`} aria-hidden="true">
          {mobileBackgroundSrc && <img src={publicAsset(mobileBackgroundSrc)} alt="" />}
        </div>
        <div className={styles.copy}>
          <h1 id="hero-variant-2-title">{title}</h1>
          <p>{description}</p>
        </div>
        <div className={styles.visual}>
          <div className={styles.frame}>
            <div className={styles.imageSlot}>
              {image ? (
                <picture>
                  {image.mobileSrc && <source media="(max-width: 767px)" srcSet={publicAsset(image.mobileSrc)} />}
                  <img src={publicAsset(image.src)} alt={image.alt} />
                </picture>
              ) : <span>Изображение</span>}
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          {actions.map((action) => (
            <a
              key={action.kind}
              className={`${styles.action} ${action.kind === "primary" ? styles.primary : styles.secondary}`}
              href={action.href}
              target={action.target ?? "_self"}
              rel={action.target === "_blank" ? "noopener noreferrer" : undefined}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
