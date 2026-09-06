# Posts

새 기술 블로그 게시글은 이 디렉터리에서 MDX 파일로 관리합니다.

게시글 파일은 소문자 영문과 하이픈으로 이름을 작성합니다.

```text
content/posts/my-first-post.mdx
```

각 게시글은 다음 메타데이터를 export합니다.

```mdx
export const metadata = {
  title: "게시글 제목",
  description: "게시글 요약",
  category: "Category",
  publishedAt: "YYYY-MM-DD",
};

# 게시글 제목

본문을 작성합니다.
```

첫 게시글을 추가할 때 `/posts/[slug]` 정적 라우트와 홈 목록 로더를 함께 연결합니다.
