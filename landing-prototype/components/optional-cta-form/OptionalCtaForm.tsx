"use client";

import { useState, type FormEvent } from "react";
import { TextField } from "../lead-form/LeadForm";
import styles from "./OptionalCtaForm.module.css";

type FieldName = "fullName" | "company" | "email" | "phone";

export type OptionalCtaFormProps = {
  id?: string;
  title: string;
  description: string;
  submitLabel: string;
};

function isValid(field: HTMLInputElement) {
  if (field.name === "fullName") return field.value.trim().length > 0;
  if (field.name === "phone" && field.value.trim()) {
    const digits = (field.value.match(/\d/g) ?? []).length;
    return /^\+?[\d\s().-]+$/.test(field.value.trim()) && digits >= 6 && digits <= 15;
  }
  return field.checkValidity();
}

export function OptionalCtaForm({
  id = "optional-cta-form",
  title,
  description,
  submitLabel,
}: OptionalCtaFormProps) {
  const [invalidFields, setInvalidFields] = useState<FieldName[]>([]);
  const invalid = (name: FieldName) => invalidFields.includes(name);

  function updateValidity(field: HTMLInputElement) {
    const name = field.name as FieldName;
    setInvalidFields((current) => isValid(field)
      ? current.filter((item) => item !== name)
      : current.includes(name) ? current : [...current, name]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = Array.from(event.currentTarget.querySelectorAll<HTMLInputElement>("input"));
    const failed = fields.filter((field) => !isValid(field));
    setInvalidFields(failed.map((field) => field.name as FieldName));
    failed[0]?.focus();
  }

  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <div className={styles.card}>
        <div className={styles.intro}>
          <h2 id={`${id}-title`}>{title}</h2>
          <p>{description}</p>
        </div>
        <form
          className={styles.form}
          noValidate
          onSubmit={handleSubmit}
          onBlurCapture={(event) => {
            if (event.target instanceof HTMLInputElement) updateValidity(event.target);
          }}
          onChangeCapture={(event) => {
            if (event.target instanceof HTMLInputElement && invalid(event.target.name as FieldName)) updateValidity(event.target);
          }}
        >
          <div className={styles.fields}>
            <TextField idPrefix={id} name="fullName" label="ФИО" error="Укажите ФИО" invalid={invalid("fullName")} disabled={false} autoComplete="name" required />
            <TextField idPrefix={id} name="company" label="Название компании" error="Проверьте название компании" invalid={invalid("company")} disabled={false} autoComplete="organization" />
            <TextField idPrefix={id} name="email" label="Рабочая почта" error="Укажите корректную почту" invalid={invalid("email")} disabled={false} type="email" autoComplete="email" required />
            <TextField idPrefix={id} name="phone" label="Телефон" error="Проверьте телефон" invalid={invalid("phone")} disabled={false} type="tel" autoComplete="tel" inputMode="tel" />
          </div>
          <button className={styles.submit} type="submit">{submitLabel}</button>
        </form>
      </div>
    </section>
  );
}
