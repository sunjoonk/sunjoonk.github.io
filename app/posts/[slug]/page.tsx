import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import { getPostBySlug, getPosts } from "../../../lib/posts";

export const dynamicParams = false;

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams(): { slug: string }[] {
  return getPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="blog-main">
        <article className="post-article">
          <p className="blog-kicker">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="post-lead">{post.description}</p>
          <time dateTime={post.publishedAt}>{post.publishedAt}</time>

          <div className="post-content">
            {post.body.map((block, index) => {
              if (block.type === "heading") {
                return <h2 key={`${block.type}-${index}`}>{block.text}</h2>;
              }

              if (block.type === "list") {
                return (
                  <ul key={`${block.type}-${index}`}>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }

              if (block.type === "code") {
                return (
                  <pre key={`${block.type}-${index}`}>
                    <code>{block.code}</code>
                  </pre>
                );
              }

              return <p key={`${block.type}-${index}`}>{block.text}</p>;
            })}
          </div>
        </article>
      </main>
    </>
  );
}
