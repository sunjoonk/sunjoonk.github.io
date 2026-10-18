import type { Metadata } from "next";
import type { ReactNode } from "react";

const description =
  "RAG 기반 시험 장비 자동화 서비스를 개발하는 AI 엔지니어이자 풀스택 개발자 김선준의 일과 관심사를 소개합니다.";

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
