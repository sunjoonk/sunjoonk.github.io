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

## 이미지·동영상과 캡션

본문에서는 `ArticleImage`, `ArticleVideo`를 사용합니다. MDX에 등록되어 있어
별도 import가 필요 없습니다. 일반 Markdown 이미지 문법에는 확대·캡션이 적용되지 않습니다.

- 캡션은 `그림 1. 설명` / `영상 1. 설명` 형식으로 미디어 바로 아래에 표시합니다.
- `number`와 `caption`은 필수입니다. 글 안에서 등장 순서대로 그림과 영상을 각각
  1부터 번호 매깁니다. 순서를 바꾸면 번호도 함께 수정합니다.
- `source`는 다음 줄에 `출처: …`로 표시합니다. 직접 만든 자료는 `직접 제작`,
  외부 자료는 원저작자·기관 이름을 적고 `sourceHref`에 원문 주소를 넣습니다.
- 이미지의 `alt`는 이미지를 보지 못해도 내용을 이해할 수 있게 작성합니다.
  이미지 안의 중요한 정보는 캡션이나 본문에도 설명합니다.
- `width`, `height`에는 원본 픽셀 크기를 적습니다. 본문 폭에 맞춰 원래 비율을 유지하며
  표시하고, 로딩 전에 공간을 확보합니다.
- 이미지는 클릭 또는 키보드 Enter/Space로 확대합니다. 닫기·배경 클릭·Esc로 닫고,
  포커스는 원래 이미지 버튼으로 돌아옵니다. 확대 중에는 배경 스크롤을 막습니다.
- 영상은 기본 플레이어에서 재생·볼륨·전체 화면을 제어합니다(브라우저 지원 범위).
  자동 재생하지 않으며, `captionsSrc`에 발화 자막용 WebVTT 파일을 지정할 수 있습니다.
  아래에 붙는 설명 캡션과 영상 발화 자막은 별개입니다.

파일을 `public/images/글-slug/`, `public/videos/글-slug/`에 저장한 뒤
`public`을 제외한 주소로 참조합니다. 아래 경로는 작성 예시이며 실제 파일을 추가해야 합니다.

```mdx
<ArticleImage
  src="/images/my-post/workflow.png"
  alt="조사, 구현, 검증 순으로 연결된 세 단계의 작업 흐름"
  width={1600}
  height={900}
  number={1}
  caption="조사에서 검증까지 이어지는 작업 흐름."
  source="직접 제작"
/>

<ArticleVideo
  src="/videos/my-post/demo.mp4"
  poster="/images/my-post/demo-poster.jpg"
  width={1920}
  height={1080}
  number={1}
  caption="요구사항을 수정하며 작업을 이어가는 과정."
  source="직접 촬영"
  captionsSrc="/videos/my-post/demo.ko.vtt"
  captionsLanguage="ko"
  captionsLabel="한국어"
/>
```

`poster`, `captionsSrc`, `source`, `sourceHref`는 선택 항목입니다.
외부 동영상 파일은 해당 서버의 접근·자막 CORS 정책에 따라 동작합니다.
YouTube 등 외부 플레이어 임베드는 이 파일 재생용 컴포넌트의 대상이 아닙니다.
