"use client";

import { useEffect, useRef, useState } from "react";
import { publicAsset } from "../../lib/public-asset";
import { ChatLauncherIcon } from "./ChatLauncherIcon";
import styles from "./AiChat.module.css";

type Message = { id: number; role: "user" | "assistant"; text: string };

const suggestions = [
  "Данные для геоаналитики",
  "Подключить карты и поиск",
  "Документация API",
];

const reply =
  "Могу помочь с выбором продукта. Для задач геоаналитики начните с раздела о данных и отраслевых решениях. Если опишете сценарий и регион, подскажу, что изучить дальше.";

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const responseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, thinking]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "24px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    if (draft) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [draft, open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (responseTimer.current) clearTimeout(responseTimer.current);
    };
  }, []);

  function send(text: string) {
    const question = text.trim();
    if (!question || thinking) return;
    setOpen(true);
    setDraft("");
    setMessages((current) => [...current, { id: nextId.current++, role: "user", text: question }]);
    setThinking(true);
    responseTimer.current = setTimeout(() => {
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", text: reply }]);
      setThinking(false);
    }, 900);
  }

  return (
    <div className={styles.dock}>
      {open && (
        <section className={styles.panel} aria-label="Чат с AI-ассистентом">
          <div className={styles.conversation} ref={scrollRef} aria-live="polite">
            {messages.length === 0 ? (
              <div className={styles.intro}>
                <p className={styles.greeting}>Расскажите о задаче и я подскажу нужный продукт, дам ссылки</p>
                <p className={styles.suggestionLabel}>Может быть интересно:</p>
                <div className={styles.suggestions}>
                  {suggestions.map((item) => (
                    <button className={styles.suggestion} key={item} onClick={() => send(item)} type="button">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.messages}>
                {messages.map((message) => (
                  <div key={message.id} className={`${styles.message} ${styles[message.role]}`}>
                    <p>{message.text}</p>
                    {message.role === "assistant" && (
                      <div className={styles.answerLinks}>
                        <a href="#main-values">Данные и решения ↗</a>
                        <a href="#lead-form">Получить консультацию ↗</a>
                      </div>
                    )}
                  </div>
                ))}
                {thinking && <p className={styles.thinking} role="status">Ассистент думает...</p>}
              </div>
            )}
          </div>

          <div className={styles.panelHeader}>
            <div className={styles.headerTitle}>
              <img className={styles.headerIcon} src={publicAsset("/icons/ai-chat/logo-assistent_icon.svg")} alt="" aria-hidden="true" />
              <span>AI-ассистент</span>
            </div>
            <button className={styles.close} type="button" aria-label="Закрыть чат" onClick={() => setOpen(false)}>
              <img src={publicAsset("/icons/ai-chat/close.svg")} alt="" />
            </button>
          </div>

          <form className={styles.inputArea} onSubmit={(event) => { event.preventDefault(); send(draft); }}>
            <div className={styles.inputBar} data-state={thinking ? "loading" : draft.trim() ? "entered" : inputFocused ? "focused" : "default"}>
              <textarea
                ref={textareaRef}
                aria-label="Задать вопрос"
                placeholder="Задать вопрос"
                rows={1}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    send(draft);
                  }
                }}
                disabled={thinking}
              />
              <button className={styles.send} type="submit" aria-label="Отправить вопрос" disabled={!draft.trim() || thinking}>
                {thinking ? <span className={styles.spinner} aria-hidden="true" /> : <img src={publicAsset(draft.trim() ? "/icons/ai-chat/send-active.svg" : "/icons/ai-chat/send.svg")} alt="" />}
              </button>
            </div>
            <p className={styles.disclaimer}>AI-ассистент может ошибаться. Проверяйте важную информацию.</p>
          </form>
        </section>
      )}
      <button className={styles.launcher} type="button" aria-label={open ? "Закрыть чат" : "Открыть чат с AI-ассистентом"} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <ChatLauncherIcon />
      </button>
    </div>
  );
}
