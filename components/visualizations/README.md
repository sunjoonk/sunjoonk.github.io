# 시각 설명 컴포넌트

블로그의 시각 요소를 `components/visualizations`에서 관리합니다. 글에 종속된 데이터는
`content/visualizations`에 둡니다. 외부 차트 라이브러리 없이 React와 SVG로 렌더링합니다.

- `VisualFigure`: 제목, 배지, 컨트롤 영역, 그림 번호, 캡션, 출처를 공유하는 틀.
- `RelationshipGraph`: 소규모 관계를 설명하는 인터랙티브 그래프.
- `graph-model.ts`: 데이터 타입, 유효성 검사, 초기 배치와 인접 관계 계산.
- `index.ts`: 외부에서 사용할 컴포넌트와 타입의 진입점.

## MDX에서 사용

`RelationshipGraph`는 MDX에 등록되어 있어 import 없이 사용할 수 있습니다.
데이터가 커지면 별도 파일에서 `RelationshipGraphData` 타입으로 정의하고 import합니다.

```mdx
<RelationshipGraph
  title="서비스 관계"
  description="결제와 주문이 공통 인증 서비스를 사용하는 관계"
  number={2}
  caption="선은 서비스 사이의 연결을 나타낸다. 방향과 거리는 의미를 갖지 않는다."
  source="직접 제작 · 설명용 데이터"
  defaultSelectedId="auth"
  data={{
    nodes: [
      { id: "payment", label: "결제", description: "결제 요청을 처리한다." },
      { id: "order", label: "주문", description: "주문을 생성한다." },
      { id: "auth", label: "인증", description: "결제와 주문이 함께 사용하는 서비스다." },
    ],
    edges: [
      { source: "payment", target: "auth", label: "토큰 검증" },
      { source: "order", target: "auth", label: "토큰 검증" },
    ],
  }}
/>
```

React 코드에서는 `import { RelationshipGraph } from "./visualizations"`처럼 사용합니다.
실제 글에 연결한 예제는 `components/ArticleNoteGraph.tsx`와
`content/visualizations/rag-note-graph.ts`를 참고하세요.

## 데이터와 동작

- `nodes`: 고유한 `id`, 표시할 `label`, 선택 시 읽을 `description`, 선택적인 `position`.
  좌표는 640 × 450 SVG 기준입니다. 생략하면 원형 배치를 사용합니다.
- `description`은 문자열 또는 `(string | { text, nodeId })[]`입니다.
  `nodeId`가 있는 구간은 해당 노드를 선택하는 버튼으로 표시됩니다. HTML 문자열을 받지 않습니다.
- `edges`: `source`, `target`, 선택적인 `label`. **무방향 그래프**이며 각 연결은 한 번만
  정의합니다. 양방향으로 중복 입력하거나 자기 자신을 연결하면 오류가 납니다.
- 잘못된 ID, 없는 노드에 대한 참조, 유효하지 않은 좌표는 설명이 포함된 오류를 발생시킵니다.
  빈 데이터에는 빈 상태를 표시하고 조작 도구를 숨깁니다.
- `defaultSelectedId`를 생략하거나 찾지 못하면 첫 노드를 선택합니다.
- `sizeByDegree`는 기본적으로 꺼져 있습니다. 켜면 연결 수에 따라 점 크기가 커지며,
  캡션에 그 의미를 설명해야 합니다. 큰 그래프에서 겹치지 않도록 반지름은 제한됩니다.
- 선택한 노드의 주변만 보기, 드래그, 배치 초기화를 제공합니다. 초기화는 위치만 복원합니다.
- Tab으로 노드에 접근하고 Enter/Space로 선택합니다. 방향키는 노드를 10 SVG 단위씩 옮깁니다.
  기본 화면은 모바일에서도 전체 그래프를 가로폭에 맞춥니다. 확대·축소 버튼으로
  100~300% 배율을 50%씩 조절하고, 확대 후 영역 안에서 상하좌우로 스크롤합니다.
  확대는 선택 항목을 중심으로 하며, ‘전체 보기’는 배율·필터·스크롤을 초기화합니다.
  노드 배치는 유지합니다.
  터치 화면에서는 탭으로 선택하고 스와이프로 탐색합니다(노드 드래그는 마우스 사용).
- 전체 항목의 설명과 연결을 텍스트로 읽는 접이식 목록도 제공합니다.
- 노드 이름은 확대 배율과 화면 폭에 관계없이 화면상 13px을 유지합니다. 좁은 전체 보기에서는
  선택·포커스 항목과 이웃을 우선 표시하고, 확대하면 나머지 이름도 표시 후보에 포함합니다.
  문자 수로 추정한 영역이 겹치면 우선순위가 낮은 이름을 생략합니다. 모든 항목은 텍스트 목록으로 접근할 수 있습니다.
- 선택은 외곽 링과 굵은 연결선으로 표시하며, 마우스 올림·키보드 포커스와 구분합니다.
  설명 패널에서 연결 수와 이웃 버튼을 확인할 수 있고, 조작 안내는 ‘사용 방법’에 있습니다.
- 여러 그래프를 한 글에 넣어도 접근성 ID는 겹치지 않습니다. `id`를 직접 지정하면 글 안에서
  고유하게 정해야 합니다. `number`는 이미지와 같은 그림 번호 순서를 사용합니다.
- 데이터 또는 기본 선택 ID를 바꾸면 선택·위치·필터 상태가 초기화됩니다.
- Next.js 서버 컴포넌트/MDX에서 전달하는 그래프 props는 직렬화 가능한 데이터입니다.

## 작성 범위

처음에는 노드 5~15개 정도의 설명용 그래프를 권장합니다. 긴 라벨과 밀집된 연결의 충돌을
자동으로 해결하지 않으므로, 복잡한 그림은 좌표를 직접 지정하고 모바일 화면도 확인하세요.
방향 화살표, 자기 연결, 동일 노드 쌍의 복수 연결, 대규모 자동 레이아웃은
현재 지원 범위에 포함하지 않습니다. 흐름도·타임라인을 추가할 때는 별도 컴포넌트로 만들고
`VisualFigure`를 공유합니다. 스타일은 사이트의 `--journal-*` 토큰과 캡션 클래스를 사용합니다.

## 검증

프로젝트 루트에서 Node.js 22.18 이상으로 실행합니다.

```sh
node --test components/visualizations/graph-model.test.mjs
npx tsc --noEmit
npm run build
```
