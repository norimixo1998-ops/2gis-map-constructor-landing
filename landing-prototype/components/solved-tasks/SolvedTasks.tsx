import styles from "./SolvedTasks.module.css";
import { publicAsset } from "../../lib/public-asset";
import { actionLinkProps } from "../../lib/action-link";

export type SolvedTaskItem = {
  title: string;
  description: string;
  imageSrc?: string;
  mobileImageSrc?: string;
  imageAlt?: string;
  action?: { label: string; href: string; target?: "_self" | "_blank" };
};

export type SolvedTasksProps = {
  id: string;
  title?: string;
  items: readonly [SolvedTaskItem, SolvedTaskItem] | readonly [SolvedTaskItem, SolvedTaskItem, SolvedTaskItem, SolvedTaskItem];
};

export function SolvedTasks({ id, title, items }: SolvedTasksProps) {
  return (
    <section className={styles.section} id={id} aria-labelledby={title ? `${id}-title` : undefined} aria-label={title ? undefined : "Решаемые задачи"}>
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
