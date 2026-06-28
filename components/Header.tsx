import Link from "next/link";

export default function Header() {
  return (
    <header className="blog-header">
      <div className="blog-header-inner">
        <Link className="blog-brand" href="/">
          Sunjoon&apos;s Dev Blog
        </Link>

        <nav className="blog-nav" aria-label="주요 메뉴">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
