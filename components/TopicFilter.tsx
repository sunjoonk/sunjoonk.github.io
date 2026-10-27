"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useArchiveCategory } from "./PostTransition";
import styles from "./TopicFilter.module.css";

const labels: Record<string, string> = { AI: "AI", Engineering: "엔지니어링", "리서치": "리서치" };

export default function TopicFilter({ posts }: { posts: { category: string }[] }) {
  const { archiveCategory, setArchiveCategory } = useArchiveCategory();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const categories = [...new Set(posts.map((post) => post.category))];
  const selected = categories.includes(archiveCategory) ? archiveCategory : "all";

  return (
    <div ref={root} className={styles.filter}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setOpen(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") setOpen(false); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
      onKeyDown={(event) => {
        if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
        if (event.key === "ArrowDown" && event.target === trigger.current) { event.preventDefault(); setOpen(true); }
      }}>
      <button ref={trigger} type="button" className={styles.trigger}
        aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}>
        {selected === "all" ? "Topics" : labels[selected] ?? selected}
        <span aria-hidden="true">⌄</span>
      </button>
      <div className={styles.dropdown} id={id} hidden={!open}>
        <div className={styles.options} role="group" aria-label="글 주제 필터">
          {["all", ...categories].map((category) => (
            <button key={category} type="button" aria-pressed={selected === category}
              aria-controls="journal-results" onClick={() => {
                setArchiveCategory(category);
                setOpen(false);
                trigger.current?.focus();
              }}>
              <span>{category === "all" ? "전체 글" : labels[category] ?? category}</span>
              <span className={styles.count}>{category === "all" ? posts.length : posts.filter((post) => post.category === category).length}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
