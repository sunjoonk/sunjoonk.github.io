import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sunjoon Kim Technical Notes",
    short_name: "Technical Notes",
    description:
      "AI의 이론을 실제 서비스로 연결하며 얻은 문제 해결 과정과 배움을 기록하는 김선준의 기술 블로그",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f3ee",
    theme_color: "#f3f3ee",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
