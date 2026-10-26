"use client";

import { useEffect, useRef, useState } from "react";

/** Track the article, excluding recommendations and the site footer. */
export default function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const header = ref.current?.closest("header");
    const title = document.getElementById("article-title");
    const prose = document.querySelector<HTMLElement>(".article-prose");
    if (!header || !title || !prose) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const headerHeight = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--reading-header-height", `${headerHeight}px`);
      const scroll = window.scrollY;
      const start = title.getBoundingClientRect().top + scroll - headerHeight;
      const end = prose.getBoundingClientRect().bottom + scroll - window.innerHeight;
      const ratio = end <= start ? (scroll >= end ? 1 : 0) : (scroll - start) / (end - start);
      setPercent(Math.round(Math.min(1, Math.max(0, ratio)) * 100));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(header);
    observer.observe(prose);
    const article = prose.closest("article");
    if (article) observer.observe(article);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.documentElement.style.removeProperty("--reading-header-height");
    };
  }, []);

  return (
    <div ref={ref} className="reading-progress" role="progressbar"
      aria-label="글 읽기 진행률" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <span style={{ transform: `scaleX(${percent / 100})` }} />
    </div>
  );
}
