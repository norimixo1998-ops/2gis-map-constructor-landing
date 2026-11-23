import { ImageFeatureCards, type ImageFeatureCardItem } from "../../components/image-feature-cards/ImageFeatureCards";

const withButton: ImageFeatureCardItem = {
  title: "Текст блока",
  description: "Описание в две или три строки",
  action: { label: "Текст кнопки", href: "#image-feature-cards-four" },
};

const withoutButton: ImageFeatureCardItem = {
  title: "Текст блока",
  description: "Описание в две или три строки",
};

export default function ImageFeatureCardsPreview() {
  return (
    <main>
      <ImageFeatureCards id="image-feature-cards-two" title="Заголовок" items={[withButton, withButton]} />
      <ImageFeatureCards id="image-feature-cards-four" title="Возможности продукта" items={[withoutButton, withoutButton, withoutButton, withoutButton]} />
    </main>
  );
}
