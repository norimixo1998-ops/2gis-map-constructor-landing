export type ActionTarget = "_self" | "_blank";

export function actionLinkProps(href: string, target?: ActionTarget) {
  const resolvedTarget = target ?? (href.startsWith("#") ? "_self" : "_blank");

  return {
    target: resolvedTarget,
    rel: resolvedTarget === "_blank" ? "noopener noreferrer" : undefined,
  };
}
