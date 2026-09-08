declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const metadata: {
    title: string;
    description: string;
    category: string;
    publishedAt: string;
    readingMinutes: number;
  };
  export const sections: { id: string; title: string }[];

  const Content: ComponentType;
  export default Content;
}
