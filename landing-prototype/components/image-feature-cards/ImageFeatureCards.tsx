import styles from "./ImageFeatureCards.module.css";
import { publicAsset } from "../../lib/public-asset";
import { actionLinkProps } from "../../lib/action-link";

export type ImageFeatureCardItem = {
  title: string;
  description: string;
  imageSrc?: string;
  mobileImageSrc?: string;
  imageAlt?: string;
  action?: { label: string; href: string; target?: "_self" | "_blank" };
};

export type ImageFeatureCardsProps = {
  id: string;
  title?: string;
  items: readonly [ImageFeatureCardItem, ImageFeatureCardItem] | readonly [ImageFeatureCardItem, ImageFeatureCardItem, ImageFeatureCardItem, ImageFeatureCardItem];
};

export function ImageFeatureCards({ id, title, items }: ImageFeatureCardsProps) {
  return (
    <section className={styles.section} id={id} aria-labelledby={title ? `${id}-title` : undefined} aria-label={title ? undefined : "Возможности продукта"}>
      {title ? <h2 className={styles.heading} id={`${id}-title`}>{title}</h2> : null}
      <ul className={styles.grid}>
        {items.map((item, index) => (
          <li className={styles.card} key={`${item.title}-${index}`}>
            <div className={styles.media}>
              {item.imageSrc ? (
                <picture>
                  {item.mobileImageSrc && <source media="(max-width: 699px)" srcSet={publicAsset(item.mobileImageSrc)} />}
                  <img src={publicAsset(item.imageSrc)} alt={item.imageAlt ?? ""} width="568" height="320" />
                </picture>
              ) : (
                <span className={styles.placeholder} aria-hidden="true">Изображение</span>
              )}
            </div>
            <div className={styles.body}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.action ? (
                <a className={styles.action} href={item.action.href} {...actionLinkProps(item.action.href, item.action.target)}>
                  {item.action.label}
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
