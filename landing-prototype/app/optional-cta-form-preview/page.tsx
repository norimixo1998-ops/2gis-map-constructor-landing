import { OptionalCtaForm } from "../../components/optional-cta-form/OptionalCtaForm";

const previewForm = {
  id: "connect",
  title: "Подготовьте маршруты следующего рабочего дня",
  description: "Оставьте рабочие контакты, чтобы обсудить подключение команды к 2ГИС ГеоПоток: Логистика",
  submitLabel: "Подключить курьеров",
};

export default function OptionalCtaFormPreviewPage() {
  return (
    <main style={{ paddingTop: 80 }}>
      <OptionalCtaForm {...previewForm} />
    </main>
  );
}
