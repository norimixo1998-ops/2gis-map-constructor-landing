import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Legion/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const output = join(dirname(fileURLToPath(import.meta.url)), "preview-checks");
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

try {
  for (const [name, width, height] of [["mobile", 375, 812], ["tablet", 768, 900], ["tablet-wide", 900, 900], ["compact-desktop", 1024, 900], ["desktop", 1440, 900]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const response = await page.goto("http://127.0.0.1:3000/geoflow-hero-preview", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => ({
      header: (() => {
        const header = document.querySelector("body > header");
        const nav = header?.querySelector("nav");
        const menu = header?.querySelector('img[src*="icon-menu"]');
        const action = header?.querySelector('a[href="#connect"]');
        const badge = header?.querySelector('span[class*="badge"]');
        const badgeGradient = getComputedStyle(badge, "::before");
        const typography = [badge, nav, action].map((element) => {
          const style = getComputedStyle(element);
          return { family: style.fontFamily, weight: style.fontWeight, size: style.fontSize, lineHeight: style.lineHeight };
        });
        const divider = getComputedStyle(header, "::after");
        const heroSecondary = document.querySelectorAll("main section a")[1];
        const heroLayout = document.querySelector("main > div:first-child section > div");
        return {
          count: document.querySelectorAll("body > header").length,
          height: Math.round(header?.getBoundingClientRect().height ?? 0),
          spacerHeight: Math.round(header?.nextElementSibling?.getBoundingClientRect().height ?? 0),
          logoLoaded: header?.querySelector('img[alt="2ГИС"]')?.naturalWidth > 0,
          badge: header?.textContent.includes("2ГИС Геопоток"),
          nav: [...(nav?.querySelectorAll("a, span") ?? [])].map((item) => item.textContent),
          navVisible: nav ? getComputedStyle(nav).display !== "none" && getComputedStyle(nav.parentElement).display !== "none" : false,
          menuVisible: menu ? getComputedStyle(menu.parentElement.parentElement).display !== "none" : false,
          menuLoaded: menu?.naturalWidth > 0,
          languageCount: header?.querySelectorAll('img[src*="language"]')?.length ?? 0,
          actionHeight: Math.round(action?.getBoundingClientRect().height ?? 0),
          typography,
          badgeGradient: { background: badgeGradient.backgroundImage, opacity: badgeGradient.opacity },
          navColor: getComputedStyle(nav).color,
          actionColor: action ? getComputedStyle(action).backgroundColor : null,
          heroSecondaryColor: heroSecondary ? getComputedStyle(heroSecondary).backgroundColor : null,
          dividerHeight: divider.height,
          dividerColor: divider.backgroundColor,
          heroTopPadding: parseFloat(getComputedStyle(heroLayout).paddingTop),
        };
      })(),
      title: document.querySelector("h1")?.textContent,
      tag: document.querySelector("main section p")?.textContent,
      tagIconLoaded: document.querySelector("main section p img")?.naturalWidth === 24,
      tagGeometry: (() => {
        const tag = document.querySelector("main section p");
        const style = getComputedStyle(tag);
        return { height: tag.getBoundingClientRect().height, gap: style.gap, padding: style.padding, radius: style.borderRadius, color: style.color, background: style.backgroundColor, blur: style.backdropFilter };
      })(),
      buttons: [...document.querySelectorAll("main > div:first-child section a")].map((a) => a.textContent.trim()),
      imageLoaded: document.querySelector("main picture img")?.naturalWidth > 0,
      keyPoints: [...document.querySelectorAll("#key-points li")].map((card) => ({
        title: card.querySelector("h3")?.textContent,
        description: card.querySelector("p")?.textContent,
        iconLoaded: card.querySelector("img")?.naturalWidth > 0,
        direction: getComputedStyle(card.firstElementChild).flexDirection,
        height: card.getBoundingClientRect().height,
      })),
      heroToCards: Math.round(document.querySelector("#key-points").getBoundingClientRect().top - document.querySelector("main > div").getBoundingClientRect().bottom),
      workflow: (() => {
        const section = document.querySelector("#workflow");
        return {
          title: section?.querySelector("h2")?.textContent,
          intro: [...section.querySelectorAll(":scope > p")].map((p) => p.textContent),
          eyebrowCount: section?.querySelectorAll(":scope > p:not([class*='description'])").length,
          headingToDescription: Math.round(section.querySelector(":scope > p").getBoundingClientRect().top - section.querySelector("h2").getBoundingClientRect().bottom),
          descriptionToCards: Math.round(section.querySelector("ul").getBoundingClientRect().top - section.querySelector(":scope > p").getBoundingClientRect().bottom),
          descriptionStyle: (() => { const style = getComputedStyle(section.querySelector(":scope > p")); return { fontSize: style.fontSize, lineHeight: style.lineHeight, color: style.color }; })(),
          columns: getComputedStyle(section.querySelector("ul")).gridTemplateColumns.split(" ").length,
          cards: [...section.querySelectorAll("li")].map((li) => ({
            heading: li.querySelector("h3")?.textContent,
            text: li.querySelector("p")?.textContent,
            number: li.querySelector("span")?.textContent,
            height: li.getBoundingClientRect().height,
            clipped: li.querySelector("p").getBoundingClientRect().bottom > li.getBoundingClientRect().bottom - 20,
          })),
        };
      })(),
      capabilities: (() => {
        const section = document.querySelector("#capabilities");
        const heading = section?.querySelector("h2");
        const description = section?.querySelector(":scope > p:last-of-type");
        const cards = [...(section?.querySelectorAll(":scope > ul > li") ?? [])];
        return {
          afterWorkTools: section?.previousElementSibling?.id === "work-tools",
          eyebrow: section?.querySelector(":scope > p:first-child")?.textContent,
          title: heading?.textContent,
          description: description?.textContent,
          headingToDescription: Math.round(description.getBoundingClientRect().top - heading.getBoundingClientRect().bottom),
          descriptionToCards: Math.round(section.querySelector("ul").getBoundingClientRect().top - description.getBoundingClientRect().bottom),
          columns: getComputedStyle(section.querySelector("ul")).gridTemplateColumns.split(" ").length,
          cards: cards.map((card) => ({ title: card.querySelector("h3")?.textContent, description: card.querySelector("p")?.textContent, imageLoaded: card.querySelector("img")?.naturalWidth > 0, imageAlt: card.querySelector("img")?.alt, imageSrc: card.querySelector("img")?.currentSrc, imageClipped: card.querySelector("img")?.getBoundingClientRect().right > card.getBoundingClientRect().right + 1 })),
        };
      })(),
      workTools: (() => {
        const section = document.querySelector("#work-tools");
        const cards = [...(section?.querySelectorAll("li") ?? [])];
        const note = section?.querySelector("aside");
        return {
          afterDeliveryScenarios: section?.previousElementSibling?.id === "delivery-scenarios",
          title: section?.querySelector("h2")?.textContent,
          headingWidth: section?.querySelector("h2")?.getBoundingClientRect().width,
          introCount: section?.querySelectorAll(":scope > p").length,
          metrics: [...(note?.querySelectorAll("strong") ?? [])].map((el) => ({ value: el.textContent, label: el.nextElementSibling?.textContent })),
          note: note?.querySelector("p")?.textContent,
          noteX: note?.getBoundingClientRect().left,
          noteY: note?.getBoundingClientRect().top,
          cards: cards.map((card) => ({ title: card.querySelector("h3")?.textContent, description: card.querySelector("p")?.textContent, iconLoaded: card.querySelector("img")?.naturalWidth > 0, iconBelowText: card.querySelector("img")?.getBoundingClientRect().top >= card.querySelector("p")?.getBoundingClientRect().bottom + 24, background: getComputedStyle(card).backgroundColor, padding: getComputedStyle(card).padding, titleSize: getComputedStyle(card.querySelector("h3")).fontSize, titleLine: getComputedStyle(card.querySelector("h3")).lineHeight, descriptionSize: getComputedStyle(card.querySelector("p")).fontSize, descriptionLine: getComputedStyle(card.querySelector("p")).lineHeight, x: card.getBoundingClientRect().left, y: card.getBoundingClientRect().top, width: card.getBoundingClientRect().width })),
        };
      })(),
      faq: (() => {
        const section = document.querySelector("#faq");
        return {
          afterCapabilities: section?.previousElementSibling?.id === "capabilities",
          title: section?.querySelector("h2")?.textContent,
          questions: [...section.querySelectorAll("button[aria-expanded]")].map((button) => ({ text: button.textContent.trim(), answer: button.nextElementSibling?.textContent.trim(), expanded: button.getAttribute("aria-expanded") })),
        };
      })(),
      headerCount: document.querySelectorAll("body > header").length,
      footerCount: document.querySelectorAll("body > footer").length,
      h2TooWide: [...document.querySelectorAll("h2")].filter((heading) => heading.getBoundingClientRect().width > 801).map((heading) => ({ text: heading.textContent, width: heading.getBoundingClientRect().width })),
      overflow: document.documentElement.scrollWidth > innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowers: [...document.querySelectorAll("body *")].filter((el) => el.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(el).position !== "absolute").slice(0, 8).map((el) => ({ tag: el.tagName, className: el.className, right: el.getBoundingClientRect().right })),
      intrinsicOverflow: [...document.querySelectorAll("body *")].filter((el) => el.scrollWidth > el.clientWidth + 1).slice(0, 8).map((el) => ({ tag: el.tagName, className: el.className, scroll: el.scrollWidth, client: el.clientWidth })),
    }));
    const plain = (value) => value?.replace(/\u00a0/g, " ");
    const expectedKeyPoints = [
      ["Срок акции", "До 28 февраля 2027 года"],
      ["До 5 курьеров", "Вместе с диспетчером"],
      ["Без ограничений", "На количество маршрутов"],
    ];
    const expectedSteps = ["Загрузите заказы", "Рассчитайте маршруты", "Передайте план курьерам", "Следите за выполнением"];
    const expectedStepTexts = [
      "Добавьте адреса через веб-панель или публичный API, укажите время доставки и особенности заказа",
      "Система распределит точки с учётом временных окон заказов, параметров груза, навыков курьеров, параметров транспорта, параметров складов и способа оптимизации",
      "Каждый сотрудник увидит свой порядок адресов и задачи в мобильном приложении",
      "Веб-панель показывает маршруты и статус задач на карте в течение рабочего дня",
    ];
    const expectedCapabilities = [
      ["Веб-панель администратора", "Управляйте маршрутами и загрузкой курьеров, отслеживайте точки доставки и порядок их посещения на карте. Настраивайте временные окна и контролируйте статус задач в реальном времени."],
      ["Приложение курьера", "Получайте готовую последовательность адресов на рабочий день и детальный список задач для каждой точки. Удобный мобильный интерфейс поможет эффективно выполнять работу без лишних действий."],
    ];
    const expectedMobileImages = ["Web-logistics-mobile-2.png", "Web-logistics-mobile.png"];
    const expectedFaq = [
      ["Что будет после окончания акции?", "Вы можете приобрести полный доступ, чтобы продолжить работу, или просматривать ретроспективные данные."],
      ["Что делать, если нужно больше 5 курьеров?", "Свяжитесь с менеджером 2ГИС по контактам, указанным в личном кабинете. Менеджер поможет обсудить возможное решение для вашей команды."],
      ["Где посмотреть, сколько времени осталось до окончания акции?", "Оставшийся срок участия отображается в личном кабинете вашего профиля."],
      ["Как узнать цену и купить полный доступ?", "Обратитесь к команде менеджеров 2ГИС. Они расскажут о тарифах, помогут выбрать подходящий вариант и при необходимости подготовят коммерческое предложение. Контакты менеджера доступны в личном кабинете."],
      ["Что входит в акционный доступ?", "Доступ не более чем для 5 агентов-курьеров и одного главного веб-пользователя. Количество построений маршрутов не ограничено. Одна компания может участвовать в акции один раз."],
      ["До какого числа действует акция?", "Акция действует до 28 февраля 2027. Оставшееся время участия можно посмотреть в личном кабинете."],
      ["Что делать, если не получается решить задачу или нужна дополнительная функция?", "Продукт создавался с учётом разных процессов компаний. Если ваш сценарий не удалось настроить, обратитесь в техническую поддержку. Команда поможет разобраться в задаче и обсудить возможное решение вашей бизнес-потребности. Контакты поддержки находятся в профиле компании."],
      ["Как добавить заказы?", "Адреса и задачи можно загрузить через веб-панель или передать через публичный API."],
      ["Нужна ли интеграция с учётной системой?", "Для начала работы можно использовать веб-панель. Передачу заказов из учётной системы можно настроить через публичный API."],
      ["На каких устройствах работает приложение курьера?", "Приложение курьера работает на Android 10 и выше, а также на iOS."],
    ];
    if (!result.capabilities.afterWorkTools || result.capabilities.eyebrow || plain(result.capabilities.title) !== "Логист работает в браузере, курьер в приложении" || plain(result.capabilities.description) !== "Планирование и контроль остаются в веб-панели, маршрут сотрудника всегда под рукой" || result.capabilities.headingToDescription !== 20 || result.capabilities.descriptionToCards !== (width <= 768 ? 36 : 48) || result.capabilities.cards.length !== 2 || result.capabilities.cards.some((card, index) => plain(card.title) !== expectedCapabilities[index][0] || plain(card.description) !== expectedCapabilities[index][1] || !card.imageLoaded || !card.imageAlt || card.imageClipped || (width < 700 && !card.imageSrc?.endsWith(expectedMobileImages[index]))) || result.capabilities.columns !== (width < 700 ? 1 : 2)) {
      throw new Error(`${name}: capabilities ${JSON.stringify(result.capabilities)}`);
    }
    const expectedTools = [
      ["Веб-панель администратора", "Загрузка заказов, настройка расчёта и контроль на карте"],
      ["Мобильное приложение сотрудника", "Маршрут, список точек и задачи курьера на Android 10 и iOS"],
      ["Публичный API", "Передача заказов из вашей учётной системы. Настройка обмена выполняется отдельно."],
    ];
    if (!result.workTools.afterDeliveryScenarios || plain(result.workTools.title) !== "Рабочие инструменты для логиста и курьеров" || result.workTools.introCount !== 0 || (width >= 1200 && result.workTools.headingWidth > 801) || result.workTools.cards.length !== 3 || result.workTools.cards.some((card, index) => plain(card.title) !== expectedTools[index][0] || plain(card.description) !== expectedTools[index][1] || !card.iconLoaded || !card.iconBelowText || card.background !== "rgb(40, 49, 54)" || (width < 700 && (card.padding !== "20px" || card.titleSize !== "20px" || card.titleLine !== "24px" || card.descriptionSize !== "16px" || card.descriptionLine !== "24px"))) || result.workTools.metrics.length !== 2 || result.workTools.metrics[0].value !== "350" || plain(result.workTools.metrics[0].label) !== "задач в одном маршрутном плане" || result.workTools.metrics[1].value !== "200" || plain(result.workTools.metrics[1].label) !== "агентов в одном маршруте" || plain(result.workTools.note) !== "В рамках акции доступ предоставляется до пяти исполнителей (курьеров)" || (width >= 700 && (result.workTools.cards[0].y !== result.workTools.cards[1].y || result.workTools.cards[2].y <= result.workTools.cards[0].y || Math.abs(result.workTools.cards[2].width - (result.workTools.cards[0].width + result.workTools.cards[1].width + 32)) > 1)) || (width < 700 && !(result.workTools.cards[0].y < result.workTools.cards[1].y && result.workTools.cards[1].y < result.workTools.cards[2].y && result.workTools.cards[2].y < result.workTools.noteY)) || (width >= 1200 && Math.abs(result.workTools.noteX - (result.workTools.cards[2].x + result.workTools.cards[2].width + 100)) > 1)) {
      throw new Error(`${name}: work tools ${JSON.stringify(result.workTools)}`);
    }
    const [badgeType, navType, actionType] = result.header.typography;
    if (result.header.dividerHeight !== "1px" || result.header.dividerColor !== "rgba(255, 255, 255, 0.16)" || result.header.badgeGradient.opacity !== "0.16" || !result.header.badgeGradient.background.includes("rgba(255, 255, 255, 0.48)") || !result.header.badgeGradient.background.includes("rgba(255, 255, 255, 0.08)") || result.header.typography.some((style) => !style.family.includes("suisse")) || badgeType.weight !== "500" || badgeType.size !== (width <= 991 ? "11px" : "12px") || badgeType.lineHeight !== (width <= 991 ? "14px" : "16px") || navType.weight !== "400" || navType.size !== "16px" || navType.lineHeight !== "24px" || result.header.navColor !== "rgba(255, 255, 255, 0.64)" || actionType.weight !== "500" || actionType.size !== "16px" || actionType.lineHeight !== "24px" || (width > 991 && (result.header.actionHeight !== 48 || result.header.actionColor !== result.header.heroSecondaryColor))) {
      throw new Error(`${name}: campaign header styling ${JSON.stringify(result.header)}`);
    }
    if (response?.status() !== 200 || result.header.count !== 1 || result.header.height !== 80 || result.header.spacerHeight !== 80 || !result.header.logoLoaded || !result.header.badge || result.header.languageCount !== 0 || result.header.heroTopPadding !== (width <= 991 ? 40 : 80) || (width <= 991 ? !result.header.menuVisible || !result.header.menuLoaded || result.header.navVisible : result.header.menuVisible || !result.header.navVisible || result.header.nav.join() !== "Акция,Как работает,Кому подходит,Вопросы") || plain(result.title) !== "Доставка на завтра без ручного планирования" || plain(result.tag) !== "Геопоток бесплатно до конца февраля" || !result.tagIconLoaded || result.tagGeometry.height !== 40 || result.tagGeometry.gap !== "4px" || result.tagGeometry.padding !== "8px 12px" || result.tagGeometry.radius !== "12px" || result.tagGeometry.color !== "rgb(59, 182, 67)" || result.tagGeometry.background !== "rgba(25, 170, 30, 0.12)" || result.tagGeometry.blur !== "blur(40px)" || result.buttons.length !== 2 || !result.imageLoaded || result.keyPoints.length !== 3 || result.keyPoints.some((card, i) => plain(card.title) !== expectedKeyPoints[i][0] || plain(card.description) !== expectedKeyPoints[i][1] || !card.iconLoaded || card.direction !== "row") || result.heroToCards !== (width <= 991 ? 64 : 80) || (width >= 900 && result.keyPoints.some((card) => card.height !== result.keyPoints[0].height)) || plain(result.workflow.title) !== "От списка заказов до маршрута в телефоне" || result.workflow.intro.length !== 1 || result.workflow.eyebrowCount !== 0 || plain(result.workflow.intro[0]) !== "Логист готовит план на завтра, курьеры начинают день с распределенными задачами." || result.workflow.headingToDescription !== 20 || result.workflow.descriptionToCards !== (width <= 768 ? 36 : 48) || result.workflow.descriptionStyle.fontSize !== "16px" || result.workflow.descriptionStyle.lineHeight !== "24px" || result.workflow.descriptionStyle.color !== "rgb(255, 255, 255)" || (width >= 900 && result.workflow.columns !== 2) || result.workflow.cards.length !== 4 || result.workflow.cards.some((card, i) => plain(card.heading) !== expectedSteps[i] || plain(card.text) !== expectedStepTexts[i] || card.number !== String(i + 1).padStart(2, "0") || card.clipped) || !result.faq.afterCapabilities || plain(result.faq.title) !== "Вопросы и ответы" || result.faq.questions.length !== expectedFaq.length || result.faq.questions.some((question, i) => plain(question.text) !== expectedFaq[i][0] || plain(question.answer) !== expectedFaq[i][1] || question.expanded !== (i === 0 ? "true" : "false")) || (width >= 1200 && result.h2TooWide.length) || result.footerCount || result.overflow) {
      throw new Error(`${name}: ${JSON.stringify({ status: response?.status(), ...result })}`);
    }
    const audience = await page.locator("#audience-scenarios").evaluate((section) => ({
      afterKeyPoints: section.previousElementSibling?.id === "key-points",
      title: section.querySelector("h2")?.textContent,
      titleWhiteSpace: getComputedStyle(section.querySelector("h2")).whiteSpace,
      description: section.querySelector("h2 + p")?.textContent,
      panelTitle: section.querySelector("h3")?.textContent,
      tags: [...section.querySelectorAll("li")].map((item) => item.textContent),
      actions: section.querySelectorAll("a, button").length,
      media: section.querySelector("[class*='media']")?.textContent,
      mediaBottomGap: Math.round(section.querySelector("[class*='panel']").getBoundingClientRect().bottom - section.querySelector("[class*='media']").getBoundingClientRect().bottom),
    }));
    const expectedAudienceTags = ["Планирование и перепланирование маршрутов", "Мобильное приложение с навигатором для курьеров", "Выгрузка построенных маршрутов в Excel", "Сравнение плана и факта"];
    if (!audience.afterKeyPoints || plain(audience.title) !== "Подключите команду и планируйте маршруты заранее" || audience.titleWhiteSpace !== "normal" || plain(audience.description) !== "Подключитесь к 2ГИС Геопотоку, подготовьте маршрут следующего рабочего дня/недели/месяца" || plain(audience.panelTitle) !== "Что входит" || audience.tags.length !== 4 || audience.tags.some((tag, index) => plain(tag) !== expectedAudienceTags[index]) || audience.actions !== 0 || audience.mediaBottomGap !== 0) throw new Error(`${name}: audience ${JSON.stringify(audience)}`);
    const finalCta = await page.locator("#connect").evaluate((section) => ({
      title: section.querySelector("h2")?.textContent,
      description: section.querySelector("p")?.textContent,
      action: section.querySelector("a")?.innerText,
      href: section.querySelector("a")?.getAttribute("href"),
      target: section.querySelector("a")?.getAttribute("target"),
      rel: section.querySelector("a")?.getAttribute("rel"),
      forms: section.querySelectorAll("form, input").length,
      visuals: section.querySelectorAll("[class*='visual']").length,
      imageLoaded: section.querySelector("picture img")?.naturalWidth > 0,
    }));
    const registrationUrl = "https://geoflow.2gis.ru/auth/register?utm_content=landing_page&utm_source=dev.2gis-geoflow&utm_medium=dev.2gis-geoflow&utm_campaign=dev.2gis-geoflow";
    if (plain(finalCta.title) !== "Подготовьте маршруты следующего рабочего дня" || plain(finalCta.description) !== "Оставьте рабочие контакты, чтобы обсудить подключение команды к 2ГИС ГеоПоток: Логистика" || plain(finalCta.action) !== "Подключить курьеров" || finalCta.href !== registrationUrl || finalCta.target !== "_blank" || finalCta.rel !== "noopener noreferrer" || finalCta.forms || finalCta.visuals !== 1 || !finalCta.imageLoaded) throw new Error(`${name}: final CTA ${JSON.stringify(finalCta)}`);
    await page.locator("#connect").screenshot({ path: join(output, `geoflow-final-cta-${name}.png`) });
    await page.locator("main > div:first-child section").screenshot({ path: join(output, `geoflow-hero-section-${name}.png`) });
    await page.screenshot({ path: join(output, `geoflow-hero-${name}.png`), fullPage: true });
    await page.evaluate(() => { const section = document.querySelector("#audience-scenarios"); window.scrollTo(0, section.getBoundingClientRect().top + scrollY - 100); });
    await page.screenshot({ path: join(output, `geoflow-audience-${name}.png`) });
    const headerState = () => page.evaluate(() => {
      const header = document.querySelector("body > header");
      return { mode: header.dataset.headerMode, position: getComputedStyle(header).position, top: Math.round(header.getBoundingClientRect().top) };
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(80);
    await page.evaluate(() => window.scrollTo(0, 170));
    await page.waitForTimeout(80);
    const beforeThreshold = await headerState();
    await page.evaluate(() => window.scrollTo(0, 220));
    await page.waitForTimeout(80);
    const afterThreshold = await headerState();
    await page.screenshot({ path: join(output, `geoflow-header-sticky-${name}.png`) });
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(80);
    const down = await headerState();
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(80);
    const up = await headerState();
    if (beforeThreshold.mode !== "top" || beforeThreshold.position !== "absolute" || afterThreshold.mode !== "sticky" || afterThreshold.position !== "fixed" || afterThreshold.top !== 0 || down.mode !== "sticky" || down.top !== 0 || up.mode !== "sticky" || up.top !== 0) {
      throw new Error(`${name}: header scroll behavior ${JSON.stringify({ beforeThreshold, afterThreshold, down, up })}`);
    }
    console.log(`${name}: OK`);
    await page.close();
  }
} finally {
  await browser.close();
}
