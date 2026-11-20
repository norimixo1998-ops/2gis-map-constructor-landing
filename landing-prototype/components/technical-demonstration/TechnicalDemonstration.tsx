import type { CSSProperties } from "react";
import { actionLinkProps, type ActionTarget } from "../../lib/action-link";
import { publicAsset } from "../../lib/public-asset";
import styles from "./TechnicalDemonstration.module.css";

export type TechnicalDemonstrationProps = {
  id?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string; target?: ActionTarget };
  variant?: "framed";
  glowSrc?: string;
  image?: {
    desktop: string;
    mobile?: string;
    alt: string;
    layout?: "showcase";
    ambientGlow?: string;
  };
};

export function TechnicalDemonstration({
  id = "technical-demonstration",
  title,
  description,
  action,
  variant,
  glowSrc,
  image,
}: TechnicalDemonstrationProps) {
  const isFramed = variant === "framed";
  const isShowcase = image?.layout === "showcase";
  const awaitingMobile = isFramed && Boolean(image) && !image?.mobile;
  const visual = image ? (
    <picture>
      {image.mobile && <source media="(max-width: 699px)" srcSet={encodeURI(publicAsset(image.mobile))} />}
      <img src={publicAsset(image.desktop)} alt={image.alt} />
    </picture>
  ) : (
    <span className={styles.placeholder}>Изображение</span>
  );

  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <div
        className={`${styles.card} ${isFramed && glowSrc ? styles.glowingCard : ""}`}
        style={isFramed && glowSrc ? ({ "--technical-glow": `url("${publicAsset(glowSrc)}")` } as CSSProperties) : undefined}
      >
        <div className={`${styles.copy} ${isFramed ? styles.framedCopy : ""}`}>
          <div className={isFramed ? styles.headingWrap : undefined}>
            <h2 id={`${id}-title`}>{title}</h2>
          </div>
          {(description || action) && <div className={styles.summaryRow}>
            {description && <p>{description}</p>}
            {action && <a className={styles.action} href={action.href} {...actionLinkProps(action.href, action.target)}>{action.label}</a>}
          </div>}
        </div>
        <div
          className={`${styles.media} ${isFramed ? styles.framed : ""} ${awaitingMobile ? styles.awaitingMobile : ""} ${!image && !isFramed ? styles.emptyMedia : ""} ${!isFramed && isShowcase ? styles.showcase : ""} ${!isFramed && isShowcase && image?.ambientGlow ? styles.withGlow : ""}`}
          style={isShowcase && image?.ambientGlow ? ({ "--ambient-glow": image.ambientGlow } as CSSProperties) : undefined}
        >
          {isFramed ? <div className={styles.frame}><div className={styles.imageSlot}>{visual}{awaitingMobile && <span className={styles.mobilePlaceholder}>Изображение для мобильной версии</span>}</div></div> : visual}
        </div>
      </div>
    </section>
  );
}
