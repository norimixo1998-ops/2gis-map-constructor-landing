import styles from "./SiteFooter.module.css";
import { publicAsset } from "../../lib/public-asset";

type FooterLink = { label: string; href?: string; external?: boolean };
type FooterGroup = { title: string; links: FooterLink[] };

const dataGroups: FooterGroup[] = [
  {
    title: "Продукты",
    links: [
      { label: "Базы данных", href: "https://dev.2gis.ru/data" },
      { label: "API и SDK", href: "https://dev.2gis.ru/api" },
      { label: "Векторные карты", href: "https://dev.2gis.ru/vectormaps" },
      { label: "2ГИС Про", href: "https://dev.2gis.ru/pro" },
      { label: "2ГИС Ситискан", href: "https://dev.2gis.ru/cityscan" },
      { label: "2ГИС ГеоПоток: Мониторинг", href: "https://dev.2gis.ru/geoflow" },
      { label: "2ГИС ГеоПоток: Логистика", href: "https://dev.2gis.ru/2gis-geoflow-logistics" },
      { label: "On-Premise", href: "https://dev.2gis.ru/onpremise" },
    ],
  },
  {
    title: "Отраслевые решения",
    links: [
      { label: "Бизнесу", href: "https://dev.2gis.ru/business" },
      { label: "Госсектору", href: "https://dev.2gis.ru/government" },
    ],
  },
  {
    title: "Разработчикам",
    links: [
      { label: "Личный кабинет", href: "https://platform.2gis.ru/" },
      { label: "Получить демодоступ", href: "https://platform.2gis.ru/" },
      { label: "Редактор стилей карты", href: "https://styles.2gis.com/" },
    ],
  },
];

const developerLinks: FooterLink[] = [
  { label: "Документация", href: "https://docs.2gis.com/", external: true },
  { label: "О качестве данных", href: "https://dev.2gis.ru/company", external: true },
];
const casesLink: FooterLink = { label: "Кейсы", href: "https://dev.2gis.ru/cases", external: true };

const otherGroups: FooterGroup[] = [
  {
    title: "Для бизнеса",
    links: [
      { label: "Реклама на картах 2ГИС", href: "https://reklama.2gis.ru/" },
      { label: "Подключиться к Отелло" },
    ],
  },
  {
    title: "Для пользователей",
    links: [
      { label: "2ГИС для жизни в городе", href: "https://2gis.ru/" },
      { label: "Отелло для путешествий" },
    ],
  },
];

const companyGroups: FooterGroup[] = [
  {
    title: "Компания",
    links: [
      { label: "Техно 2ГИС", href: "https://techno.2gis.ru/" },
      { label: "Работа в 2ГИС", href: "https://job.2gis.ru/" },
      { label: "Купить франшизу", href: "https://franchise.2gis.ru/" },
      { label: "Стать партнёром", href: "https://dev.2gis.ru/partners" },
      { label: "Контакты", href: "https://info.2gis.ru/contacts" },
    ],
  },
  {
    title: "Что нового",
    links: [
      { label: "Пресс-центр", href: "https://info.2gis.ru/moscow/company/media" },
      { label: "Доставили", href: "https://dostavili.2gis.ru/" },
    ],
  },
];

const legalGroups: FooterGroup[] = [
  {
    title: "Условия использования",
    links: [
      { label: "Правовая информация", href: "https://law.2gis.ru/" },
      { label: "Политика конфиденциальности", href: "https://law.2gis.ru/privacy" },
      { label: "Лицензионное соглашение", href: "https://law.2gis.ru/licensing-agreement" },
    ],
  },
];

function Link({ item, className }: { item: FooterLink; className?: string }) {
  const content = <>{item.label}{item.external && <img src={publicAsset("/icons/footer/Arrow-right-corner.svg")} alt="" aria-hidden="true" />}</>;
  return item.href ? (
    <a className={className} href={item.href}>{content}</a>
  ) : (
    <span className={className} data-link-pending="true">{content}</span>
  );
}

function Links({ links }: { links: FooterLink[] }) {
  return <ul className={styles.links}>{links.map((item) => <li key={item.label}><Link item={item} /></li>)}</ul>;
}

function Group({ group }: { group: FooterGroup }) {
  return <div className={styles.group}><h3>{group.title}</h3><Links links={group.links} /></div>;
}

function DirectLinks({ links }: { links: FooterLink[] }) {
  return <ul className={styles.directLinks}>{links.map((item) => <li key={item.label}><Link item={item} /></li>)}</ul>;
}

function Subscribe() {
  return (
    <div className={styles.subscribe}>
      <h3><img src={publicAsset("/icons/footer/telegram-icon.svg")} alt="" aria-hidden="true" />Подписывайтесь</h3>
      <ul>
        <li><span data-link-pending="true">Канал 2ГИС Платформа</span></li>
        <li><span data-link-pending="true">Канал 2ГИС Бизнес</span></li>
      </ul>
    </div>
  );
}

function Accordion({ title, children, open = false, compact = false }: { title: string; children: React.ReactNode; open?: boolean; compact?: boolean }) {
  return <details className={`${styles.accordion} ${compact ? styles.compact : ""}`} open={open || undefined}>
    <summary>{title}<img className={styles.chevronDown} src={publicAsset("/icons/footer/chevron-up-small-stroke.svg")} alt="" aria-hidden="true" /><img className={styles.chevronUp} src={publicAsset("/icons/footer/chevron-off-small-stroke.svg")} alt="" aria-hidden="true" /></summary>
    <div className={styles.accordionBody}>{children}</div>
  </details>;
}

function ContactBar() {
  return <div className={styles.contactBar}>
    <div className={styles.contactInner}>
      <p className={styles.copyright}>1999–2026 © 2ГИС. Все права защищены.</p>
      <div className={styles.contacts}>
        <h3>Если появятся вопросы</h3>
        <div className={styles.contactLinks}>
          <a href="tel:88002003600"><img src={publicAsset("/icons/footer/number-icon.svg")} alt="" aria-hidden="true" />8 800 200-36-00</a>
          <a href="mailto:dev@2gis.ru"><img src={publicAsset("/icons/footer/email-icon.svg")} alt="" aria-hidden="true" />Отправьте письмо</a>
        </div>
      </div>
    </div>
  </div>;
}

export function SiteFooter() {
  return <footer className={styles.footer} aria-label="Подвал сайта">
    <div className={styles.main}>
      <div className={styles.desktopContent}>
        <div className={styles.desktopBrand}><img src={publicAsset("/brand/logo-2GIS.svg")} alt="2ГИС" /></div>
        <div className={styles.desktopColumn}>
          <h2>Данные и технологии 2ГИС</h2>
          <div className={styles.productColumns}>
            <div><Group group={dataGroups[0]} /><DirectLinks links={[casesLink]} /></div>
            <div><Group group={dataGroups[1]} /><Group group={dataGroups[2]} /><DirectLinks links={developerLinks} /></div>
          </div>
        </div>
        <div className={styles.desktopColumn}><h2>Другие продукты</h2>{otherGroups.map((group) => <Group group={group} key={group.title} />)}</div>
        <div className={styles.desktopColumn}><h2>Компания</h2><Links links={companyGroups[0].links} /><Group group={companyGroups[1]} /></div>
        <div className={styles.desktopColumn}><h2>Условия использования</h2><Links links={legalGroups[0].links} /><Subscribe /></div>
      </div>
      <div className={styles.mobileContent}>
        <img className={styles.mobileLogo} src={publicAsset("/brand/logo-2GIS.svg")} alt="2ГИС" />
        <Accordion title="Данные и технологии 2ГИС" open>{dataGroups.map((group) => <Group group={group} key={group.title} />)}<DirectLinks links={[...developerLinks, casesLink]} /></Accordion>
        <Accordion title="Другие продукты">{otherGroups.map((group) => <Group group={group} key={group.title} />)}</Accordion>
        <Accordion title="Компания" compact><Links links={companyGroups[0].links} /><Group group={companyGroups[1]} /></Accordion>
        <Accordion title="Условия использования" compact><Links links={legalGroups[0].links} /></Accordion>
        <Subscribe />
      </div>
    </div>
    <ContactBar />
  </footer>;
}
