import type { HeroProps } from "../components/hero/Hero";
import type { HeroVariant2Props } from "../components/hero/HeroVariant2";
import type { MainValuesProps } from "../components/main-values/MainValues";
import type { SolvedTasksProps } from "../components/solved-tasks/SolvedTasks";
import type { IntermediateCtaProps } from "../components/intermediate-cta/IntermediateCta";
import type { TechnicalDemonstrationProps } from "../components/technical-demonstration/TechnicalDemonstration";
import type { StartWorkProps } from "../components/start-work/StartWork";
import type { FaqProps } from "../components/faq/Faq";
import type { LeadFormProps } from "../components/lead-form/LeadForm";

const constructorUrl = "https://makemap.2gis.ru/";
const heroTitle = "Конструктор карт 2ГИС для сайтов";
const heroDescription = "Карта с метками, линиями и областями для встраивания на сайт. Бесплатно и без программирования.";
const createMapAction = { kind: "primary", label: "Создать карту", href: constructorUrl } as const;
const documentationAction = { kind: "secondary", label: "Документация", href: "https://docs.2gis.com/" } as const;

export const hero: HeroProps = {
  title: heroTitle,
  description: heroDescription,
  actions: [createMapAction, documentationAction],
  media: {
    kind: "meaningful",
    alt: "Объёмная иллюстрация карты с метками и маршрутами",
    animation: "float",
    desktop: { src: "/images/hero/constructor-desktop.png", placement: "contain" },
    mobile: { src: "/images/hero/constructor-mobile.png", placement: "contain" },
  },
};

export const heroVariant2: HeroVariant2Props = {
  title: heroTitle,
  description: heroDescription,
  actions: [documentationAction, createMapAction],
  gridSrc: "/images/hero/variant-2/grid.png",
  glowSrc: "/images/hero/variant-2/light.png",
  mobileBackgroundSrc: "/images/hero/variant-2/mobile/grid-glow.png",
};

export const mainValues: MainValuesProps = {
  title: "Покажите на карте всё, что нужно вашим клиентам и посетителям",
  items: [
    { title: "Адреса и филиалы", description: "Отметьте офисы, магазины и пункты выдачи с названиями и пояснениями к каждой точке", iconSrc: "/images/benefits/main-values/constructor_2.png" },
    { title: "Как пройти или проехать", description: "Нарисуйте маршрут от остановки, обозначьте вход, парковку или место встречи на карте", iconSrc: "/images/benefits/main-values/constructor_3.png" },
    { title: "Территории и зоны", description: "Выделите зону обслуживания, территорию мероприятия или нужный участок с помощью фигур", iconSrc: "/images/benefits/main-values/constructor_1.png" },
  ],
};

export const solvedTasks: SolvedTasksProps = {
  id: "solved-tasks",
  title: "Все инструменты для создания карты",
  items: [
    { title: "Метки с информацией", description: "Добавьте отметки по адресу или на карте — с подписями и описаниями", imageSrc: "/images/solved-tasks/Constructor_desktop 1.png", mobileImageSrc: "/images/solved-tasks/Constructor_mobile%201.png", imageAlt: "Карта с метками и карточкой объекта" },
    { title: "Линии и области", description: "Рисуйте линии, круги, прямоугольники и многоугольники. Настраивайте цвет и оформление фигур", imageSrc: "/images/solved-tasks/Constructor_desktop 2.png", mobileImageSrc: "/images/solved-tasks/Constructor_mobile%202.png", imageAlt: "Линии и области на карте" },
    { title: "Объекты под контролем", description: "Выбирайте объекты в списке или на карте, меняйте настройки и порядок наложения", imageSrc: "/images/solved-tasks/Constructor_desktop 3.png", mobileImageSrc: "/images/solved-tasks/Constructor_mobile%203.png", imageAlt: "Редактирование объектов на карте" },
    { title: "Размер карты для сайта", description: "Настройте ширину и высоту карты и получите готовый код для вставки", imageSrc: "/images/solved-tasks/Изображение 4.png", mobileImageSrc: "/images/solved-tasks/Constructor_mobile%204.png", imageAlt: "Настройка размеров карты и код для встраивания" },
  ],
};

export const intermediateCta: IntermediateCtaProps = {
  title: "Карта 2ГИС на вашем сайте за несколько минут",
  primaryAction: { label: "Создать карту", href: constructorUrl },
  image: {
    desktop: "/images/intermediate-cta/desktop_image.png",
    mobile: "/images/intermediate-cta/mobile_image.png",
    alt: "",
  },
};

export const technicalDemonstration: TechnicalDemonstrationProps = {
  title: "Управляйте стилями карт и ключами в одном сервисе",
  description: "Редактор стилей и управление API-ключами доступны в Менеджере Платформы 2ГИС. Встроенная карта автоматически адаптируется под любой экран: десктоп, планшет или смартфон.",
  image: {
    desktop: "/images/technical-demonstration/demonstration block_desktop.png",
    mobile: "/images/technical-demonstration/image_mobile.png",
    alt: "Пример оформления карты на компьютере и смартфоне",
    layout: "showcase",
    ambientGlow: "rgb(31 120 46 / 22%)",
  },
};

export const startWork: StartWorkProps = {
  title: "От идеи до карты за несколько минут",
  items: [
    { heading: "Регистрация", text: "Создайте аккаунт в Менеджере Платформы 2ГИС для сохранения и управления картами" },
    { heading: "Найдите место", text: "Откройте Конструктор карт и выберите нужный адрес или объект" },
    { heading: "Нанесите объекты", text: "Добавьте метки, линии и области. Настройте подписи, описания и оформление." },
    { heading: "Вставьте карту", text: "Задайте размер, получите код и добавьте его в HTML страницы" },
  ],
  action: { label: "Открыть конструктор", href: constructorUrl },
};

export const faq: FaqProps = {
  title: "Вопросы и ответы",
  items: [
    { question: "Что такое Конструктор карт 2ГИС?", answer: "Бесплатный инструмент для создания карты с собственными объектами/ метками, линиями и областями. Готовую карту можно встроить в сайт без программирования." },
    { question: "Нужны ли знания программирования?", answer: "Нет. Создать карту и получить код можно без навыков разработки. Для размещения на сайте потребуется доступ к редактированию HTML или помощь администратора." },
    { question: "Как вставить готовую карту на сайт?", answer: "Нажмите «Получить код» в конструкторе, скопируйте его и добавьте в HTML-блок на странице." },
    { question: "Чем конструктор отличается от Редактора стилей?", answer: "Конструктор нужен для добавления своих объектов и встраивания карты на сайт, редактор стилей — для изменения внешнего вида базовой карты в продуктах, использующих API карт 2ГИС." },
  ],
};

export const leadForm: LeadFormProps = {
  title: "Расскажите о задаче — поможем её решить",
  productId: "map-constructor",
  productLabel: "Конструктор карт 2ГИС",
};
