"use client";

import { useArchiveCategory } from "./PostTransition";
import styles from "./TopicFilter.module.css";

const labels: Record<string, string> = { AI: "AI", Engineering: "엔지니어링", "리서치": "리서치" };

export default function TopicFilter({ posts }: { posts: { category: string }[] }) {
  const { archiveCategory, setArchiveCategory } = useArchiveCategory();
  const categories = [...new Set(posts.map((post) => post.category))];
  const selected = categories.includes(archiveCategory) ? archiveCategory : "all";
  const count = selected === "all" ? posts.length : posts.filter((post) => post.category === selected).length;

  return (
    <div className={styles.filter}>
      <div className={styles.options} role="group" aria-label="글 주제 필터">
        {["all", ...categories].map((category) => (
          <button key={category} type="button" aria-pressed={selected === category}
            aria-controls="journal-results" onClick={() => setArchiveCategory(category)}>
            {category === "all" ? "전체" : labels[category] ?? category}
          </button>
        ))}
      </div>
      <span className={styles.count} aria-hidden="true">{count}편</span>
    </div>
  );
}
