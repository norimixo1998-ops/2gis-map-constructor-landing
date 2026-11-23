import { HeroVariant2 } from "../components/hero/HeroVariant2";
import { LeadForm } from "../components/lead-form/LeadForm";
import { MainValues } from "../components/main-values/MainValues";
import { Faq } from "../components/faq/Faq";
import { Reasons } from "../components/reasons/Reasons";
import { StartWork } from "../components/start-work/StartWork";
import { ImageFeatureCards } from "../components/image-feature-cards/ImageFeatureCards";
import { IntermediateCta } from "../components/intermediate-cta/IntermediateCta";
import { TechnicalDemonstration } from "../components/technical-demonstration/TechnicalDemonstration";
import { AiChat } from "../components/ai-chat/AiChat";
import { faq, heroVariant2, intermediateCta, leadForm, mainValues, reasons, imageFeatureCards, startWork, technicalDemonstration } from "../content/map-constructor";
import { typographContent } from "../lib/typography";

const copy = typographContent({
  heroVariant2,
  mainValues,
  imageFeatureCards,
  intermediateCta,
  technicalDemonstration,
  startWork,
  reasons,
  faq,
  leadForm,
});

export default function Page() {
  return (
    <>
      <main>
        <HeroVariant2 {...copy.heroVariant2} />
        <MainValues {...copy.mainValues} />
        <ImageFeatureCards {...copy.imageFeatureCards} />
        <IntermediateCta {...copy.intermediateCta} />
        <TechnicalDemonstration {...copy.technicalDemonstration} />
        <StartWork {...copy.startWork} />
        <Reasons {...copy.reasons} />
        <Faq {...copy.faq} />
        <LeadForm {...copy.leadForm} />
      </main>
      <AiChat />
    </>
  );
}
