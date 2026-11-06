import { Faq } from "../../components/faq/Faq";
import { Hero } from "../../components/hero/Hero";
import { LeadForm } from "../../components/lead-form/LeadForm";
import { Reasons } from "../../components/reasons/Reasons";
import { faq, hero, leadForm, reasons } from "../../content/geoflow-logistics-preview";

export default function FaqPreviewPage() {
  return (
    <main>
      <Hero {...hero} />
      <Reasons {...reasons} />
      <Faq {...faq} items={Array.from({ length: 10 }, (_, index) => ({
        question: `Заголовок вопроса ${index + 1}`,
        answer: "Текст ответа в несколько строк",
      }))} />
      <LeadForm {...leadForm} />
    </main>
  );
}
