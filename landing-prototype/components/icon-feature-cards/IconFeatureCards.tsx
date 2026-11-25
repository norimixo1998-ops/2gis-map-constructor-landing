"use client";

import { actionLinkProps } from "../../lib/action-link";
import { publicAsset } from "../../lib/public-asset";
import { useCardCarousel } from "../card-carousel/useCardCarousel";
import styles from "./IconFeatureCards.module.css";

export type IconFeatureCardItem = {
  title: string;
  description: string;
  iconSrc: string;
};

export type IconFeatureCardAction = {
  label: string;
  href: string;
  target?: "_self" | "_blank";
};

export type IconFeatureCardsProps = {
  id: string;
  title?: string;
  items: readonly IconFeatureCardItem[];
  cta?: {
    title: string;
    primaryAction: IconFeatureCardAction;
    secondaryAction?: IconFeatureCardAction;
  };
};

export function IconFeatureCards({ id, title, items, cta }: IconFeatureCardsProps) {
  const carousel = useCardCarousel(styles.dragging);
  const sliding = items.length + (cta ? 1 : 0) >= 3;

  if (items.length === 0) return null;

  const grid = (
    <ul
        className={`${styles.grid} ${cta ? "" : styles.gridWithoutCta} ${sliding ? styles.mobileCarousel : ""} ${carousel.isDragging ? styles.dragging : ""}`}
        tabIndex={sliding ? 0 : undefined}
        aria-label={sliding ? `${title ?? "Возможности продукта"}: горизонтальная прокрутка карточек на узком экране` : undefined}
        onPointerDown={carousel.onPointerDown}
        onPointerMove={carousel.onPointerMove}
        onPointerUp={carousel.onPointerUp}
        onPointerCancel={carousel.onPointerCancel}
        onClickCapture={carousel.onClickCapture}
        onDragStart={carousel.onDragStart}
      >
        {items.map((item, index) => (
          <li className={styles.card} key={`${item.title}-${index}`}>
            <div className={styles.copy}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <div className={styles.iconSlot}><img src={publicAsset(item.iconSrc)} alt="" width="48" height="48" /></div>
          </li>
        ))}
        {cta ? (
          <li className={`${styles.card} ${styles.cta}`}>
            <h3>{cta.title}</h3>
            <div className={styles.actions}>
              <a className={styles.primaryAction} href={cta.primaryAction.href} {...actionLinkProps(cta.primaryAction.href, cta.primaryAction.target)}>{cta.primaryAction.label}</a>
              {cta.secondaryAction ? (
                <a className={styles.secondaryAction} href={cta.secondaryAction.href} {...actionLinkProps(cta.secondaryAction.href, cta.secondaryAction.target)}>{cta.secondaryAction.label}</a>
              ) : null}
            </div>
          </li>
        ) : null}
    </ul>
  );

  return (
    <section className={styles.section} id={id} aria-labelledby={title ? `${id}-title` : undefined} aria-label={title ? undefined : "Возможности продукта"}>
      {title ? <h2 className={styles.heading} id={`${id}-title`}>{title}</h2> : null}
      {grid}
    </section>
  );
}
