import type { HeroProps } from "../components/hero/Hero";
import type { MainValuesProps } from "../components/main-values/MainValues";
import type { StartWorkProps } from "../components/start-work/StartWork";
import type { FaqProps } from "../components/faq/Faq";
import type { ImageFeatureCardsProps } from "../components/image-feature-cards/ImageFeatureCards";
import type { IconFeatureNumbersProps } from "../components/icon-feature-numbers/IconFeatureNumbers";
import type { DeliveryScenariosProps } from "../components/delivery-scenarios/DeliveryScenarios";
import type { IntermediateCtaProps } from "../components/intermediate-cta/IntermediateCta";
import type { AudienceScenariosProps } from "../components/audience-scenarios/AudienceScenarios";

export const hero: HeroProps = {
  eyebrow: "Геопоток бесплатно до конца февраля",
  eyebrowIconSrc: "/icons/geoflow-holiday/snowflake-stroke.svg",
  title: "Доставка на завтра без ручного планирования",
  titleBreakAfter: "завтра",
  description: "Соберите заказы, при необходимости задайте время доставки и получите готовые маршруты на завтра, неделю, месяц вперёд за 5 минут",
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
    { title: "До 5 курьеров", description: "Вместе с диспетчером", iconSrc: "/images/benefits/main-values/courier.png" },
    { title: "Без ограничений", description: "На количество маршрутов", iconSrc: "/images/benefits/main-values/gear.png" },
  ],
};

export const audienceScenarios: AudienceScenariosProps = {
  id: "audience-scenarios",
  title: "Подключите команду и планируйте маршруты заранее",
  description: "Подключитесь к 2ГИС Геопотоку, подготовьте маршрут следующего рабочего дня/недели/месяца",
  panelTitle: "Что входит",
  items: [
    "Планирование и перепланирование маршрутов",
    "Мобильное приложение с навигатором для курьеров",
    "Выгрузка построенных маршрутов в Excel",
    "Сравнение плана и факта",
  ],
  image: {
    desktop: "/images/audience-scenarios/geopotok-image-desktop.png",
    mobile: "/images/audience-scenarios/geopotok-image-mobile.png",
    alt: "Мобильный навигатор курьера на фоне карты с маршрутами доставки",
  },
};

export const workflow: StartWorkProps = {
  id: "workflow",
  title: "От списка заказов до маршрута в телефоне",
  description: "Логист готовит план на завтра, курьеры начинают день с распределенными задачами.",
  desktopColumns: 2,
  items: [
    {
      heading: "Загрузите заказы",
      text: "Добавьте адреса через веб-панель или публичный API, укажите время доставки и особенности заказа",
    },
    {
      heading: "Рассчитайте маршруты",
      text: "Система распределит точки с учётом временных окон заказов, параметров груза, навыков курьеров, параметров транспорта, параметров складов и способа оптимизации",
    },
    {
      heading: "Передайте план курьерам",
      text: "Каждый сотрудник увидит свой порядок адресов и задачи в мобильном приложении",
    },
    {
      heading: "Следите за выполнением",
      text: "Веб-панель показывает маршруты и статус задач на карте в течение рабочего дня",
    },
  ],
};

export const deliveryScenarios: DeliveryScenariosProps = {
  id: "delivery-scenarios",
  title: "Сценарий для доставки, где важно выполнить задачу вовремя",
  titleBreakBefore: "где",
  description: "Сценарии для команд, которые сейчас распределяют заказы в таблицах, мессенджерах и по телефону",
  items: [
    { title: "Интернет-магазины с собственной доставкой", color: "#12951a", situation: "Вечером заказы нужно распределить по районам", automation: "Постройте маршруты, чтобы утром каждый курьер получил свой план" },
    { title: "Подарки и праздничная атрибутика", color: "#f4776e", situation: "В пиковый день адресов больше, а подарок нужен к точному времени", automation: "Задайте время доставки — маршрут учтёт временные окна" },
    { title: "Дистрибьюторы", color: "#ffbf45", situation: "Товар нужно забрать у производителя и развезти по торговым точкам. У каждой — своё время приёмки", automation: "Рассчитайте маршрут от производителя до торговых точек с учётом времени доставки" },
    { title: "Документы и полиграфия", color: "#65aaff", situation: "Оригиналы и тиражи нужно передать в офисы до конца рабочего дня", automation: "Укажите сроки доставки для каждого получателя при построении маршрута" },
    { title: "Строительные и хозяйственные магазины", color: "#a892ff", situation: "В фургон помещается не всё: важно, что и в каком порядке везти", automation: "Группируйте точки по объёму заказа и району доставки" },
    { title: "Зоомагазины и ветаптеки", color: "#ef75b0", situation: "Корм заказывают регулярно, по одним и тем же адресам", automation: "Добавляйте повторные доставки в маршрут в один клик" },
    { title: "Цветы и флористика", color: "#40c4b3", situation: "Букет нужен к часу, а получателя может не быть дома", automation: "Задайте временное окно и запас времени на вручение при построении маршрута" },
    { title: "Фермерские продукты и подписки", color: "#a5d65b", situation: "Каждую неделю — одни и те же клиенты в разных районах", automation: "Сохраните регулярные маршруты и повторяйте их по расписанию" },
    { title: "Аптеки и медтовары", color: "#59bed4", situation: "Часть заказов срочные, часть — плановые на день", automation: "Поставьте срочные точки в начало маршрута" },
    { title: "Коммунальные службы и управляющие компании", color: "#f4a261", situation: "В течение дня поступили срочные заявки. Нужно определить ответственных.", automation: "Перепланирование списка задач с учётом доступных исполнителей и отправка им уведомлений об изменениях." },
  ],
};

export const capabilities: ImageFeatureCardsProps = {
  id: "capabilities",
  title: "Логист работает в браузере, курьер в приложении",
  titleBreakBefore: "курьер",
  description: "Планирование и контроль остаются в веб-панели, маршрут сотрудника всегда под рукой",
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
      description: "Получайте готовую последовательность адресов на рабочий день и детальный список задач для каждой точки. Удобный мобильный интерфейс поможет эффективно выполнять работу без лишних действий.",
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
      description: "Загрузка заказов, настройка расчёта и контроль на карте",
      iconSrc: "/images/icon-feature-cards/image-stroke.svg",
    },
    {
      title: "Мобильное приложение сотрудника",
      description: "Маршрут, список точек и задачи курьера на Android 10 и iOS",
      iconSrc: "/images/icon-feature-cards/point-top-right-to-bottom-left-fill.svg",
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
  note: "В рамках акции доступ предоставляется до пяти исполнителей (курьеров)",
};

export const faq: FaqProps = {
  id: "faq",
  title: "Вопросы и ответы",
  defaultOpenIndex: 0,
  items: [
    { question: "Что будет после окончания акции?", answer: "Вы можете приобрести полный доступ, чтобы продолжить работу, или просматривать ретроспективные данные." },
    { question: "Что делать, если нужно больше 5 курьеров?", answer: "Свяжитесь с менеджером 2ГИС по контактам, указанным в личном кабинете. Менеджер поможет обсудить возможное решение для вашей команды." },
    { question: "Где посмотреть, сколько времени осталось до окончания акции?", answer: "Оставшийся срок участия отображается в личном кабинете вашего профиля." },
    { question: "Как узнать цену и купить полный доступ?", answer: "Обратитесь к команде менеджеров 2ГИС. Они расскажут о тарифах, помогут выбрать подходящий вариант и при необходимости подготовят коммерческое предложение. Контакты менеджера доступны в личном кабинете." },
    { question: "Что входит в акционный доступ?", answer: "Доступ не более чем для 5 агентов-курьеров и одного главного веб-пользователя. Количество построений маршрутов не ограничено. Одна компания может участвовать в акции один раз." },
    { question: "До какого числа действует акция?", answer: "Акция действует до 28 февраля 2027. Оставшееся время участия можно посмотреть в личном кабинете." },
    { question: "Что делать, если не получается решить задачу или нужна дополнительная функция?", answer: "Продукт создавался с учётом разных процессов компаний. Если ваш сценарий не удалось настроить, обратитесь в техническую поддержку. Команда поможет разобраться в задаче и обсудить возможное решение вашей бизнес-потребности. Контакты поддержки находятся в профиле компании." },
    { question: "Как добавить заказы?", answer: "Адреса и задачи можно загрузить через веб-панель или передать через публичный API." },
    { question: "Нужна ли интеграция с учётной системой?", answer: "Для начала работы можно использовать веб-панель. Передачу заказов из учётной системы можно настроить через публичный API." },
    { question: "На каких устройствах работает приложение курьера?", answer: "Приложение курьера работает на Android 10 и выше, а также на iOS." },
  ],
};

export const connectCta: IntermediateCtaProps = {
  id: "connect",
  title: "Подготовьте маршруты следующего рабочего дня",
  description: "Оставьте рабочие контакты, чтобы обсудить подключение команды к 2ГИС ГеоПоток: Логистика",
  primaryAction: {
    label: "Подключить курьеров",
    href: "https://geoflow.2gis.ru/auth/register?utm_content=landing_page&utm_source=dev.2gis-geoflow&utm_medium=dev.2gis-geoflow&utm_campaign=dev.2gis-geoflow",
    target: "_blank",
  },
  image: {
    desktop: "/images/intermediate-cta/illustration-desktop.png",
    mobile: "/images/intermediate-cta/illustration-mobile.png",
    alt: "",
    fit: "contain",
  },
};
