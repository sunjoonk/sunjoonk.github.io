import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import ArticleToc from "../../../components/ArticleToc";
import { ArticleReveal, PostBackLink, PostTitle } from "../../../components/PostTransition";
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
                <div><time dateTime={post.publishedAt}>{post.publishedAt.replaceAll("-", ".")}</time><span>약 {post.readingMinutes}분</span></div>
              </div>
            </div>
          </header>
          <ArticleReveal><div className="article-layout">
            <ArticleToc sections={post.sections} />
            <div className="article-prose"><Content /></div>
          </div></ArticleReveal>
          <footer className="article-end">
            <span className="article-eyebrow">End of note {String(post.id).padStart(2, "0")}</span>
            <PostBackLink slug={post.slug}>모든 글 보기 <span aria-hidden="true">↗</span></PostBackLink>
          </footer>
        </article>
      </main>
    </>
  );
}
