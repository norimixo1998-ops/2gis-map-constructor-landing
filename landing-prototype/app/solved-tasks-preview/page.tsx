import { SolvedTasks, type SolvedTaskItem } from "../../components/solved-tasks/SolvedTasks";

const withButton: SolvedTaskItem = {
  title: "Текст блока",
  description: "Описание в две или три строки",
  action: { label: "Текст кнопки", href: "#solved-tasks-four" },
};

const withoutButton: SolvedTaskItem = {
  title: "Текст блока",
  description: "Описание в две или три строки",
};

export default function SolvedTasksPreview() {
  return (
    <main>
      <SolvedTasks id="solved-tasks-two" title="Заголовок" items={[withButton, withButton]} />
      <SolvedTasks id="solved-tasks-four" title="Решаемые задачи" items={[withoutButton, withoutButton, withoutButton, withoutButton]} />
    </main>
  );
}
