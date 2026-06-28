import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: {
    default: "김선준 - 포트폴리오",
    template: "%s | 김선준",
  },
  description: "AI 엔지니어 김선준의 포트폴리오와 기술 블로그",
  openGraph: {
    title: "김선준 - 포트폴리오",
    description: "AI 기술로 현실의 문제를 해결하는 엔지니어",
    type: "website",
    url: "https://sunjoonk.github.io",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
