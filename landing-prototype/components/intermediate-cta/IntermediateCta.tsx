import styles from "./IntermediateCta.module.css";
import { publicAsset } from "../../lib/public-asset";
import { actionLinkProps } from "../../lib/action-link";

export type IntermediateCtaAction = {
  label: string;
  href: string;
  mobileLabel?: string;
  target?: "_self" | "_blank";
};

export type IntermediateCtaProps = {
  id?: string;
  title: string;
  description?: string;
  primaryAction: IntermediateCtaAction;
  secondaryAction?: IntermediateCtaAction;
  image?: { desktop: string; mobile?: string; alt: string };
};

export function IntermediateCta({
  id = "intermediate-cta",
  title,
  description,
  primaryAction,
  secondaryAction,
  image,
}: IntermediateCtaProps) {
  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <div className={styles.card}>
        <div className={styles.copy}>
          <h2 id={`${id}-title`}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <div className={styles.visual}>
          {image ? (
            <picture>
              {image.mobile && <source media="(max-width: 899px)" srcSet={publicAsset(image.mobile)} />}
              <img src={publicAsset(image.desktop)} alt={image.alt} />
            </picture>
          ) : (
            <span className={styles.placeholder} aria-hidden="true">Изображение</span>
          )}
        </div>
        <div className={styles.actions}>
          <a className={`${styles.action} ${styles.primary}`} href={primaryAction.href} {...actionLinkProps(primaryAction.href, primaryAction.target)}>
            <span className={styles.desktopLabel}>{primaryAction.label}</span>
            <span className={styles.mobileLabel}>{primaryAction.mobileLabel ?? primaryAction.label}</span>
          </a>
          {secondaryAction && <a className={`${styles.action} ${styles.secondary}`} href={secondaryAction.href} {...actionLinkProps(secondaryAction.href, secondaryAction.target)}>
            {secondaryAction.label}
          </a>}
        </div>
      </div>
    </section>
  );
}
