import styles from "./ProductDemonstration.module.css";
import { publicAsset } from "../../lib/public-asset";

export type ProductDemonstrationProps = {
  id?: string;
  title?: string;
  background?: {
    desktop: string;
    mobile?: string;
  };
  image?: {
    desktop: string;
    mobile?: string;
    alt: string;
  };
};

export function ProductDemonstration({ id = "product-demonstration", title, background, image }: ProductDemonstrationProps) {
  const hasTitle = Boolean(title?.trim());

  return (
    <section className={`${styles.section}${hasTitle ? "" : ` ${styles.withoutTitle}`}`} id={id} aria-labelledby={hasTitle ? `${id}-title` : undefined} aria-label={hasTitle ? undefined : "Демонстрация продукта"}>
      {background && (
        <picture className={styles.background} aria-hidden="true">
          {background.mobile && <source media="(max-width: 699px)" srcSet={publicAsset(background.mobile)} />}
          <img src={publicAsset(background.desktop)} alt="" />
        </picture>
      )}
      <div className={styles.content}>
        {hasTitle && <div className={styles.headingArea}>
          <h2 className={styles.heading} id={`${id}-title`}>{title}</h2>
        </div>}
        <div className={styles.screen}>
          <div className={styles.screenInset}>
            {image ? (
              <picture>
                {image.mobile && <source media="(max-width: 699px)" srcSet={publicAsset(image.mobile)} />}
                <img className={styles.image} src={publicAsset(image.desktop)} alt={image.alt} />
              </picture>
            ) : (
              <span className={styles.placeholder}>Изображение</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
