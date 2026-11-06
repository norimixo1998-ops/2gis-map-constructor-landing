import { MainValues, type MainValueItem } from "../../components/main-values/MainValues";

const items: MainValueItem[] = Array.from({ length: 5 }, (_, index) => ({
  title: `Преимущество ${index + 1}`,
  description: "Описание пункта в блоке",
}));

export default function MainValuesPreview() {
  return (
    <main>
      <MainValues id="main-values-three" items={items.slice(0, 3)} />
      <MainValues id="main-values-four" title="Заголовок" items={items.slice(0, 4)} />
      <MainValues id="main-values-five" title="Заголовок" items={items} />
    </main>
  );
}
