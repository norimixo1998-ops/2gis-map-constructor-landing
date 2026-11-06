import { StartWork } from "../../components/start-work/StartWork";

const action = { label: "В кабинет", href: "https://platform.2gis.ru/" };

export default function StartWorkPreview() {
  return (
    <main>
      <StartWork
        id="start-work-three"
        title="Как начать работу — без заголовков в карточках"
        items={Array.from({ length: 3 }, (_, index) => ({ text: "Текст блока", ...(index === 0 ? { action } : {}) }))}
      />
      <StartWork
        id="start-work-six"
        title="Как начать работу — с заголовками в карточках"
        items={Array.from({ length: 6 }, (_, index) => ({ heading: "Текст блока", text: "Текст блока", ...(index === 0 ? { action } : {}) }))}
      />
    </main>
  );
}
