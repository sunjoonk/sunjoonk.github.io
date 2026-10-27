"use client";

import { useId } from "react";
import type { Post } from "../lib/posts";
import { PostLink, useArchiveCategory } from "./PostTransition";
import PostArchive from "./PostArchive";
import styles from "./JournalHome.module.css";

type Summary = Pick<Post, "slug" | "title" | "description" | "category" | "publishedAt">;
const labels: Record<string, string> = {
  AI: "AI", "리서치": "리서치",
  Engineering: "엔지니어링",
};

function Cover({ category }: { category: string }) {
  const id = useId();
  return (
    <div className={styles.cover} aria-hidden="true">
      <svg viewBox="0 0 640 480" fill="none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={id} x1="80" y1="100" x2="560" y2="380" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c1dec8" /><stop offset=".5" stopColor="#68a8a3" /><stop offset="1" stopColor="#dec5a0" />
          </linearGradient>
        </defs>
        <g stroke="#a5c9b2" opacity=".1">
          {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${i * 54} 0v480`} />)}
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M0 ${i * 54}h640`} />)}
        </g>
        <g stroke={`url(#${id})`}>
          {Array.from({ length: 17 }, (_, i) => (
            <path key={i} d={`M-30 ${330 + i * 4} C140 ${350 - i * 9}, 150 ${50 + i * 6}, 330 ${150 + i * 7} S470 ${440 - i * 5}, 680 ${95 + i * 7}`} opacity={.3 + i * .035} strokeWidth="1.3" />
          ))}
          <circle cx="320" cy="240" r="146" opacity=".45" />
          <circle cx="320" cy="240" r="171" opacity=".2" strokeDasharray="2 8" />
          <path d="M290 240h60m-30-30v60" opacity=".6" />
        </g>
        <circle cx="320" cy="94" r="5" fill="#c1dec8" />
        <circle cx="466" cy="240" r="4" fill="#dec5a0" />
      </svg>
      <span className={styles.coverLabel}>FIELD NOTES / {category.toUpperCase()}</span>
      <span className={styles.coverCaption}>From ideas to systems.</span>
    </div>
  );
}

export default function JournalHome({ posts }: { posts: Summary[] }) {
  const { archiveCategory } = useArchiveCategory();
  const categories = [...new Set(posts.map((post) => post.category))];
  const selected = categories.includes(archiveCategory) ? archiveCategory : "all";
  const filtered = selected === "all" ? posts : posts.filter((post) => post.category === selected);
  const featured = filtered[0];
  const title = selected === "all" ? "전체 아티클" : labels[selected] ?? selected;

  return (
    <main className={`blog-main ${styles.home}`} id="main-content">
      <h1 className={styles.status}>Sunjoon Kim — Technical Notes</h1>
      <div className={styles.layout}>
        <div className={styles.content} id="journal-results">
          <p className={styles.status} role="status">{title} · {filtered.length}편</p>
          {featured && (
            <section className={styles.featured} aria-label={`${title}의 최신 글`}>
              <PostLink slug={featured.slug} slot="featured">
                <Cover category={featured.category} />
                <div className={styles.featuredCopy}>
                  <p className={styles.meta}>{labels[featured.category] ?? featured.category} <span>·</span> <time dateTime={featured.publishedAt}>{featured.publishedAt.replaceAll("-", ".")}</time></p>
                  <h2>{featured.title}</h2>
                  <p className={styles.description}>{featured.description}</p>
                  <span className={styles.read}>아티클 읽기 <span aria-hidden="true">↗</span></span>
                </div>
              </PostLink>
            </section>
          )}
          <PostArchive posts={filtered} title={title} />
        </div>
      </div>
    </main>
  );
}
