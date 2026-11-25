import type { Metadata } from "next";
import { Hero } from "../../components/hero/Hero";
import { MainValues } from "../../components/main-values/MainValues";
import { StartWork } from "../../components/start-work/StartWork";
import { Faq } from "../../components/faq/Faq";
import { CampaignHeader } from "../../components/campaign-header/CampaignHeader";
import { ImageFeatureCards } from "../../components/image-feature-cards/ImageFeatureCards";
import { IconFeatureNumbers } from "../../components/icon-feature-numbers/IconFeatureNumbers";
import { DeliveryScenarios } from "../../components/delivery-scenarios/DeliveryScenarios";
import { OptionalCtaForm } from "../../components/optional-cta-form/OptionalCtaForm";
import { capabilities, connectForm, deliveryScenarios, faq, hero, keyPoints, workTools, workflow } from "../../content/geoflow-hero-preview";
import { typographContent } from "../../lib/typography";
import styles from "./page.module.css";

const copy = typographContent({ hero, keyPoints, workflow, deliveryScenarios, capabilities, workTools, faq, connectForm });

export const metadata: Metadata = {
  title: "Маршруты на завтра — акция ГеоПотока",
  description: hero.description,
  robots: { index: false, follow: false },
};

export default function GeoflowHeroPreviewPage() {
  return <><CampaignHeader /><main className={styles.page}><div className={styles.heroStage}><Hero {...copy.hero} /></div><MainValues {...copy.keyPoints} /><StartWork {...copy.workflow} /><DeliveryScenarios {...copy.deliveryScenarios} /><IconFeatureNumbers {...copy.workTools} /><ImageFeatureCards {...copy.capabilities} /><Faq {...copy.faq} /><OptionalCtaForm {...copy.connectForm} /></main></>;
}
