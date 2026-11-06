"use client";

import { useId, useState } from "react";
import styles from "./Faq.module.css";

export type FaqItem = {
  question: string;
  answer: string;
  links?: { label: string; href: string }[];
};

export type FaqProps = {
  title: string;
  items: FaqItem[];
  id?: string;
  defaultOpenIndex?: number | null;
};

function FaqEntry({ item, initiallyOpen }: { item: FaqItem; initiallyOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const answerId = useId();

  return (
    <div className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
      <button
        className={styles.question}
        type="button"
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{item.question}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </button>
      <div className={styles.answer} id={answerId} aria-hidden={!isOpen} inert={!isOpen}>
        <div className={styles.answerInner}>
          <div className={styles.answerContent}>
            <p>{item.answer}</p>
            {item.links?.length ? (
              <div className={styles.links}>
                {item.links.map((link) => <a href={link.href} key={`${link.label}-${link.href}`}>{link.label}</a>)}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Faq({ title, items, id = "faq", defaultOpenIndex = 0 }: FaqProps) {
  if (items.length === 0) return null;

  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <div className={styles.list}>
        {items.map((item, index) => (
          <FaqEntry item={item} initiallyOpen={index === defaultOpenIndex} key={`${item.question}-${index}`} />
        ))}
      </div>
    </section>
  );
}
