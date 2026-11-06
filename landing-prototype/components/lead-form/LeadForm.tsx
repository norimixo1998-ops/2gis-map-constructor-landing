"use client";

import { useState, type FormEvent } from "react";
import { publicAsset } from "../../lib/public-asset";
import styles from "./LeadForm.module.css";

export type LeadFormProps = {
  title: string;
  productId: string;
  productLabel: string;
  submitLabel?: string;
  action?: string;
};

const assetPath = publicAsset("/images/lead-form/");

export function LeadForm({
  title,
  productId,
  productLabel,
  submitLabel = "Отправить заявку",
  action,
}: LeadFormProps) {
  const [previewMessage, setPreviewMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!action) {
      event.preventDefault();
      setPreviewMessage("Форма готова к проверке. Отправка заявок пока не подключена.");
    }
  }

  return (
    <section className={styles.section} id="lead-form" aria-labelledby="lead-form-title">
      <div className={styles.card}>
        <h2 id="lead-form-title">{title}</h2>
        <div className={styles.body}>
          <form className={styles.form} action={action} method="post" onSubmit={handleSubmit}>
            <input type="hidden" name="pageProductId" value={productId} />
            <div className={styles.fields}>
              <label className={styles.field}>
                <span className={styles.srOnly}>Имя и фамилия</span>
                <input name="fullName" autoComplete="name" placeholder="Имя и фамилия" required />
              </label>
              <label className={styles.field}>
                <span className={styles.srOnly}>Город</span>
                <input name="city" autoComplete="address-level2" placeholder="Город" />
              </label>
              <label className={`${styles.field} ${styles.phoneField}`}>
                <span className={styles.phonePrefix} aria-hidden="true">
                  <span className={styles.flag}>
                    <span className={styles.flagWhite}><img src={`${assetPath}flag-group.svg`} alt="" /></span>
                    <img src={`${assetPath}flag-group-1.svg`} alt="" />
                  </span>
                  <img className={styles.flagChevron} src={`${assetPath}flag-chevron.svg`} alt="" />
                </span>
                <span className={styles.srOnly}>Телефон</span>
                <input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Телефон" />
              </label>
              <label className={styles.field}>
                <span className={styles.srOnly}>Эл. почта</span>
                <input name="email" type="email" autoComplete="email" placeholder="Эл. почта" required />
              </label>
              <label className={styles.field}>
                <span className={styles.srOnly}>Компания</span>
                <input name="company" autoComplete="organization" placeholder="Компания" />
              </label>
              <label className={`${styles.field} ${styles.productField}`}>
                <span className={styles.srOnly}>Выберите продукт</span>
                <select name="productId" defaultValue="" required>
                  <option value="" disabled>Выберите продукт</option>
                  <option value={productId}>{productLabel}</option>
                </select>
                <img src={`${assetPath}clear.svg`} alt="" aria-hidden="true" />
              </label>
              <label className={`${styles.field} ${styles.taskField}`}>
                <span className={styles.srOnly}>Опишите задачу</span>
                <textarea name="task" placeholder="Опишите задачу" rows={4} />
              </label>
            </div>
            <div className={styles.formFooter}>
              <button type="submit">{submitLabel}</button>
              <p className={styles.legal}>
                Нажимая на кнопку «Отправить», вы принимаете условия{" "}
                <a href="https://law.2gis.ru/licensing-agreement/" target="_blank" rel="noopener noreferrer">Лицензионного соглашения</a>.
                {" "}Условия и цели обработки персональных данных определены в{" "}
                <a href="https://law.2gis.ru/privacy/" target="_blank" rel="noopener noreferrer">Политике конфиденциальности</a>.
                {" "}<a href="https://law.2gis.ru/personal-data-dublgis/" target="_blank" rel="noopener noreferrer">Политика обработки персональных данных</a>.
              </p>
            </div>
            {previewMessage && <p className={styles.previewMessage} role="status">{previewMessage}</p>}
          </form>
          <img className={styles.illustration} src={`${assetPath}illustration.png`} alt="" />
        </div>
      </div>
      <div className={styles.contacts}>
        <div className={styles.contactItem}>
          <img src={`${assetPath}contact-icon.svg`} alt="" />
          <a href="tel:+79665000050">+7 966 500-00-50</a>
        </div>
        <div className={styles.contactItem}>
          <span>Контактный номер</span>
          <a href="tel:88002003600">8 800 200-36-00</a>
        </div>
        <div className={styles.contactItem}>
          <span>Показать офисы на карте</span>
          <a href="mailto:dev@2gis.ru">dev@2gis.ru</a>
        </div>
      </div>
    </section>
  );
}
