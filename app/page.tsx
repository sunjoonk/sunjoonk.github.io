import Link from "next/link";
import Header from "../components/Header";
import { getPosts } from "../lib/posts";

export default function Home() {
  const posts = getPosts();

  return (
    <>
      <Header />
      <main className="blog-main">
        <div className="blog-container">
          <section className="blog-home-hero">
            <p className="blog-kicker">Development Journal</p>

            <h1>
              Sunjoon&apos;s
              <br />
              Devlog
            </h1>

            <p>
              개발자로서의 소양을 키우기 위해 차근차근 기록해 나가는 블로그입니다.
            </p>
          </section>

          <section className="journal-section">
            <header className="journal-header">
              <p className="blog-kicker">Journal</p>
              <h2>최근 글</h2>
            </header>

            {posts.length > 0 ? (
              <div className="journal-grid">
                {posts.map((post) => (
                  <article className="journal-card" key={post.id}>
                    <Link className="journal-card-link" href={`/posts/${post.slug}`}>
                      <div className="journal-card-visual" aria-hidden="true">
                        <span>{post.category}</span>
                        <div />
                      </div>

                      <div className="journal-card-body">
                        <p>{post.category}</p>
                        <h3>{post.title}</h3>
                        <p>{post.description}</p>
                        <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-posts">아직 작성된 글이 없습니다.</p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
