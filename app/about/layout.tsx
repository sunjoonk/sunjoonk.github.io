import type { Metadata } from "next";
import type { ReactNode } from "react";

const description =
  "AI를 활용해 더 나은 제품을 만드는 개발자 김선준의 일하는 방식과 관심사를 소개합니다.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "김선준 소개",
    description,
    type: "website",
    url: "/about",
  },
  twitter: {
    card: "summary",
    title: "김선준 소개",
    description,
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
