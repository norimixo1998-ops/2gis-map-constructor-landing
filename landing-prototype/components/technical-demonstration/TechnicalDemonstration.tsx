import type { CSSProperties } from "react";
import { publicAsset } from "../../lib/public-asset";
import styles from "./TechnicalDemonstration.module.css";

export type TechnicalDemonstrationProps = {
  id?: string;
  title: string;
  description?: string;
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
  image,
}: TechnicalDemonstrationProps) {
  const isShowcase = image?.layout === "showcase";

  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <div className={styles.card}>
        <div className={styles.copy}>
          <h2 id={`${id}-title`}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <div
          className={`${styles.media} ${isShowcase ? styles.showcase : ""} ${isShowcase && image?.ambientGlow ? styles.withGlow : ""}`}
          style={isShowcase && image?.ambientGlow ? ({ "--ambient-glow": image.ambientGlow } as CSSProperties) : undefined}
        >
          {image ? (
            <picture>
              {image.mobile && <source media="(max-width: 699px)" srcSet={publicAsset(image.mobile)} />}
              <img src={publicAsset(image.desktop)} alt={image.alt} />
            </picture>
          ) : (
            <span className={styles.placeholder}>Изображение</span>
          )}
        </div>
      </div>
    </section>
  );
}
