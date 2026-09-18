import type { MDXComponents } from "mdx/types";
import { ArticleImage, ArticleVideo } from "./components/ArticleMedia";
import { ArticleNoteGraph } from "./components/ArticleNoteGraph";

const components: MDXComponents = { ArticleImage, ArticleVideo, ArticleNoteGraph };

export function useMDXComponents(): MDXComponents {
  return components;
}
