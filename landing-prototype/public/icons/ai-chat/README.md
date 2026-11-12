# Ассеты AI-чата

Сюда складывать финальные иконки чата в SVG (предпочтительно) или PNG. `Floating button_icon.svg` — исходная запечённая кнопка 56 × 56 px; анимированная версия с теми же формами находится в `components/ai-chat/ChatLauncherIcon.tsx`. `logo-assistent_icon.svg` — запечённый значок в шапке 32 × 32 px. `close.svg` — иконка закрытия; `send.svg` и `send-active.svg` — стрелка отправки с непрозрачностью 64% и 100%.

Если команда передаст новый логотип, замените соответствующие файлы с сохранением имён или обновите пути в `components/ai-chat/AiChat.tsx` и `components/ai-chat/ChatLauncherIcon.tsx`. Габариты и положение кнопки и окна задаются в `components/ai-chat/AiChat.module.css`.
