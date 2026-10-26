import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header({ sticky = false }: { sticky?: boolean }) {
  return (
    <header className={`blog-header${sticky ? " blog-header-sticky" : ""}`}>
      <div className="blog-header-inner">
        <div className="blog-masthead">
          <Link className="blog-brand" href="/">
            <span>Sunjoon Kim</span>
            <span>Technical Notes</span>
          </Link>
        </div>

        <nav className="blog-nav" aria-label="주요 메뉴">
          <Link href="/">Home</Link>
          <Link href="/#writing">Post</Link>
          <Link href="/about">About</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
