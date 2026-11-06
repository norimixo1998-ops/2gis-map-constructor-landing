"use client";

import { useRef, useState, type MouseEvent, type PointerEvent } from "react";

/** Shared mouse-drag and snap behavior for the narrow-screen card strips. */
export function useCardCarousel(draggingClassName: string) {
  const drag = useRef<{ pointerId: number; x: number; scrollLeft: number; targetLeft: number; moved: boolean } | null>(null);
  const moveFrame = useRef<number | null>(null);
  const settleFrame = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  function easeDrag(list: HTMLUListElement) {
    const active = drag.current;
    if (!active) { moveFrame.current = null; return; }
    const remaining = active.targetLeft - list.scrollLeft;
    if (Math.abs(remaining) < 0.5) {
      list.scrollLeft = active.targetLeft;
      moveFrame.current = null;
      return;
    }
    list.scrollLeft += remaining * 0.65;
    moveFrame.current = requestAnimationFrame(() => easeDrag(list));
  }

  function settleToNearestCard(list: HTMLUListElement, intendedLeft: number) {
    const listLeft = list.getBoundingClientRect().left;
    const maxLeft = list.scrollWidth - list.clientWidth;
    const cardPositions = Array.from(list.children, (card) =>
      Math.min(maxLeft, card.getBoundingClientRect().left - listLeft + list.scrollLeft)
    );
    const target = cardPositions.reduce((nearest, position) =>
      Math.abs(position - intendedLeft) < Math.abs(nearest - intendedLeft) ? position : nearest
    );
    const start = list.scrollLeft;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      list.scrollLeft = target;
      setIsDragging(false);
      return;
    }
    const startedAt = performance.now();
    function animate(now: number) {
      const progress = Math.min(1, (now - startedAt) / 220);
      list.scrollLeft = start + (target - start) * (1 - (1 - progress) ** 3);
      if (progress < 1) settleFrame.current = requestAnimationFrame(animate);
      else { settleFrame.current = null; setIsDragging(false); }
    }
    settleFrame.current = requestAnimationFrame(animate);
  }

  function onPointerDown(event: PointerEvent<HTMLUListElement>) {
    const list = event.currentTarget;
    if (event.pointerType !== "mouse" || event.button !== 0 || list.scrollWidth <= list.clientWidth) return;
    if (settleFrame.current !== null) cancelAnimationFrame(settleFrame.current);
    settleFrame.current = null;
    suppressClick.current = false;
    drag.current = { pointerId: event.pointerId, x: event.clientX, scrollLeft: list.scrollLeft, targetLeft: list.scrollLeft, moved: false };
  }

  function onPointerMove(event: PointerEvent<HTMLUListElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const list = event.currentTarget;
    const distance = event.clientX - active.x;
    if (!active.moved && Math.abs(distance) > 5) {
      active.moved = true;
      list.setPointerCapture(event.pointerId);
      list.classList.add(draggingClassName);
      setIsDragging(true);
    }
    if (!active.moved) return;
    active.targetLeft = Math.max(0, Math.min(list.scrollWidth - list.clientWidth, active.scrollLeft - distance));
    if (moveFrame.current === null) moveFrame.current = requestAnimationFrame(() => easeDrag(list));
  }

  function onPointerUp(event: PointerEvent<HTMLUListElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    suppressClick.current = active.moved;
    drag.current = null;
    if (moveFrame.current !== null) cancelAnimationFrame(moveFrame.current);
    moveFrame.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (active.moved) settleToNearestCard(event.currentTarget, active.targetLeft);
    else setIsDragging(false);
  }

  function onClickCapture(event: MouseEvent<HTMLUListElement>) {
    if (!suppressClick.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  }

  function onDragStart(event: MouseEvent<HTMLUListElement>) {
    if (event.currentTarget.scrollWidth > event.currentTarget.clientWidth) event.preventDefault();
  }

  return { isDragging, onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onClickCapture, onDragStart };
}
