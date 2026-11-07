import { HeroVariant2 } from "../components/hero/HeroVariant2";
import { LeadForm } from "../components/lead-form/LeadForm";
import { MainValues } from "../components/main-values/MainValues";
import { Faq } from "../components/faq/Faq";
import { Reasons } from "../components/reasons/Reasons";
import { StartWork } from "../components/start-work/StartWork";
import { SolvedTasks } from "../components/solved-tasks/SolvedTasks";
import { IntermediateCta } from "../components/intermediate-cta/IntermediateCta";
import { TechnicalDemonstration } from "../components/technical-demonstration/TechnicalDemonstration";
import { faq, heroVariant2, intermediateCta, leadForm, mainValues, solvedTasks, startWork, technicalDemonstration } from "../content/map-constructor";
import { reasons } from "../content/geoflow-logistics-preview";

export default function Page() {
  return (
    <main>
      <HeroVariant2 {...heroVariant2} />
      <MainValues {...mainValues} />
      <SolvedTasks {...solvedTasks} />
      <IntermediateCta {...intermediateCta} />
      <TechnicalDemonstration {...technicalDemonstration} />
      <StartWork {...startWork} />
      <Reasons {...reasons} />
      <Faq {...faq} />
      <LeadForm {...leadForm} />
    </main>
  );
}
