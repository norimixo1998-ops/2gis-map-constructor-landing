import styles from "./AudienceScenarios.module.css";

export type AudienceScenariosProps = {
  id?: string;
  title?: string;
  description?: string;
  panelTitle?: string;
  items: string[];
  image?: { src: string; alt: string };
};

/** Optional B03 block. The brief decides whether it appears on a page. */
export function AudienceScenarios({ id = "audiences", title, description, panelTitle, items, image }: AudienceScenariosProps) {
  if (items.length === 0) return null;

  return (
    <section className={styles.section} id={id} aria-labelledby={title ? `${id}-title` : undefined} aria-label={title ? undefined : panelTitle ?? "Для кого"}>
      {title || description ? (
        <div className={styles.heading}>
          {title ? <h2 id={`${id}-title`}>{title}</h2> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}
      <div className={styles.panel}>
        <div className={styles.copy}>
          {panelTitle ? <h3>{panelTitle}</h3> : null}
          <ul className={styles.tags}>
            {items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className={styles.media}>
          {image ? <img src={image.src} alt={image.alt} /> : <span>Изображение</span>}
        </div>
      </div>
    </section>
  );
}
