"use client";

import { useCardCarousel } from "../card-carousel/useCardCarousel";
import { publicAsset } from "../../lib/public-asset";
import styles from "./Reasons.module.css";

export type ReasonItem = {
  text: string;
  iconSrc: string;
  href?: string;
  target?: "_blank" | "_self";
};

export type ReasonsProps = {
  title: string;
  items: ReasonItem[];
  id?: string;
};

export function Reasons({ title, items, id = "reasons" }: ReasonsProps) {
  const carousel = useCardCarousel(styles.dragging);

  if (items.length === 0) return null;

  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <ul
        className={`${styles.list} ${carousel.isDragging ? styles.dragging : ""}`}
        tabIndex={0}
        aria-label={`${title}: горизонтальная прокрутка карточек на узком экране`}
        onPointerDown={carousel.onPointerDown}
        onPointerMove={carousel.onPointerMove}
        onPointerUp={carousel.onPointerUp}
        onPointerCancel={carousel.onPointerCancel}
        onClickCapture={carousel.onClickCapture}
        onDragStart={carousel.onDragStart}
      >
        {items.map((item, index) => {
          const content = (
            <>
              <span className={styles.cardTop}>
                <img className={styles.icon} src={publicAsset(item.iconSrc)} width="96" height="96" alt="" />
                {item.href ? (
                  <span className={styles.arrow} aria-hidden="true">
                    <img src={publicAsset("/icons/footer/Arrow-right-corner.svg")} width="20" height="20" alt="" />
                  </span>
                ) : null}
              </span>
              <span className={styles.text}>{item.text}</span>
            </>
          );

          return (
            <li className={styles.item} key={`${item.text}-${index}`}>
              {item.href ? (
                <a className={`${styles.card} ${styles.cardLink}`} href={item.href} target={item.target} rel={item.target === "_blank" ? "noopener noreferrer" : undefined}>
                  {content}
                </a>
              ) : (
                <div className={styles.card}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
