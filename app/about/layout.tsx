import type { Metadata } from "next";
import type { ReactNode } from "react";

const description =
  "AI 모델 구현부터 서비스 개발과 배포까지, 김선준의 경험과 기술적 관심사를 소개합니다.";

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
