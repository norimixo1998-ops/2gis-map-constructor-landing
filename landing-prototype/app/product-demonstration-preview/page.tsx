import { ProductDemonstration } from "../../components/product-demonstration/ProductDemonstration";
import styles from "./page.module.css";

const background = {
  desktop: "/images/product-demonstration/light_desktop.png",
  mobile: "/images/product-demonstration/Light_mobile.png",
};

export default function ProductDemonstrationPreview() {
  return (
    <main className={styles.preview}>
      <ProductDemonstration id="product-with-title" title="Заголовок" background={background} />
      <ProductDemonstration id="product-without-title" background={background} />
    </main>
  );
}
