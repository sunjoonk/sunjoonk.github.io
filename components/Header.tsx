import type { ReactNode } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import ReadingProgress from "./ReadingProgress";

export default function Header({ sticky = false, readingProgress = false, topicFilter }: { sticky?: boolean; readingProgress?: boolean; topicFilter?: ReactNode }) {
  return (
    <header className={`blog-header${sticky || readingProgress ? " blog-header-sticky" : ""}`}>
      <div className="blog-header-inner">
        <div className="blog-masthead">
          <Link className="blog-brand" href="/">
            <span>Sunjoon Kim</span>
            <span>Technical Notes</span>
          </Link>
        </div>

        <nav className="blog-nav" aria-label="주요 메뉴">
          <Link href="/">Home</Link>
          {topicFilter}
          <Link href="/about">About</Link>
          <ThemeToggle />
        </nav>
      </div>
      {readingProgress && <ReadingProgress />}
    </header>
  );
}
