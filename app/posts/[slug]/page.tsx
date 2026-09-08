import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import { getPostBySlug, getPosts } from "../../../lib/posts";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/posts/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: ["Sunjoon Kim"],
      locale: "ko_KR",
    },
    twitter: { card: "summary", title: post.title, description: post.description },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();
  const { Content } = post;

  return (
    <>
      <Header />
      <main className="blog-main article-main" id="main-content">
        <article className="blog-container" aria-labelledby="article-title">
          <div className="article-breadcrumb">
            <Link href="/">← 글 목록</Link>
            <span>NOTE {String(post.id).padStart(2, "0")}</span>
          </div>
          <header className="article-header">
            <div className="article-edition">
              <p className="article-eyebrow">{post.category}</p>
              <span className="article-number" aria-hidden="true">{String(post.id).padStart(2, "0")}</span>
              <p>Research &<br />Reflections</p>
            </div>
            <div className="article-heading">
              <h1 id="article-title">{post.title}</h1>
              <p className="article-deck">{post.description}</p>
              <div className="article-byline">
                <Link href="/about">김선준 <span>Sunjoon Kim</span></Link>
                <div><time dateTime={post.publishedAt}>{post.publishedAt.replaceAll("-", ".")}</time><span>약 {post.readingMinutes}분</span></div>
              </div>
            </div>
          </header>
          <div className="article-layout">
            <aside className="article-rail">
              <nav aria-label="이 글의 목차">
                <p className="article-eyebrow">Contents</p>
                <ol>{post.sections.map((section, index) => (
                  <li key={section.id}><a href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a></li>
                ))}</ol>
                <a className="article-top-link" href="#article-title">맨 위로 ↑</a>
              </nav>
            </aside>
            <div className="article-prose"><Content /></div>
          </div>
          <footer className="article-end">
            <span className="article-eyebrow">End of note {String(post.id).padStart(2, "0")}</span>
            <Link href="/">모든 글 보기 <span aria-hidden="true">↗</span></Link>
          </footer>
        </article>
      </main>
    </>
  );
}
