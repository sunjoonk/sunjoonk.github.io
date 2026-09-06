export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language?: string; code: string };

export type Post = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  body: PostBlock[];
};

export const posts: Post[] = [];

export function getPosts(): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
