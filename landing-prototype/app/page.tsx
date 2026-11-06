import { Hero } from "../components/hero/Hero";
import { LeadForm } from "../components/lead-form/LeadForm";
import { MainValues } from "../components/main-values/MainValues";
import { ProductDemonstration } from "../components/product-demonstration/ProductDemonstration";
import { Faq } from "../components/faq/Faq";
import { Reasons } from "../components/reasons/Reasons";
import { StartWork } from "../components/start-work/StartWork";
import { SolvedTasks } from "../components/solved-tasks/SolvedTasks";
import { IntermediateCta } from "../components/intermediate-cta/IntermediateCta";
import { TechnicalDemonstration } from "../components/technical-demonstration/TechnicalDemonstration";
import { faq, hero, intermediateCta, leadForm, mainValues, productDemonstration, solvedTasks, startWork, technicalDemonstration } from "../content/map-constructor";
import { reasons } from "../content/geoflow-logistics-preview";

export default function Page() {
  return (
    <main>
      <Hero {...hero} />
      <MainValues {...mainValues} />
      <ProductDemonstration {...productDemonstration} />
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
