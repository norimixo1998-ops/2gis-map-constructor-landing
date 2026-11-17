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
const mobileSheetExitMs = 240;

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [draft, setDraft] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const responseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomFadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTop = useRef(0);
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
      if (event.key === "Escape" && open) closeChat();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    return () => {
      if (responseTimer.current) clearTimeout(responseTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (bottomFadeTimer.current) clearTimeout(bottomFadeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const mobileViewport = window.matchMedia("(max-width: 767px)");
    const previousOverflow = document.body.style.overflow;
    const syncScrollLock = () => {
      document.body.style.overflow = mobileViewport.matches ? "hidden" : previousOverflow;
    };
    syncScrollLock();
    mobileViewport.addEventListener("change", syncScrollLock);
    return () => {
      mobileViewport.removeEventListener("change", syncScrollLock);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const dock = dockRef.current;
    const visualViewport = window.visualViewport;
    if (!dock) return;
    const syncVisibleViewport = () => {
      dock.style.setProperty("--chat-visual-top", `${visualViewport?.offsetTop ?? 0}px`);
      dock.style.setProperty("--chat-visual-height", `${visualViewport?.height ?? window.innerHeight}px`);
    };
    syncVisibleViewport();
    visualViewport?.addEventListener("resize", syncVisibleViewport);
    visualViewport?.addEventListener("scroll", syncVisibleViewport);
    window.addEventListener("resize", syncVisibleViewport);
    return () => {
      visualViewport?.removeEventListener("resize", syncVisibleViewport);
      visualViewport?.removeEventListener("scroll", syncVisibleViewport);
      window.removeEventListener("resize", syncVisibleViewport);
      dock.style.removeProperty("--chat-visual-top");
      dock.style.removeProperty("--chat-visual-height");
    };
  }, [open]);

  function closeChat() {
    if (closeTimer.current) return;
    setShowBottomFade(false);
    if (window.matchMedia("(max-width: 767px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setClosing(true);
      closeTimer.current = setTimeout(() => {
        setOpen(false);
        setClosing(false);
        closeTimer.current = null;
      }, mobileSheetExitMs);
    } else {
      setOpen(false);
    }
  }

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

  function handleConversationScroll(event: React.UIEvent<HTMLDivElement>) {
    const scrollTop = event.currentTarget.scrollTop;
    const distance = scrollTop - lastScrollTop.current;
    if (Math.abs(distance) < 0.5) return;
    lastScrollTop.current = scrollTop;
    setShowBottomFade(distance > 0);
    if (bottomFadeTimer.current) clearTimeout(bottomFadeTimer.current);
    bottomFadeTimer.current = setTimeout(() => setShowBottomFade(false), 350);
  }

  return (
    <div ref={dockRef} className={`${styles.dock} ${open ? styles.dockOpen : ""} ${closing ? styles.dockClosing : ""}`}>
      {open && (
        <>
        <button className={styles.backdrop} type="button" tabIndex={-1} aria-label="Закрыть чат" onClick={closeChat} />
        <section className={styles.panel} aria-label="Чат с ИИ-ассистентом">
          <div className={styles.conversationFrame} data-bottom-fade={showBottomFade}>
          <div className={styles.conversation} ref={scrollRef} onScroll={handleConversationScroll} aria-live="polite">
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
          </div>

          <div className={styles.panelHeader}>
            <div className={styles.headerTitle}>
              <img className={styles.headerIcon} src={publicAsset("/icons/ai-chat/logo-assistent_icon.svg")} alt="" aria-hidden="true" />
              <span>ИИ-ассистент</span>
            </div>
            <button className={styles.close} type="button" aria-label="Закрыть чат" onClick={closeChat}>
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
            <p className={styles.disclaimer}>ИИ-ассистент может ошибаться. Проверяйте важную информацию.</p>
          </form>
        </section>
        </>
      )}
      <button className={styles.launcher} type="button" aria-label={open ? "Закрыть чат" : "Открыть чат с ИИ-ассистентом"} aria-expanded={open} onClick={() => open ? closeChat() : setOpen(true)}>
        <ChatLauncherIcon />
      </button>
    </div>
  );
}
