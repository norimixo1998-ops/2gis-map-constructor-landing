"use client";

import { useRef, useState, type CSSProperties } from "react";
import { useCardCarousel } from "../card-carousel/useCardCarousel";
import { publicAsset } from "../../lib/public-asset";
import styles from "./MainValues.module.css";

export type MainValueItem = {
  title: string;
  description: string;
  iconSrc?: string;
};

export type MainValuesProps = {
  items: MainValueItem[];
  title?: string;
  id?: string;
};

export function MainValues({ items, title, id = "main-values" }: MainValuesProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const carousel = useCardCarousel(styles.dragging);
  const [position, setPosition] = useState(0);
  const sliding = items.length > 3;

  if (items.length === 0) return null;

  function updatePosition() {
    const list = listRef.current;
    if (list) setPosition(list.scrollLeft);
  }

  function advance(direction: -1 | 1) {
    const list = listRef.current;
    const card = list?.querySelector<HTMLElement>(`li.${styles.item}`);
    if (!list || !card) return;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    list.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <section className={styles.section} id={id} aria-labelledby={title ? `${id}-title` : undefined} aria-label={title ? undefined : "Преимущества"}>
      {title || sliding ? (
        <div className={styles.heading}>
          {title ? <h2 id={`${id}-title`}>{title}</h2> : <span />}
          {sliding ? (
            <div className={styles.controls} aria-label="Управление карточками преимуществ">
              <button type="button" onClick={() => advance(-1)} disabled={position < 2} aria-label="Предыдущие преимущества">←</button>
              <button type="button" onClick={() => advance(1)} disabled={position >= (listRef.current ? listRef.current.scrollWidth - listRef.current.clientWidth - 2 : Infinity)} aria-label="Следующие преимущества">→</button>
            </div>
          ) : null}
        </div>
      ) : null}
      <ul
        ref={listRef}
        className={`${styles.list} ${sliding ? styles.slider : styles.grid} ${carousel.isDragging ? styles.dragging : ""}`}
        style={{ "--card-columns": Math.min(items.length, 3) } as CSSProperties}
        tabIndex={0}
        aria-label={title ?? "Преимущества"}
        onScroll={updatePosition}
        onPointerDown={carousel.onPointerDown}
        onPointerMove={carousel.onPointerMove}
        onPointerUp={carousel.onPointerUp}
        onPointerCancel={carousel.onPointerCancel}
        onClickCapture={carousel.onClickCapture}
        onDragStart={carousel.onDragStart}
      >
        {items.map((item, index) => (
          <li className={styles.item} key={`${item.title}-${index}`}>
            <div className={styles.card}>
              {item.iconSrc ? <img className={styles.icon} src={publicAsset(item.iconSrc)} width="96" height="96" alt="" /> : <span className={styles.iconPlaceholder} aria-hidden="true" />}
              <div className={styles.copy}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
