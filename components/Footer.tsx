import Link from "next/link";
import { FaGithub, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="blog-kicker">Sunjoon Kim</p>
        <h2>AI의 이론과 서비스를 연결하는 기록.</h2>

        <div className="site-footer-row">
          <nav className="site-footer-links" aria-label="Footer navigation">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <a href="https://github.com/sunjoonk" target="_blank" rel="noopener noreferrer">
              <FaGithub size={16} />
              GitHub
            </a>
            <a href="mailto:sunjoon.dev@gmail.com">
              <FaEnvelope size={16} />
              Email
            </a>
          </nav>

          <p className="site-footer-meta">
            © 2026 Sunjoon Kim · Built with <span>Next.js</span> and <span>TypeScript</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
