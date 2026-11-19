import type { Metadata } from "next";
import { Hero } from "../../components/hero/Hero";
import { MainValues } from "../../components/main-values/MainValues";
import { StartWork } from "../../components/start-work/StartWork";
import { Faq } from "../../components/faq/Faq";
import { AudienceScenarios } from "../../components/audience-scenarios/AudienceScenarios";
import { IntermediateCta } from "../../components/intermediate-cta/IntermediateCta";
import { TechnicalDemonstration } from "../../components/technical-demonstration/TechnicalDemonstration";
import { hero, offer, possibilities, audiences, steps, faq, finalCta } from "../../content/geoflow-holiday";
import { typographContent } from "../../lib/typography";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Планируйте доставку три месяца бесплатно — ГеоПоток: Логистика",
  description: "Черновик страницы предновогодней акции 2ГИС ГеоПоток: Логистика.",
  robots: { index: false, follow: false },
};

const copy = typographContent({ hero, offer, possibilities, audiences, steps, faq, finalCta });

export default function GeoflowHolidayPage() {
  return (
    <main className={styles.page}>
      <Hero {...copy.hero} />
      <AudienceScenarios {...copy.audiences} />
      <MainValues {...copy.offer} />
      <TechnicalDemonstration {...copy.possibilities} />
      <StartWork {...copy.steps} />
      <IntermediateCta {...copy.finalCta} />
      <Faq {...copy.faq} />
    </main>
  );
}
