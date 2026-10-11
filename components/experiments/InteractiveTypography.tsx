"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./InteractiveTypography.module.css";

const radius = 110;
const strength = 12;

export default function InteractiveTypography({ text }: { text: string }) {
  const stage = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  const simulation = useRef<() => void>(() => {});
  const [enabled, setEnabled] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = stage.current;
    if (!root || !enabled || reduced) return;
    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-letter]"));
    const particles = letters.map(el => ({ el, cx: 0, cy: 0, x: 0, y: 0, vx: 0, vy: 0 }));
    let pointer: { x: number; y: number } | null = null;
    let frame = 0, previous = 0, accumulator = 0, demoStart: number | null = null;
    let disposed = false;
    const measure = () => {
      // Measure stationary wrappers, never the transformed letters.
      particles.forEach(p => {
        const rect = p.el.parentElement!.getBoundingClientRect();
        p.cx = rect.left + rect.width / 2;
        p.cy = rect.top + rect.height / 2;
      });
    };
    const draw = (now: number) => {
      frame = 0;
      accumulator += Math.min(now - (previous || now), 50);
      previous = now;
      if (demoStart !== null) {
        const progress = (now - demoStart) / 2400;
        const box = root.getBoundingClientRect();
        pointer = progress < 1 ? { x: box.left + box.width * progress, y: box.top + box.height * (0.5 + Math.sin(progress * Math.PI * 2) * 0.2) } : null;
        if (progress >= 1) demoStart = null;
      }
      while (accumulator >= 1000 / 60) {
        particles.forEach(p => {
          const dx = p.cx - (pointer?.x ?? p.cx), dy = p.cy - (pointer?.y ?? p.cy);
          const distance = Math.hypot(dx, dy);
          const influence = pointer ? Math.max(0, 1 - distance / radius) ** 2 : 0;
          const tx = dx / Math.max(distance, 1) * influence * strength;
          const ty = dy / Math.max(distance, 1) * influence * strength;
          p.vx = (p.vx + (tx - p.x) * 0.12) * 0.75;
          p.vy = (p.vy + (ty - p.y) * 0.12) * 0.75;
          p.x += p.vx; p.y += p.vy;
        });
        accumulator -= 1000 / 60;
      }
      let moving = false;
      particles.forEach(p => {
        const active = Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.vx) + Math.abs(p.vy) > 0.025;
        moving ||= active;
        if (!active && !pointer) p.x = p.y = p.vx = p.vy = 0;
        p.el.style.transform = `translate(${p.x.toFixed(3)}px, ${p.y.toFixed(3)}px) rotate(${(p.x * 0.22).toFixed(3)}deg)`;
      });
      if (moving || pointer || demoStart !== null) frame = requestAnimationFrame(draw);
      else previous = accumulator = 0;
    };
    const wake = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(draw); };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      demoStart = null;
      pointer = { x: event.clientX, y: event.clientY };
      wake();
    };
    const leave = () => { pointer = null; demoStart = null; wake(); };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = previous = accumulator = 0;
      pointer = null; demoStart = null;
      particles.forEach(p => { p.x = p.y = p.vx = p.vy = 0; p.el.style.transform = ""; });
      measure();
    };
    simulation.current = () => { measure(); demoStart = performance.now(); wake(); };
    const resize = new ResizeObserver(reset);
    resize.observe(root);
    measure();
    document.fonts.ready.then(() => { if (!disposed) reset(); });
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", reset, { passive: true, capture: true });
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      disposed = true;
      reset(); resize.disconnect(); simulation.current = () => {};
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", reset, true);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, [text, enabled, reduced]);

  return <>
    <p ref={stage} className={styles.paragraph}>
      <span className={styles.accessible}>{text}</span>
      <span aria-hidden="true">{words.map((word, i) => <span key={i}><span className={styles.word}>{Array.from(word).map((char, j) => <span className={styles.anchor} key={j}><span data-letter className={styles.letter}>{char}</span></span>)}</span>{i < words.length - 1 ? " " : ""}</span>)}</span>
    </p>
    <div className={styles.actions}>
      {reduced ? <span>동작 줄이기 설정에 따라 움직임을 멈췄습니다.</span> : <>
        <button type="button" onClick={() => simulation.current()} disabled={!enabled}>이 문단 움직여 보기</button>
        <button type="button" aria-pressed={!enabled} onClick={() => setEnabled(v => !v)}>{enabled ? "움직임 끄기" : "움직임 켜기"}</button>
      </>}
    </div>
  </>;
}
