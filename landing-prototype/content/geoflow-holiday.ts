import type { HeroProps } from "../components/hero/Hero";
import type { MainValuesProps } from "../components/main-values/MainValues";
import type { StartWorkProps } from "../components/start-work/StartWork";
import type { FaqProps } from "../components/faq/Faq";
import type { AudienceScenariosProps } from "../components/audience-scenarios/AudienceScenarios";
import type { IntermediateCtaProps } from "../components/intermediate-cta/IntermediateCta";
import type { TechnicalDemonstrationProps } from "../components/technical-demonstration/TechnicalDemonstration";

// Content draft from the campaign brief of 13 November 2026. Marketing and legal review are pending.
export const hero: HeroProps = {
  title: "Планируйте доставку три месяца бесплатно",
  description: "Подключите «ГеоПоток: Логистика», распределяйте заказы между курьерами и стройте маршруты. Предложение для новых клиентов — до пяти курьеров на компанию.",
  actions: [
    { kind: "primary", label: "Подключить своих курьеров", href: "#participate" },
  ],
  media: {
    kind: "meaningful",
    alt: "Объёмная иллюстрация карты и маршрута ГеоПотока",
    desktop: { src: "/images/hero/logistics-desktop.png", placement: "contain" },
    mobile: { src: "/images/hero/logistics-mobile.png", placement: "contain" },
    animation: "float",
  },
};

export const offer: MainValuesProps = {
  id: "offer",
  title: "Условия акции",
  items: [
    { title: "Для новых клиентов", description: "Одна компания может участвовать один раз.", iconSrc: "/images/benefits/main-values/hand_marker.png" },
    { title: "Три месяца доступа", description: "Срок начинается с момента регистрации по акции.", iconSrc: "/images/benefits/main-values/clock%20blue.png" },
    { title: "До пяти курьеров", description: "Лимит действует для одной компании.", iconSrc: "/images/benefits/main-values/courier.png" },
  ],
};

export const possibilities: TechnicalDemonstrationProps = {
  id: "possibilities",
  title: "Планируйте доставку в одном сервисе",
  description: "Распределяйте заказы между курьерами. Рассчитывайте маршруты и проверяйте план на карте. Учитывайте смены и время доставки при планировании.",
};

// Product audiences from dev.2gis.ru/2gis-geoflow-logistics. Campaign eligibility is pending.
export const audiences: AudienceScenariosProps = {
  id: "audiences",
  title: "Для кого подходит «ГеоПоток: Логистика»",
  items: [
    "Курьерская доставка",
    "Интернет-магазины",
    "Сервисные службы",
    "Дистрибуция",
    "Банки и доставка документов",
    "B2B-перевозки",
  ],
};

export const steps: StartWorkProps = {
  id: "how-it-works",
  title: "Как начать работу",
  cardTextStyle: "regular18",
  items: [
    { heading: "Зарегистрируйте компанию по ссылке акции" },
    { heading: "Добавьте курьеров и заказы" },
    { heading: "Составьте и проверьте первый план маршрутов" },
  ],
};

export const faq: FaqProps = {
  id: "questions",
  title: "Вопросы об акции",
  items: [
    { question: "Кто может участвовать?", answer: "Новые клиенты, которые впервые регистрируются по акции. Одна компания может участвовать один раз." },
    { question: "Когда начинается трёхмесячный срок?", answer: "Три месяца отсчитываются с момента регистрации по акции." },
    { question: "Сколько курьеров можно подключить?", answer: "До пяти курьеров на компанию в рамках акции." },
    { question: "Что будет после окончания доступа?", answer: "Условия после бесплатного периода уточняются." },
  ],
};

export const finalCta: IntermediateCtaProps = {
  id: "participate",
  title: "Подключите своих курьеров и планируйте на своих заказах",
  primaryAction: { label: "Подключить своих курьеров", disabled: true },
  image: {
    desktop: "/images/intermediate-cta/desktop_image.png",
    mobile: "/images/intermediate-cta/mobile_image.png",
    alt: "",
    fit: "contain",
  },
};
