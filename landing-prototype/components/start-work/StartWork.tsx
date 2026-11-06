"use client";

import type { CSSProperties } from "react";
import { useCardCarousel } from "../card-carousel/useCardCarousel";
import styles from "./StartWork.module.css";

export type StartWorkItem = ({
  heading: string;
  text?: string;
} | {
  heading?: never;
  text: string;
}) & {
  action?: { label: string; href: string; target?: "_blank" | "_self" };
};

export type StartWorkProps = {
  title: string;
  items: StartWorkItem[];
  id?: string;
  action?: { label: string; href: string; target?: "_blank" | "_self" };
};

export function StartWork({ title, items, id = "start-work", action }: StartWorkProps) {
  const carousel = useCardCarousel(styles.dragging);
  if (items.length === 0) return null;

  const columns = items.length <= 4 ? items.length : 3;

  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <ul
        className={`${styles.list} ${carousel.isDragging ? styles.dragging : ""}`}
        style={{ "--card-columns": columns } as CSSProperties}
        tabIndex={0}
        aria-label={`${title}: горизонтальная прокрутка карточек на узком экране`}
        onPointerDown={carousel.onPointerDown}
        onPointerMove={carousel.onPointerMove}
        onPointerUp={carousel.onPointerUp}
        onPointerCancel={carousel.onPointerCancel}
        onClickCapture={carousel.onClickCapture}
        onDragStart={carousel.onDragStart}
      >
        {items.map((item, index) => (
          <li className={styles.item} key={`${index}-${item.heading ?? item.text}`}>
            <div className={styles.card}>
              <div className={styles.content}>
                {item.heading && <h3 className={styles.heading}>{item.heading}</h3>}
                {item.text && <p className={styles.text}>{item.text}</p>}
              </div>
              <div className={styles.bottom}>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                {item.action ? (
                  <a
                    className={styles.action}
                    href={item.action.href}
                    target={item.action.target}
                    rel={item.action.target === "_blank" ? "noopener noreferrer" : undefined}
                  >
                    {item.action.label}
                  </a>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {action ? (
        <a className={styles.sectionAction} href={action.href} target={action.target} rel={action.target === "_blank" ? "noopener noreferrer" : undefined}>
          {action.label}
        </a>
      ) : null}
    </section>
  );
}
