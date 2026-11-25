import type { HeroProps } from "../components/hero/Hero";
import type { MainValuesProps } from "../components/main-values/MainValues";
import type { StartWorkProps } from "../components/start-work/StartWork";
import type { FaqProps } from "../components/faq/Faq";
import type { ImageFeatureCardsProps } from "../components/image-feature-cards/ImageFeatureCards";
import type { IconFeatureNumbersProps } from "../components/icon-feature-numbers/IconFeatureNumbers";
import type { DeliveryScenariosProps } from "../components/delivery-scenarios/DeliveryScenarios";
import type { OptionalCtaFormProps } from "../components/optional-cta-form/OptionalCtaForm";

export const hero: HeroProps = {
  eyebrow: "Новогодний сезон доставки",
  eyebrowIconSrc: "/icons/geoflow-holiday/snowflake-stroke.svg",
  title: "Маршруты на завтра без вечернего ручного планирования",
  titleBreakAfter: "завтра",
  description: "Соберите заказы за день, задайте время доставки и получите готовые маршруты на завтра за 5 минут.",
  actions: [
    { kind: "primary", label: "Подключить курьеров", href: "#connect" },
    { kind: "secondary", label: "Посмотреть, как считается маршрут", href: "#workflow" },
  ],
  media: {
    kind: "meaningful",
    desktop: { src: "/images/hero/logistics-desktop.png", placement: "contain" },
    mobile: { src: "/images/hero/logistics-mobile.png", placement: "contain" },
    alt: "Объёмная иконка ГеоПотока с маршрутом на карте",
  },
};

export const keyPoints: MainValuesProps = {
  id: "key-points",
  orientation: "horizontal",
  items: [
    { title: "Срок акции", description: "До 28 февраля 2027 года", iconSrc: "/images/benefits/main-values/clock-blue.png" },
    { title: "До 5 курьеров", description: "И главный пользователь", iconSrc: "/images/benefits/main-values/courier.png" },
    { title: "Без ограничений", description: "На количество маршрутов", iconSrc: "/images/benefits/main-values/gear.png" },
  ],
};

export const workflow: StartWorkProps = {
  id: "workflow",
  title: "От списка заказов до маршрута в телефоне",
  description: "Логист готовит план на завтра. Курьеры начинают день с распределёнными адресами.",
  desktopColumns: 2,
  items: [
    {
      heading: "Загрузите заказы",
      text: "Добавьте адреса через веб-панель или публичный API, укажите время доставки и особенности заказа.",
    },
    {
      heading: "Рассчитайте маршруты",
      text: "Система распределит точки с учётом временных окон заказов, параметров груза, навыков курьеров, параметров транспорта, параметров складов и способа оптимизации.",
    },
    {
      heading: "Передайте план курьерам",
      text: "Каждый сотрудник увидит свой порядок адресов и задачи в мобильном приложении.",
    },
    {
      heading: "Следите за выполнением",
      text: "Веб-панель показывает маршруты и статус задач на карте в течение рабочего дня.",
    },
  ],
};

export const deliveryScenarios: DeliveryScenariosProps = {
  id: "delivery-scenarios",
  title: "Сценарии для доставки, где важны адреса и время",
  titleBreakBefore: "где",
  description: "Сценарии для небольших команд, которые сейчас распределяют заказы в таблицах, мессенджерах и по телефону.",
  items: [
    { title: "Интернет-магазины с собственной доставкой", short: "Магазины", color: "#12951a", situation: "Вечером заказы нужно распределить по районам.", automation: "Утром каждый курьер получает готовый маршрут." },
    { title: "Подарки и праздничная атрибутика", short: "Подарки", color: "#f4776e", situation: "В пиковый день адресов больше, а подарок нужен к точному времени.", automation: "Маршрут заранее учитывает временные окна." },
    { title: "Снабжение HoReCa и локальной розницы", short: "HoReCa", color: "#ffbf45", situation: "Кофейня ждёт утром, часть заведений не принимает товар в обед.", automation: "Доставка привязывается к часам работы точки." },
    { title: "Документы и полиграфия", short: "Полиграфия", color: "#65aaff", situation: "Оригиналы и тиражи нужно передать в офисы до конца рабочего дня.", automation: "Маршрут строится по дедлайнам получателей, а не по порядку заказов." },
    { title: "Строительные и хозяйственные магазины", short: "Стройка", color: "#a892ff", situation: "В фургон помещается не всё: важно, что и в каком порядке везти.", automation: "Точки группируются по объёму заказа и району доставки." },
    { title: "Зоомагазины и ветаптеки", short: "Зоо", color: "#ef75b0", situation: "Корм заказывают регулярно, по одним и тем же адресам.", automation: "Повторные доставки ставятся в маршрут в один клик." },
    { title: "Цветы и флористика", short: "Цветы", color: "#40c4b3", situation: "Букет нужен к часу, а получателя может не быть дома.", automation: "Временные окна и запас на вручение закладываются в маршрут." },
    { title: "Фермерские продукты и подписки", short: "Ферма", color: "#a5d65b", situation: "Каждую неделю — одни и те же клиенты в разных районах.", automation: "Регулярные маршруты сохраняются и повторяются по расписанию." },
    { title: "Аптеки и медтовары", short: "Аптеки", color: "#59bed4", situation: "Часть заказов срочные, часть — плановые на день.", automation: "Срочные точки поднимаются в начало маршрута автоматически." },
  ],
};

export const capabilities: ImageFeatureCardsProps = {
  id: "capabilities",
  title: "Логист работает в браузере, курьер в приложении",
  titleBreakBefore: "курьер",
  description: "Планирование и контроль остаются в веб-панели, маршрут сотрудника всегда под рукой.",
  items: [
    {
      title: "Веб-панель администратора",
      description: "Управляйте маршрутами и загрузкой курьеров, отслеживайте точки доставки и порядок их посещения на карте. Настраивайте временные окна и контролируйте статус задач в реальном времени.",
      imageSrc: "/images/image-feature-cards/Web-logistics-desktops.png",
      mobileImageSrc: "/images/image-feature-cards/Web-logistics-mobile-2.png",
      imageAlt: "Маршруты курьеров и точки доставки на карте веб-панели",
    },
    {
      title: "Приложение курьера",
      description: "Получайте готовую последовательность адресов на рабочий день и детальный список задач для каждой точки. Удобный мобильный интерфейс поможет эффективно выполнять работу без лишних действий. Доступно на Android (10 и выше) и iOS.",
      imageSrc: "/images/image-feature-cards/Web-logistics-desktop.png",
      mobileImageSrc: "/images/image-feature-cards/Web-logistics-mobile.png",
      imageAlt: "Маршрут курьера на карте в мобильном приложении",
    },
  ],
};

export const workTools: IconFeatureNumbersProps = {
  id: "work-tools",
  title: "Рабочие инструменты для логиста и курьеров",
  items: [
    {
      title: "Веб-панель администратора",
      description: "Загрузка заказов, настройка расчёта и контроль на карте.",
      iconSrc: "/images/icon-feature-cards/point-bottom-left-to-top-right-fill.svg",
    },
    {
      title: "Мобильное приложение сотрудника",
      description: "Маршрут, список точек и задачи курьера на Android 10 и выше.",
      iconSrc: "/images/icon-feature-cards/navigation-cursor-north-stroke.svg",
    },
    {
      title: "Публичный API",
      description: "Передача заказов из вашей учётной системы. Настройка обмена выполняется отдельно.",
      iconSrc: "/images/icon-feature-cards/globe-stroke.svg",
    },
  ],
  metrics: [
    { value: "350", label: "задач в одном маршрутном плане" },
    { value: "200", label: "агентов в одном маршруте" },
  ],
  note: "В рамках акции доступ предоставляется до 5 агентам-курьерам",
};

// Временные подписи показывают готовый блок до согласования вопросов и ответов.
export const faq: FaqProps = {
  id: "faq",
  title: "Вопросы и ответы",
  defaultOpenIndex: 0,
  items: Array.from({ length: 5 }, (_, index) => ({
    question: `Заголовок вопроса ${index + 1}`,
    answer: "Текст ответа в несколько строк",
  })),
};

export const connectForm: OptionalCtaFormProps = {
  id: "connect",
  title: "Подготовьте маршруты следующего рабочего дня",
  description: "Оставьте рабочие контакты, чтобы обсудить подключение команды к 2ГИС ГеоПоток: Логистика.",
  submitLabel: "Подключить курьеров",
};
