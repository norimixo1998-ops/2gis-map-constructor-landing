import { HeroVariant2 } from "../../components/hero/HeroVariant2";

export default function HeroVariant2Preview() {
  return (
    <main>
      <HeroVariant2
        title="Заголовок"
        description="Описание"
        actions={[
          { kind: "secondary", label: "Кнопка", href: "#secondary" },
          { kind: "primary", label: "Кнопка", href: "#primary" },
        ]}
        gridSrc="/images/hero/variant-2/grid.png"
        glowSrc="/images/hero/variant-2/light.png"
        mobileBackgroundSrc="/images/hero/variant-2/mobile/grid-glow.png?v=40a7d3bf"
      />
    </main>
  );
}
