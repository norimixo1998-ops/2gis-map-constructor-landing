import { OptionalCtaForm } from "../../components/optional-cta-form/OptionalCtaForm";
import { connectForm } from "../../content/geoflow-hero-preview";

export default function OptionalCtaFormPreviewPage() {
  return (
    <main style={{ paddingTop: 80 }}>
      <OptionalCtaForm {...connectForm} />
    </main>
  );
}
