import { IconFeatureCards, type IconFeatureCardItem } from "../../components/icon-feature-cards/IconFeatureCards";

const icons = ["route-mini-map", "map-pins", "clock", "tuning-right", "layers"] as const;

const items: IconFeatureCardItem[] = icons.map((icon, index) => ({
  title: index === 2 ? "Описание" : "Заголовок",
  description: "Описание",
  iconSrc: `/images/icon-feature-cards/${icon}.svg`,
}));

const longItems: IconFeatureCardItem[] = items.map((item, index) => ({
  ...item,
  description: index === 1
    ? "Длинное описание возможности в несколько строк: оно показывает, как вся строка карточек увеличивается по самой высокой карточке, а иконки остаются у нижнего края. Между описанием и иконкой сохраняется свободное место."
    : "Короткое описание возможности.",
}));

const cta = {
  title: "Текст",
  primaryAction: { label: "Кнопка", href: "#single-action" },
  secondaryAction: { label: "Кнопка", href: "#without-cta" },
};

export default function IconFeatureCardsPreview() {
  return (
    <main>
      <IconFeatureCards id="icon-feature-cards" items={items} cta={cta} />
      <IconFeatureCards id="long-copy" title="Проверка длинного текста" items={longItems} cta={cta} />
      <IconFeatureCards id="single-action" title="CTA с одной кнопкой" items={items} cta={{ title: "Текст", primaryAction: { label: "Кнопка", href: "#without-cta" } }} />
      <IconFeatureCards id="without-cta" title="Без CTA" items={items} />
    </main>
  );
}
