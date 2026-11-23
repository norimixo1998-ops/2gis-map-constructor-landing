"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import * as FlagIcons from "country-flag-icons/react/3x2";
import { publicAsset } from "../../lib/public-asset";
import { countries, type Country } from "./countries";
import styles from "./LeadForm.module.css";

type FieldName = "fullName" | "city" | "phone" | "email" | "company" | "productId" | "task";

export type LeadFormProps = {
  title: string;
  productId: string;
  productLabel: string;
  submitLabel?: string;
  action?: string;
  disabledFields?: FieldName[];
};

type TextFieldProps = {
  name: Exclude<FieldName, "productId">;
  label: string;
  error: string;
  invalid: boolean;
  disabled: boolean;
  required?: boolean;
  type?: "text" | "tel" | "email";
  autoComplete?: string;
  inputMode?: "tel";
  phonePrefix?: boolean;
  multiline?: boolean;
  onCountryChange?: () => void;
};

const assetPath = publicAsset("/images/lead-form/");

function CountryFlag({ country }: { country: Country }) {
  const FlagIcon = FlagIcons[country.iso as keyof typeof FlagIcons];
  return (
    <span className={styles.countryFlag} aria-hidden="true">
      {FlagIcon ? <FlagIcon /> : <span>{country.iso}</span>}
    </span>
  );
}

function PhonePrefix({ disabled, onSelect }: { disabled: boolean; onSelect?: () => void }) {
  const [country, setCountry] = useState(countries[0]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectorRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  function choose(nextCountry: Country) {
    setCountry(nextCountry);
    setOpen(false);
    onSelect?.();
    buttonRef.current?.focus();
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, Math.min(countries.length - 1, index + (event.key === "ArrowDown" ? 1 : -1))));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setActiveIndex(event.key === "Home" ? 0 : countries.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(countries[activeIndex]);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className={styles.countrySelector} ref={selectorRef} onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
    }}>
      <button
        ref={buttonRef}
        className={styles.phonePrefix}
        type="button"
        disabled={disabled}
        aria-label={`Выбрать код страны, сейчас ${country.name} ${country.code}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="lead-phone-countries"
        onClick={() => { setActiveIndex(countries.indexOf(country)); setOpen((current) => !current); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex(countries.indexOf(country));
            setOpen(true);
          }
        }}
      >
        <CountryFlag country={country} />
        <img className={styles.flagChevron} src={`${assetPath}flag-chevron.svg`} alt="" aria-hidden="true" />
      </button>
      <input type="hidden" name="phoneCountry" value={country.iso} />
      <input type="hidden" name="phoneCountryCode" value={country.code} />
      {open && (
        <ul className={styles.countryList} id="lead-phone-countries" role="listbox" aria-label="Код страны" onKeyDown={handleOptionKeyDown}>
          {countries.map((option, index) => (
            <li
              key={option.iso}
              ref={(node) => { optionRefs.current[index] = node; }}
              className={styles.countryOption}
              role="option"
              aria-selected={option.iso === country.iso}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => choose(option)}
            >
              <CountryFlag country={option} />
              <span className={styles.countryName}>{option.name}</span>
              <span className={styles.countryCode}>{option.code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function isFieldValid(target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  if (target.name === "fullName") return target.value.trim().length > 0 && target.checkValidity();
  if (target.name === "phone") {
    const value = target.value.trim();
    if (!value) return true;
    const digitCount = (value.match(/\d/g) ?? []).length;
    return /^\+?[\d\s().-]+$/.test(value) && digitCount >= 6 && digitCount <= 15;
  }
  return target.checkValidity();
}

function TextField({
  name, label, error, invalid, disabled, required, type = "text", autoComplete, inputMode, phonePrefix, multiline, onCountryChange,
}: TextFieldProps) {
  const errorId = `lead-${name}-error`;
  const control = multiline ? (
    <textarea
      name={name}
      rows={4}
      placeholder=" "
      disabled={disabled}
      aria-invalid={invalid}
      aria-describedby={invalid ? errorId : undefined}
    />
  ) : (
    <input
      name={name}
      type={type}
      autoComplete={autoComplete}
      inputMode={inputMode}
      required={required}
      placeholder=" "
      disabled={disabled}
      aria-invalid={invalid}
      aria-describedby={invalid ? errorId : undefined}
    />
  );

  const ControlTag = phonePrefix ? "label" : "span";
  const fieldContent = (
    <>
      {phonePrefix && <PhonePrefix disabled={disabled} onSelect={onCountryChange} />}
      <ControlTag className={styles.control}>
        {control}
        <span className={styles.floatLabel}>{label}</span>
      </ControlTag>
    </>
  );

  return (
    <div className={`${styles.fieldWrap} ${multiline ? styles.taskField : ""}`} data-invalid={invalid}>
      {phonePrefix ? (
        <div className={`${styles.field} ${styles.phoneField}`}>{fieldContent}</div>
      ) : (
        <label className={`${styles.field} ${multiline ? styles.multilineField : ""}`}>{fieldContent}</label>
      )}
      {invalid && <span className={styles.errorText} id={errorId} role="alert">{error}</span>}
    </div>
  );
}

export function LeadForm({
  title,
  productId,
  productLabel,
  submitLabel = "Отправить заявку",
  action,
  disabledFields = [],
}: LeadFormProps) {
  const [previewMessage, setPreviewMessage] = useState("");
  const [touched, setTouched] = useState<FieldName[]>([]);
  const [invalidFields, setInvalidFields] = useState<FieldName[]>([]);

  function isField(target: EventTarget): target is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
    return target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement;
  }

  function syncValidity(target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
    if (target.type === "hidden" || !target.name) return;
    const name = target.name as FieldName;
    const invalid = !isFieldValid(target);
    setInvalidFields((current) => invalid
      ? current.includes(name) ? current : [...current, name]
      : current.filter((field) => field !== name));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const fields = Array.from(event.currentTarget.elements).filter(
      (element): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
        element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement,
    );
    const invalid = fields.filter((field) => field.type !== "hidden" && !isFieldValid(field));
    if (invalid.length) {
      event.preventDefault();
      setPreviewMessage("");
      setInvalidFields(invalid.map((field) => field.name as FieldName));
      invalid[0].focus();
      return;
    }
    if (!action) {
      event.preventDefault();
      setPreviewMessage("Форма готова к проверке. Отправка заявок пока не подключена.");
    }
  }

  const isInvalid = (name: FieldName) => invalidFields.includes(name);
  const isDisabled = (name: FieldName) => disabledFields.includes(name);

  return (
    <section className={styles.section} id="lead-form" aria-labelledby="lead-form-title">
      <div className={styles.card}>
        <h2 id="lead-form-title">{title}</h2>
        <div className={styles.body}>
          <form
            className={styles.form}
            action={action}
            method="post"
            noValidate
            onSubmit={handleSubmit}
            onBlurCapture={(event) => {
              if (!isField(event.target) || event.target.type === "hidden") return;
              const name = event.target.name as FieldName;
              setTouched((current) => current.includes(name) ? current : [...current, name]);
              syncValidity(event.target);
            }}
            onChangeCapture={(event) => {
              setPreviewMessage("");
              if (isField(event.target) && (touched.includes(event.target.name as FieldName) || invalidFields.includes(event.target.name as FieldName))) {
                syncValidity(event.target);
              }
            }}
          >
            <input type="hidden" name="pageProductId" value={productId} />
            <div className={styles.fields}>
              <TextField name="fullName" label="Имя и фамилия" error="Укажите имя и фамилию" invalid={isInvalid("fullName")} disabled={isDisabled("fullName")} autoComplete="name" required />
              <TextField name="city" label="Город" error="Проверьте город" invalid={isInvalid("city")} disabled={isDisabled("city")} autoComplete="address-level2" />
              <TextField name="phone" label="Телефон" error="Проверьте телефон" invalid={isInvalid("phone")} disabled={isDisabled("phone")} type="tel" autoComplete="tel" inputMode="tel" phonePrefix onCountryChange={() => setPreviewMessage("")} />
              <TextField name="email" label="Эл. почта" error="Укажите корректную эл. почту" invalid={isInvalid("email")} disabled={isDisabled("email")} type="email" autoComplete="email" required />
              <TextField name="company" label="Компания" error="Проверьте компанию" invalid={isInvalid("company")} disabled={isDisabled("company")} autoComplete="organization" />
              <div className={styles.fieldWrap} data-invalid={isInvalid("productId")}>
                <label className={`${styles.field} ${styles.productField}`}>
                  <span className={styles.control}>
                    <select name="productId" defaultValue="" required disabled={isDisabled("productId")} aria-invalid={isInvalid("productId")} aria-describedby={isInvalid("productId") ? "lead-productId-error" : undefined}>
                      <option value="" disabled>Выберите продукт</option>
                      <option value={productId}>{productLabel}</option>
                    </select>
                    <span className={styles.floatLabel}>Выберите продукт</span>
                  </span>
                  <img src={`${assetPath}clear.svg`} alt="" aria-hidden="true" />
                </label>
                {isInvalid("productId") && <span className={styles.errorText} id="lead-productId-error" role="alert">Выберите продукт</span>}
              </div>
              <TextField name="task" label="Опишите задачу" error="Проверьте описание задачи" invalid={isInvalid("task")} disabled={isDisabled("task")} multiline />
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
