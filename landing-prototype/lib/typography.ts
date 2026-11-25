import Typograf from "typograf";

const typograf = new Typograf({ locale: "ru" });

// New block types can add copy fields without changing this helper. Technical
// fields keep their exact source values, including links and asset paths.
const structuralFields = new Set([
  "id",
  "key",
  "name",
  "type",
  "kind",
  "href",
  "src",
  "srcSet",
  "desktop",
  "mobile",
  "mobileSrc",
  "imageSrc",
  "mobileImageSrc",
  "iconSrc",
  "gridSrc",
  "glowSrc",
  "mobileBackgroundSrc",
  "productId",
  "value",
  "target",
  "placement",
  "position",
  "layout",
  "orientation",
  "animation",
  "ambientGlow",
  "className",
]);

function isCopy(value: string, key: string): boolean {
  return !structuralFields.has(key)
    && !/^(?:https?:|mailto:|tel:|\/|\.\/|\.\.\/|#)/i.test(value);
}

export function typographContent<T>(content: T): T {
  function transform(value: unknown, key = ""): unknown {
    if (Array.isArray(value)) return value.map((item) => transform(item));

    if (value !== null && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([field, item]) => [field, transform(item, field)]),
      );
    }

    return typeof value === "string" && isCopy(value, key)
      ? typograf.execute(value)
      : value;
  }

  return transform(content) as T;
}
