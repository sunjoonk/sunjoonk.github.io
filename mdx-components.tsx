import type { MDXComponents } from "mdx/types";
import { ArticleImage, ArticleVideo } from "./components/ArticleMedia";
import { ArticleNoteGraph } from "./components/ArticleNoteGraph";
import { RelationshipGraph } from "./components/visualizations";

const components: MDXComponents = { ArticleImage, ArticleVideo, ArticleNoteGraph, RelationshipGraph };

export function useMDXComponents(): MDXComponents {
  return components;
}
