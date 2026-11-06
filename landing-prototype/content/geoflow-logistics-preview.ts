import type { HeroProps } from "../components/hero/Hero";
import type { LeadFormProps } from "../components/lead-form/LeadForm";
import type { MainValuesProps } from "../components/main-values/MainValues";
import type { FaqProps } from "../components/faq/Faq";
import type { ReasonsProps } from "../components/reasons/Reasons";
import type { StartWorkProps } from "../components/start-work/StartWork";
import type { SolvedTasksProps } from "../components/solved-tasks/SolvedTasks";
import type { ProductDemonstrationProps } from "../components/product-demonstration/ProductDemonstration";
import type { IntermediateCtaProps } from "../components/intermediate-cta/IntermediateCta";
import type { TechnicalDemonstrationProps } from "../components/technical-demonstration/TechnicalDemonstration";

export const hero: HeroProps = {
  title: "2ГИС ГеоПоток:Логистика",
  titleBreakAfter: "ГеоПоток:",
  description:
    "Сервис для планирования оптимальных маршрутов и распределения задач между курьерами, водителями и выездными сотрудниками",
  actions: [
    { kind: "secondary", label: "Попробовать демо", href: "#demo-url-pending" },
    { kind: "primary", label: "Получить консультацию", href: "#lead-form" },
  ],
  media: {
    kind: "meaningful",
    alt: "Иллюстрация сервиса 2ГИС ГеоПоток:Логистика с картой и маршрутом",
    desktop: { src: "/images/hero/logistics-desktop.png", placement: "contain" },
    mobile: { src: "/images/hero/logistics-mobile.png", placement: "contain" },
  },
};

export const leadForm: LeadFormProps = {
  title: "Расскажите о задаче — поможем её решить",
  productId: "geoflow-logistics",
  productLabel: "2ГИС ГеоПоток: Логистика",
};

// Макетные тексты; иконки блока берутся из public/images/benefits/main-values/.
export const mainValues: MainValuesProps = {
  items: [
    { title: "Заголовок", description: "Описание пункта в блоке", iconSrc: "/images/benefits/main-values/car.png" },
    { title: "Заголовок", description: "Описание пункта в блоке", iconSrc: "/images/benefits/main-values/truck.png" },
    { title: "Заголовок", description: "Описание пункта в блоке", iconSrc: "/images/benefits/main-values/gear.png" },
  ],
};

// Макетные карточки без кнопок: тексты и коллажи добавляются по ТЗ нового лендинга.
export const solvedTasks: SolvedTasksProps = {
  id: "solved-tasks",
  title: "Решаемые задачи",
  items: [
    { title: "Текст блока", description: "Описание в две или три строки" },
    { title: "Текст блока", description: "Описание в две или три строки" },
  ],
};

export const productDemonstration: ProductDemonstrationProps = {
  title: "Заголовок",
  background: {
    desktop: "/images/product-demonstration/light_desktop.png",
    mobile: "/images/product-demonstration/Light_mobile.png",
  },
};

export const intermediateCta: IntermediateCtaProps = {
  title: "Текст в одну или две строки",
  description: "Описание",
  primaryAction: { label: "Текст кнопки", mobileLabel: "Получить доступ", href: "#lead-form" },
  secondaryAction: { label: "Текст кнопки", href: "#lead-form" },
  image: {
    desktop: "/images/intermediate-cta/desktop_image.png",
    mobile: "/images/intermediate-cta/mobile_image.png",
    alt: "",
  },
};

// Макетные подписи для предпросмотра. На новом лендинге items берутся только из утверждённого ТЗ.
export const faq: FaqProps = {
  title: "Вопросы и ответы",
  items: Array.from({ length: 4 }, () => ({
    question: "Заголовок вопроса",
    answer: "Текст ответа в несколько строк",
  })),
};

export const reasons: ReasonsProps = {
  title: "Четыре причины выбрать 2ГИС",
  items: [
    { iconSrc: "/images/benefits/2gis/database.png", text: "В основе всех решений — данные, которые мы сами собираем и обновляем" },
    { iconSrc: "/images/benefits/2gis/hand.png", text: "С 1999 года работаем с данными, которым можно верить" },
    { iconSrc: "/images/benefits/2gis/target.png", text: "95% — точность данных 2ГИС. Объясняем, как мы этого добились", href: "https://dev.2gis.ru/company", target: "_blank" },
    { iconSrc: "/images/benefits/2gis/handshake.png", text: "Нам доверяют тысячи клиентов в России и странах СНГ" },
  ],
};

// Макетные заглушки: заменить шагами и рабочими ссылками из ТЗ конкретного продукта.
export const startWork: StartWorkProps = {
  title: "Как начать работу",
  items: [
    { heading: "Текст блока", text: "Текст блока", action: { label: "В кабинет", href: "https://platform.2gis.ru/" } },
    { heading: "Текст блока", text: "Текст блока" },
    { heading: "Текст блока", text: "Текст блока" },
    { heading: "Текст блока", text: "Текст блока" },
  ],
};

export const technicalDemonstration: TechnicalDemonstrationProps = {
  title: "Заголовок в одну или две строки при необходимости",
  description: "Описание",
  image: {
    desktop: "/images/technical-demonstration/demonstration block_desktop.png",
    mobile: "/images/technical-demonstration/image_mobile.png",
    alt: "Схема переноса оформления карты с экрана компьютера на смартфон",
    layout: "showcase",
    ambientGlow: "rgb(31 120 46 / 22%)",
  },
};
