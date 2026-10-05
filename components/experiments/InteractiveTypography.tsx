"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./InteractiveTypography.module.css";

const text = "재밌는 화면을 만나면 잠깐 멈추게 된다. 마우스를 움직이고, 글자를 건드리고, 어떻게 만들었을지 생각한다. 오늘은 구경하는 대신 직접 만들어보기로 했다.";

export default function InteractiveTypography() {
  const id = useId();
  const stage = useRef<HTMLDivElement>(null);
  const simulation = useRef<() => void>(() => {});
  const [radius, setRadius] = useState(110);
  const [strength, setStrength] = useState(24);
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
  }, [radius, strength, enabled, reduced]);

  return <figure className={styles.figure} aria-labelledby={`${id}-caption`}>
    <div className={styles.heading}><span>TYPE PLAYGROUND</span><span>01 / 밀어내기</span></div>
    <div ref={stage} className={styles.stage}>
      <p className={styles.accessible}>{text}</p>
      <p className={styles.text} aria-hidden="true">{text.split(" ").map((word, i) => <span key={i}><span className={styles.word}>{Array.from(word).map((char, j) => <span className={styles.anchor} key={j}><span data-letter className={styles.letter}>{char}</span></span>)}</span>{" "}</span>)}</p>
    </div>
    <div className={styles.controls}>
      <label htmlFor={`${id}-radius`}>반응 범위 <output>{radius}px</output><input id={`${id}-radius`} type="range" min="60" max="180" step="10" value={radius} onChange={e => setRadius(Number(e.target.value))} /></label>
      <label htmlFor={`${id}-strength`}>이동 강도 <output>{strength}px</output><input id={`${id}-strength`} type="range" min="8" max="40" step="2" value={strength} onChange={e => setStrength(Number(e.target.value))} /></label>
      <div className={styles.buttons}><button type="button" onClick={() => simulation.current()} disabled={!enabled || reduced}>움직임 체험</button><button type="button" aria-pressed={!enabled} onClick={() => setEnabled(v => !v)} disabled={reduced}>{enabled ? "효과 끄기" : "효과 켜기"}</button></div>
    </div>
    <figcaption id={`${id}-caption`} className={styles.caption}>{reduced ? "기기의 동작 줄이기 설정에 따라 정적인 글자로 표시합니다." : "글자 위로 마우스를 움직여보세요. 터치 화면이나 키보드에서는 ‘움직임 체험’ 버튼으로 볼 수 있습니다."}</figcaption>
  </figure>;
}
