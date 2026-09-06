import Link from "next/link";

export default function Header() {
  return (
    <header className="blog-header">
      <div className="blog-header-inner">
        <div className="blog-masthead">
          <Link className="blog-brand" href="/">
            <span>Sunjoon Kim</span>
            <span>Technical Notes</span>
          </Link>
        </div>

        <nav className="blog-nav" aria-label="주요 메뉴">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
