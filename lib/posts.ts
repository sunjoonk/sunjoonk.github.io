import AstraArticle, { metadata as astraMetadata, sections as astraSections } from "../content/posts/gpt-6-astra.mdx";
import GitArticle, { metadata as gitMetadata, sections as gitSections } from "../content/posts/git-internals-and-collaboration.mdx";
import RagArticle, { metadata as ragMetadata, sections as ragSections } from "../content/posts/rag-beyond-similarity.mdx";
import AwsArticle, { metadata as awsMetadata, sections as awsSections } from "../content/posts/aws-deployment-and-operations.mdx";
import JevArticle, { metadata as jevMetadata, sections as jevSections } from "../content/posts/jev-system-one.mdx";
import type { ComponentType } from "react";

export type Post = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  sections: { id: string; title: string }[];
  Content: ComponentType;
};

// Explicit local imports keep the static export deterministic and MDX trusted.
export const posts: Post[] = [{
  ...jevMetadata,
  id: 5,
  slug: "jev-system-one",
  sections: jevSections,
  Content: JevArticle,
}, {
  ...awsMetadata,
  id: 4,
  slug: "aws-deployment-and-operations",
  sections: awsSections,
  Content: AwsArticle,
}, {
  ...ragMetadata,
  id: 3,
  slug: "rag-beyond-similarity",
  sections: ragSections,
  Content: RagArticle,
}, {
  ...gitMetadata,
  id: 2,
  slug: "git-internals-and-collaboration",
  sections: gitSections,
  Content: GitArticle,
}, {
  ...astraMetadata,
  id: 1,
  slug: "gpt-6-astra",
  sections: astraSections,
  Content: AstraArticle,
}];

export function getPosts(): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
