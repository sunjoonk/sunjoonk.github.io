import type { MDXComponents } from "mdx/types";
import { isValidElement, type ComponentProps } from "react";
import ArticleCode from "./components/ArticleCode";
import { ArticleImage, ArticleVideo } from "./components/ArticleMedia";
import { ArticleNoteGraph } from "./components/ArticleNoteGraph";
import { RelationshipGraph } from "./components/visualizations";

function CodeBlock({ children, ...props }: ComponentProps<"pre">) {
  if (isValidElement<{ children?: unknown; className?: string }>(children)
      && typeof children.props.children === "string") {
    const language = children.props.className?.match(/language-([\w-]+)/)?.[1];
    return <ArticleCode code={children.props.children} language={language} />;
  }
  return <pre {...props}>{children}</pre>;
}

const components: MDXComponents = { pre: CodeBlock, ArticleCode, ArticleImage, ArticleVideo, ArticleNoteGraph, RelationshipGraph };

export function useMDXComponents(): MDXComponents {
  return components;
}
