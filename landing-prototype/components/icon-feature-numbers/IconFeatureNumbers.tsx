import { publicAsset } from "../../lib/public-asset";
import type { IconFeatureCardItem } from "../icon-feature-cards/IconFeatureCards";
import styles from "./IconFeatureNumbers.module.css";

export type IconFeatureNumbersProps = {
  id: string;
  title: string;
  items: readonly [IconFeatureCardItem, IconFeatureCardItem, IconFeatureCardItem];
  metrics: readonly [{ value: string; label: string }, { value: string; label: string }];
  note: string;
};

export function IconFeatureNumbers({ id, title, items, metrics, note }: IconFeatureNumbersProps) {
  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <h2 className={styles.heading} id={`${id}-title`}>{title}</h2>
      <div className={styles.layout}>
        <ul className={styles.cards}>
          {items.map((item, index) => (
            <li className={styles.card} key={`${item.title}-${index}`}>
              <div className={styles.copy}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className={styles.iconSlot}><img src={publicAsset(item.iconSrc)} alt="" width="48" height="48" /></div>
            </li>
          ))}
        </ul>
        <aside className={styles.numbers} aria-label="Показатели и условия">
          <div className={styles.metrics}>
            {metrics.map((metric) => (
              <div className={styles.metric} key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
          <p className={styles.note}>{note}</p>
        </aside>
      </div>
    </section>
  );
}
