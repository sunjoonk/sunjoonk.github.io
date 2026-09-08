"use client";

import { useEffect, useRef, useState } from "react";

type Section = { id: string; title: string };

export default function ArticleToc({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const headings = sections.flatMap(({ id }) => {
      const element = document.getElementById(id);
      return element ? [element] : [];
    });
    let frame = 0;
    const update = () => {
      frame = 0;
      // Keep the current section selected through long stretches of body text.
      const readingLine = Math.min(160, window.innerHeight * 0.22);
      let current = headings[0];
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > readingLine) break;
        current = heading;
      }
      if (current) setActiveId(current.id);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    const prose = document.querySelector(".article-prose");
    if (prose) observer.observe(prose);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, [sections]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 821px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  if (!sections.length) return null;
  const activeIndex = Math.max(0, sections.findIndex(({ id }) => id === activeId));

  return (
    <aside className="article-rail article-toc">
      <nav ref={navRef} aria-label="이 글의 목차" data-open={open}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}>
        <button className="article-toc-toggle" ref={buttonRef} type="button"
          aria-expanded={open} aria-controls="article-toc-sections"
          onClick={() => setOpen(!open)}>
          <span className="article-toc-number">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="article-toc-current">{sections[activeIndex].title}</span>
          <span className="article-toc-toggle-label">목차</span>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="m4 10 4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
        <div className="article-toc-panel" id="article-toc-sections">
          <p className="article-eyebrow">Contents <span>{String(sections.length).padStart(2, "0")}</span></p>
          <ol>{sections.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`} aria-current={activeId === section.id ? "location" : undefined}
                onClick={() => {
                  setOpen(false);
                  const heading = document.getElementById(section.id);
                  if (heading) {
                    heading.setAttribute("tabindex", "-1");
                    heading.focus({ preventScroll: true });
                  }
                }}>
                <span>{String(index + 1).padStart(2, "0")}</span>{section.title}
              </a>
            </li>
          ))}</ol>
          <a className="article-top-link" href="#article-title">맨 위로 ↑</a>
        </div>
      </nav>
    </aside>
  );
}
