import { IconFeatureNumbers } from "../../components/icon-feature-numbers/IconFeatureNumbers";
import { workTools } from "../../content/geoflow-hero-preview";
import { typographContent } from "../../lib/typography";

export default function IconFeatureNumbersPreview() {
  return <main><IconFeatureNumbers {...typographContent(workTools)} id="icon-feature-numbers" /></main>;
}
