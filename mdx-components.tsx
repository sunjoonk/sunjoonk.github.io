import type { MDXComponents } from "mdx/types";
import { ArticleImage, ArticleVideo } from "./components/ArticleMedia";

const components: MDXComponents = { ArticleImage, ArticleVideo };

export function useMDXComponents(): MDXComponents {
  return components;
}
