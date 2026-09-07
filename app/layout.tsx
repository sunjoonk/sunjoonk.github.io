import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import Footer from "../components/Footer";

const siteUrl = "https://sunjoonk.github.io";
const siteTitle = "Sunjoon Kim — Technical Notes";
const siteDescription =
  "AI의 이론을 실제 서비스로 연결하며 얻은 문제 해결 과정과 배움을 기록하는 김선준의 기술 블로그";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Sunjoon Kim",
  },
  description: siteDescription,
  applicationName: "Sunjoon Kim Technical Notes",
  icons: {
    icon: [
      {
        url: "/logo.png",
        type: "image/png",
        sizes: "1254x1254",
      },
    ],
    shortcut: "/logo.png",
    apple: [
      {
        url: "/logo.png",
        type: "image/png",
        sizes: "1254x1254",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    url: "/",
    siteName: "Sunjoon Kim Technical Notes",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#151714" },
  ],
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(() => {
            try {
              const savedTheme = localStorage.getItem("theme");
              const theme = savedTheme === "light" || savedTheme === "dark"
                ? savedTheme
                : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
              document.documentElement.dataset.theme = theme;
            } catch {
              document.documentElement.dataset.theme = "light";
            }
          })();`}
        </Script>
        <a className="skip-link" href="#main-content">
          본문으로 건너뛰기
        </a>
        {children}
        <Footer />
      </body>
    </html>
  );
}
