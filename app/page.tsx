import Link from "next/link";
import Header from "../components/Header";
import { getPosts } from "../lib/posts";

export default function Home() {
  const posts = getPosts();
  const [featuredPost, ...restPosts] = posts;
  const secondaryPosts = restPosts.slice(0, 3);

  return (
    <>
      <Header />
      <main className="blog-main" id="main-content">
        <div className="blog-container">
          <section className="blog-home-hero">
            <p className="blog-kicker">Research · Engineering · Systems</p>

            <h1>
              <span>기술을 이해하고,</span>
              <span>구현하며, 기록합니다.</span>
            </h1>

            <p>
              AI의 이론을 실제 서비스로 연결하는 과정에서 발견한 문제와 선택,
              그리고 배운 것을 기록합니다.
            </p>
          </section>

          {featuredPost ? (
            <>
              <section className="featured-section" aria-labelledby="featured-heading">
                <header className="editorial-section-header">
                  <p className="blog-kicker">Selected writing</p>
                  <h2 id="featured-heading">주요 글</h2>
                </header>

                <div
                  className={
                    secondaryPosts.length > 0
                      ? "featured-layout"
                      : "featured-layout featured-layout-single"
                  }
                >
                  <article className="featured-story">
                    <Link href={`/posts/${featuredPost.slug}`}>
                      <div className="story-meta">
                        <span>{featuredPost.category}</span>
                        <time dateTime={featuredPost.publishedAt}>
                          {featuredPost.publishedAt}
                        </time>
                      </div>
                      <h3>{featuredPost.title}</h3>
                      <p>{featuredPost.description}</p>
                      <span className="story-link-label">
                        글 읽기 <span aria-hidden="true">↗</span>
                      </span>
                    </Link>
                  </article>

                  {secondaryPosts.length > 0 && (
                    <ol className="secondary-stories">
                      {secondaryPosts.map((post, index) => (
                        <li key={post.slug}>
                          <Link href={`/posts/${post.slug}`}>
                            <span className="story-index">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="secondary-story-copy">
                              <span className="story-meta">
                                <span>{post.category}</span>
                                <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                              </span>
                              <strong>{post.title}</strong>
                              <span>{post.description}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </section>

              <section className="writing-section" aria-labelledby="writing-heading">
                <header className="editorial-section-header">
                  <p className="blog-kicker">Archive</p>
                  <h2 id="writing-heading">전체 글</h2>
                </header>

                <ol className="writing-list">
                  {posts.map((post, index) => (
                    <li key={post.slug}>
                      <Link href={`/posts/${post.slug}`}>
                        <span className="writing-index">{String(index + 1).padStart(2, "0")}</span>
                        <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                        <strong>{post.title}</strong>
                        <span>{post.category}</span>
                        <span className="writing-arrow" aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            </>
          ) : (
            <section
              className="writing-section empty-writing-section"
              aria-labelledby="writing-heading"
            >
              <header className="editorial-section-header">
                <p className="blog-kicker">Archive</p>
                <h2 id="writing-heading">전체 글</h2>
              </header>

              <div className="editorial-empty-state">
                <span aria-hidden="true">001</span>
                <div>
                  <h3>첫 번째 기록을 준비하고 있습니다.</h3>
                  <p>곧 AI 엔지니어링과 시스템 구현 과정에서 얻은 배움을 공유합니다.</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
