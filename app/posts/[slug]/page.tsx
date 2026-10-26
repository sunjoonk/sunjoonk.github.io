import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import ArticleToc from "../../../components/ArticleToc";
import { ArticleReveal, PostBackLink, PostTitle } from "../../../components/PostTransition";
import { getPostBySlug, getPosts } from "../../../lib/posts";
import { getRelatedPosts } from "../../../lib/related-posts";

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
      modifiedTime: post.updatedAt,
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
  const relatedPosts = getRelatedPosts(post.slug);

  return (
    <>
      <Header key={post.slug} readingProgress />
      <main className="blog-main article-main" id="main-content">
        <article className="blog-container" aria-labelledby="article-title">
          <div className="article-breadcrumb">
            <PostBackLink slug={post.slug}>← 글 목록</PostBackLink>
            <span>NOTE {String(post.id).padStart(2, "0")}</span>
          </div>
          <header className="article-header">
            <div className="article-edition">
              <p className="article-eyebrow">{post.category}</p>
              <span className="article-number" aria-hidden="true">{String(post.id).padStart(2, "0")}</span>
              <p>Research &<br />Reflections</p>
            </div>
            <div className="article-heading">
              <PostTitle slug={post.slug}><h1 id="article-title">{post.title}</h1></PostTitle>
              <p className="article-deck">{post.description}</p>
              <div className="article-byline">
                <Link href="/about">김선준 <span>Sunjoon Kim</span></Link>
                <div className="article-dates">
                  <span>발행 <time dateTime={post.publishedAt}>{post.publishedAt.replaceAll("-", ".")}</time></span>
                  {post.updatedAt && <span>수정 <time dateTime={post.updatedAt}>{post.updatedAt.replaceAll("-", ".")}</time></span>}
                </div>
              </div>
            </div>
          </header>
          <ArticleReveal><div className="article-layout">
            <ArticleToc sections={post.sections} />
            <div className="article-prose"><Content /></div>
          </div></ArticleReveal>
          <footer className="article-end">
            <span className="article-eyebrow">End of note {String(post.id).padStart(2, "0")}</span>
            <Link href="/#writing">모든 글 보기 <span aria-hidden="true">↗</span></Link>
          </footer>
          {relatedPosts.length > 0 && (
            <section className="related-reading" aria-labelledby="related-reading-heading">
              <header className="related-reading-header">
                <h2 id="related-reading-heading">다음에 읽을 것</h2>
                <Link href="/#writing">전체 글 둘러보기 ↗</Link>
              </header>
              <ul className="related-reading-list">
                {relatedPosts.map(({ post: related, reason }) => (
                  <li key={related.slug}>
                    <Link href={`/posts/${related.slug}`}>
                      <span className="article-eyebrow">{related.category}</span>
                      <h3>{related.title}</h3>
                      <p>{reason}</p>
                      <span className="story-link-label">이어서 읽기 <span aria-hidden="true">↗</span></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
    </>
  );
}
