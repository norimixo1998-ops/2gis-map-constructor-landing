"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { publicAsset } from "../../lib/public-asset";
import styles from "./DeliveryScenarios.module.css";

export type DeliveryScenario = { title: string; short: string; color: string; situation: string; automation: string };
export type DeliveryScenariosProps = { id?: string; title: string; titleBreakBefore?: string; description?: string; items: DeliveryScenario[] };

export function DeliveryScenarios({ id = "delivery-scenarios", title, titleBreakBefore, description, items }: DeliveryScenariosProps) {
  const [active, setActive] = useState(0);
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [singleLineTitles, setSingleLineTitles] = useState<boolean[]>([]);

  useLayoutEffect(() => {
    const measure = () => {
      const next = items.map((_, index) => {
        const element = titleRefs.current[index];
        if (!element || element.offsetHeight === 0) return false;
        const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);
        return element.getBoundingClientRect().height <= lineHeight + 1;
      });
      setSingleLineTitles((current) => current.length === next.length && current.every((value, index) => value === next[index]) ? current : next);
    };

    const observer = new ResizeObserver(measure);
    titleRefs.current.slice(0, items.length).forEach((element) => { if (element) observer.observe(element); });
    measure();
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;
  const selected = Math.min(active, items.length - 1);
  const breakAt = titleBreakBefore ? title.indexOf(titleBreakBefore) : -1;
  return <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`}>{breakAt < 0 ? title : <>{title.slice(0, breakAt)}<br className={styles.desktopBreak} />{title.slice(breakAt)}</>}</h2>
    {description ? <p className={styles.description}>{description}</p> : null}
    <div className={styles.panels}>
      {items.map((item, index) => <article className={`${styles.panel} ${selected === index ? styles.active : ""}`} key={`${index}-${item.title}`} style={{ "--accent": item.color } as React.CSSProperties}>
        <button className={`${styles.trigger} ${selected !== index && singleLineTitles[index] ? styles.singleLine : ""}`} type="button" onClick={() => setActive(index)} aria-expanded={selected === index} aria-controls={`${id}-scenario-${index}`}>
          <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.verticalTitle}>{item.title}</span>
          <span className={styles.horizontalTitle} ref={(element) => { titleRefs.current[index] = element; }}>{item.title}</span>
          <span className={styles.chevron} aria-hidden="true"><img src={publicAsset("/icons/header/chevron-down-small-stroke.svg")} alt="" /></span>
        </button>
        <div className={styles.body} id={`${id}-scenario-${index}`} inert={selected !== index}>
          <div className={styles.bodyInner}>
            <span className={styles.counter}>Сценарий {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <div className={styles.detail}><span>Ситуация</span><p>{item.situation}</p></div>
            <div className={styles.detail}><span>Автоматизация</span><p>{item.automation}</p></div>
          </div>
        </div>
      </article>)}
    </div>
    <div className={styles.navigation} aria-label="Переключить сценарий">
      <span className={styles.progress}>{String(selected + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
      <div className={styles.dots}>{items.map((item, index) => <button key={`${index}-${item.title}`} type="button" className={index === selected ? styles.selectedDot : ""} onClick={() => setActive(index)} aria-label={`Показать сценарий: ${item.title}`} aria-current={index === selected ? "true" : undefined}><span /></button>)}</div>
      <span className={styles.currentName}>{items[selected].short}</span>
    </div>
  </section>;
}
