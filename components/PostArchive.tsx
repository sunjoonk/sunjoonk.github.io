"use client";

import type { Post } from "../lib/posts";
import { PostLink, PostTitle, useArchiveView } from "./PostTransition";

type ArchivePost = Pick<Post, "slug" | "title" | "description" | "category" | "publishedAt" | "readingMinutes">;

export default function PostArchive({ posts }: { posts: ArchivePost[] }) {
  const { archiveView, setArchiveView } = useArchiveView();
  const cards = archiveView === "cards";

  return (
    <section className="writing-section" aria-labelledby="writing-heading">
      <header className="editorial-section-header archive-header">
        <p className="blog-kicker">Archive</p>
        <div className="archive-heading-row">
          <h2 id="writing-heading">전체 글</h2>
          <div className="archive-view-toggle" role="group" aria-label="아카이브 보기 방식">
            <button type="button" aria-pressed={!cards} aria-controls="post-archive" onClick={() => setArchiveView("list")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M1 3h2m3 0h9M1 8h2m3 0h9M1 13h2m3 0h9" /></svg>
              목록
            </button>
            <button type="button" aria-pressed={cards} aria-controls="post-archive" onClick={() => setArchiveView("cards")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M1 1h5v5H1zM10 1h5v5h-5zM1 10h5v5H1zM10 10h5v5h-5z" /></svg>
              카드
            </button>
          </div>
        </div>
      </header>
      <ol id="post-archive" className={cards ? "archive-cards" : "writing-list"}>
        {posts.map((post, index) => (
          <li key={post.slug}>
            <PostLink slug={post.slug} slot="archive">
              <span className="writing-index">{String(index + 1).padStart(2, "0")}</span>
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
              <PostTitle slug={post.slug} slot="archive"><strong>{post.title}</strong></PostTitle>
              {cards && <p className="archive-description">{post.description}</p>}
              {cards && <span className="archive-reading-time">약 {post.readingMinutes}분</span>}
              <span className="archive-category">{post.category}</span>
              <span className="writing-arrow" aria-hidden="true">↗</span>
            </PostLink>
          </li>
        ))}
      </ol>
    </section>
  );
}
