# Изображение для Technical Demonstration

Лендинг Конструктора карт использует вариант `variant: "framed"` с рамой по образцу второго Hero. Файл `API key_desktop.png` уже подключён в `content/map-constructor.ts` у `technicalDemonstration`:

```ts
image: {
  desktop: "/images/technical-demonstration/API key_desktop.png",
  mobile: "/images/technical-demonstration/API key_mobile.png",
  alt: "Описание изображения",
},
```

На широком экране внутренний слот — 1048 × 649 px. Текущий десктопный файл — 3012 × 1868 px, почти той же пропорции; кадрирование по высоте менее 0,2%. Мобильный файл — 1212 × 1280 px; при ширине экрана 375 px внешняя рама — 303 × 320 px, внутренний слот — 293 × 315 px. Изображение заполняет слот с `object-fit: cover`: другой формат может обрезаться. Рама: 12 px сверху и по бокам на десктопе, 5 px на мобильном, без нижнего борта и нижних скруглений.

`Glow (2).png` подключён в `content/map-constructor.ts` через `glowSrc` как отдельный приглушённый слой позади рамы. Он не входит в файл изображения и не должен быть запечён в новый мобильный ассет.

Файлы `demonstration block_desktop.png` и `image_mobile.png` остались здесь для прежнего варианта `layout: "showcase"` с запечённым свечением. Их специфичные `layout` и `ambientGlow` не нужны новому изображению Конструктора карт.
