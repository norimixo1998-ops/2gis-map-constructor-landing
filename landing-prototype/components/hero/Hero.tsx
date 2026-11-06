import type { CSSProperties } from "react";
import { publicAsset } from "../../lib/public-asset";
import styles from "./Hero.module.css";

export type HeroAction<Kind extends "primary" | "secondary"> = {
  kind: Kind;
  label: string;
  href: string;
  target?: "_self" | "_blank";
};

export type HeroVisualSource = {
  src: string;
  placement: "contain" | "cover";
  position?: string; // only for a specifically approved crop
};

type HeroMediaBase = {
  desktop: HeroVisualSource;
  mobile?: HeroVisualSource; // absent: desktop file and placement are reused
  animation?: "float";
};

export type HeroMedia = HeroMediaBase & (
  | { kind: "decorative"; alt: "" }
  | { kind: "meaningful"; alt: string }
);

type HeroBase = {
  title: string;
  titleBreakAfter?: string; // optional soft wrap hint; does not force a line break
  description: string;
  actions: [HeroAction<"primary">] | [HeroAction<"secondary">, HeroAction<"primary">] | [HeroAction<"primary">, HeroAction<"secondary">];
  media: HeroMedia;
};

export type HeroProps = HeroBase;

const breakpoint = 992;

function HeroImage({ media }: { media: HeroMedia }) {
  if (media.kind === "meaningful" && !media.alt.trim()) {
    throw new Error("A meaningful Hero visual requires a non-empty alt description.");
  }
  const imageStyle = {
    "--desktop-fit": media.desktop.placement,
    "--mobile-fit": media.mobile?.placement ?? media.desktop.placement,
    "--desktop-position": media.desktop.position ?? "center",
    "--mobile-position": media.mobile?.position ?? media.desktop.position ?? "center",
  } as CSSProperties;

  return (
    <picture className={`${styles.picture} ${media.animation === "float" ? styles.float : ""}`}>
      {media.mobile && (
        <source media={`(max-width: ${breakpoint - 1}px)`} srcSet={publicAsset(media.mobile.src)} />
      )}
      <img src={publicAsset(media.desktop.src)} alt={media.alt} style={imageStyle} />
    </picture>
  );
}

export function Hero({ title, titleBreakAfter, description, actions, media }: HeroProps) {
  const breakIndex = titleBreakAfter ? title.indexOf(titleBreakAfter) : -1;
  const titleContent = breakIndex >= 0 && titleBreakAfter ? (
    <>
      {title.slice(0, breakIndex + titleBreakAfter.length)}
      <wbr />
      {title.slice(breakIndex + titleBreakAfter.length)}
    </>
  ) : title;

  return (
    <section className={styles.hero}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <div className={styles.text}>
            <h1>{titleContent}</h1>
            <p>{description}</p>
          </div>
          <div className={styles.actions}>
            {actions.map((action) => (
              <a
                key={action.kind}
                className={`${styles.action} ${action.kind === "primary" ? styles.primary : styles.secondary}`}
                href={action.href}
                target={action.target ?? "_self"}
                rel={action.target === "_blank" ? "noopener noreferrer" : undefined}
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.visual}>
          <HeroImage media={media} />
        </div>
      </div>
    </section>
  );
}
