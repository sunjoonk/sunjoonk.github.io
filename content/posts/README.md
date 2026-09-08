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
  readingMinutes: 5,
};

export const sections = [
  { id: "introduction", title: "들어가며" },
];

<h2 id="introduction">들어가며</h2>

본문을 작성합니다.
```

`lib/posts.ts`에서 MDX의 기본 컴포넌트와 `metadata`, `sections`를 명시적으로 import하고
`posts` 배열에 고유한 `id`, `slug`, `Content`, `sections`와 메타데이터를 등록합니다.
등록하면 홈 목록, `/posts/[slug]` 정적 페이지, 사이트맵에 함께 반영됩니다.
상세 페이지가 제목과 작성자 정보를 표시하므로 본문에는 h1을 넣지 않습니다.
목차의 `id`는 본문 h2의 `id`와 일치해야 합니다.

표는 별도 Markdown 플러그인 없이 MDX의 HTML `<table>`로 작성합니다.
가로 스크롤이 필요한 표는 `article-table-wrap` 클래스로 감싸고 키보드 접근을 위해
`role="region"`, `aria-label`, `tabIndex={0}`을 지정합니다.
사실 주장 가까이에 원문 링크를 달고, 글 마지막에 참고 자료와 확인일을 기록합니다.
