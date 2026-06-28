export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language?: string; code: string };

export type Post = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  body: PostBlock[];
};

export const posts: Post[] = [
  {
    id: 1,
    slug: "understanding-react-components",
    title: "React 컴포넌트 이해하기",
    description: "React 컴포넌트를 UI 조각이 아니라 변경에 강한 설계 단위로 이해합니다.",
    category: "React",
    publishedAt: "2026-06-15",
    body: [
      {
        type: "paragraph",
        text: "React를 처음 배울 때 컴포넌트는 보통 “화면을 나누는 조각”이라고 설명됩니다. 이 설명은 틀리지 않지만 충분하지는 않습니다. 실무에서 컴포넌트는 단순히 HTML을 쪼개는 단위가 아니라, 데이터가 들어오고 상태가 바뀌고 사용자가 행동했을 때 UI가 어떤 모습이어야 하는지를 캡슐화하는 설계 단위입니다.",
      },
      {
        type: "paragraph",
        text: "좋은 컴포넌트는 예쁘게 분리된 파일이 아닙니다. 좋은 컴포넌트는 읽는 사람이 역할을 빠르게 이해할 수 있고, 수정이 필요한 범위가 좁으며, 같은 개념을 여러 화면에서 안정적으로 재사용할 수 있게 해줍니다.",
      },
      {
        type: "heading",
        text: "함수로서의 컴포넌트",
      },
      {
        type: "paragraph",
        text: "React 컴포넌트의 가장 기본적인 모델은 함수입니다. 입력은 props이고, 출력은 JSX입니다. 같은 props가 들어오면 같은 UI가 나와야 한다는 감각을 가지면 컴포넌트 설계가 훨씬 단순해집니다.",
      },
      {
        type: "code",
        language: "jsx",
        code: `function SkillBadge({ label, selected }) {
  return (
    <span className={selected ? "badge selected" : "badge"}>
      {label}
    </span>
  );
}`,
      },
      {
        type: "paragraph",
        text: "이 컴포넌트는 “기술 이름을 배지로 보여준다”는 하나의 일을 합니다. selected라는 입력이 true인지 false인지에 따라 표현만 달라집니다. 중요한 점은 컴포넌트 내부가 부모의 사정을 몰라도 된다는 것입니다.",
      },
      {
        type: "heading",
        text: "컴포넌트의 계약, props",
      },
      {
        type: "paragraph",
        text: "props는 단순한 값 전달 수단이 아닙니다. 컴포넌트가 외부와 맺는 계약입니다. 어떤 props를 받는지 보면 이 컴포넌트가 무엇을 책임지는지 드러나야 합니다.",
      },
      {
        type: "list",
        items: [
          "label: 화면에 표시할 이름",
          "selected: 선택 상태인지 여부",
          "onClick: 사용자가 눌렀을 때 실행할 동작",
        ],
      },
      {
        type: "paragraph",
        text: "이렇게 props가 명확하면 컴포넌트를 사용하는 쪽도 편해집니다. 반대로 props가 너무 많거나 이름이 모호하면 컴포넌트가 여러 책임을 떠안고 있다는 신호일 수 있습니다.",
      },
      {
        type: "heading",
        text: "UI 선언 문법, JSX",
      },
      {
        type: "paragraph",
        text: "JSX는 HTML처럼 보이지만 HTML 그 자체는 아닙니다. JavaScript 안에서 UI 구조를 선언하는 문법입니다. 그래서 조건문, 배열 렌더링, 이벤트 핸들러 같은 JavaScript의 표현력을 UI에 자연스럽게 연결할 수 있습니다.",
      },
      {
        type: "code",
        language: "jsx",
        code: `function ProjectList({ projects }) {
  if (projects.length === 0) {
    return <p>아직 등록된 프로젝트가 없습니다.</p>;
  }

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.title}</li>
      ))}
    </ul>
  );
}`,
      },
      {
        type: "paragraph",
        text: "여기서 핵심은 UI가 데이터의 상태를 따라간다는 점입니다. projects가 비어 있으면 빈 상태를 보여주고, 데이터가 있으면 목록을 보여줍니다. DOM을 직접 조작하는 대신 “이 상태라면 이런 화면이어야 한다”라고 선언합니다.",
      },
      {
        type: "heading",
        text: "컴포넌트 분리의 기준",
      },
      {
        type: "paragraph",
        text: "초보 단계에서는 컴포넌트를 많이 나누는 것이 곧 좋은 구조처럼 보일 수 있습니다. 하지만 컴포넌트 분리의 기준은 파일 크기가 아니라 변경 이유입니다. 같이 바뀌는 코드는 가까이 두고, 다른 이유로 바뀌는 코드는 분리하는 편이 좋습니다.",
      },
      {
        type: "list",
        items: [
          "반복되는 UI가 있는가?",
          "이름을 붙였을 때 의미 있는 도메인 개념인가?",
          "부모 컴포넌트의 읽기 흐름을 방해할 만큼 세부 구현이 긴가?",
          "상태나 이벤트 처리의 책임을 더 좁힐 수 있는가?",
        ],
      },
      {
        type: "paragraph",
        text: "이 질문에 답할 수 있을 때 분리하면 컴포넌트가 구조를 설명합니다. 답 없이 기계적으로 나누면 오히려 파일 사이를 계속 오가야 하는 코드가 됩니다.",
      },
      {
        type: "heading",
        text: "상태 위치 설계",
      },
      {
        type: "paragraph",
        text: "React에서 상태 위치는 중요합니다. 여러 컴포넌트가 같은 상태를 필요로 하면 공통 부모로 올립니다. 하지만 모든 상태를 최상단에 몰아넣으면 작은 변경도 큰 컴포넌트를 다시 읽어야 합니다. 상태는 공유가 필요한 가장 가까운 부모에 두는 것이 기본입니다.",
      },
      {
        type: "code",
        language: "jsx",
        code: `function SkillFilter() {
  const [selectedSkill, setSelectedSkill] = useState("React");

  return (
    <>
      <SkillTabs
        selectedSkill={selectedSkill}
        onSelect={setSelectedSkill}
      />
      <ProjectList skill={selectedSkill} />
    </>
  );
}`,
      },
      {
        type: "paragraph",
        text: "SkillTabs와 ProjectList가 같은 selectedSkill을 기준으로 움직여야 하므로 상태는 두 컴포넌트의 공통 부모인 SkillFilter에 있습니다. 이것이 상태 끌어올리기의 기본적인 형태입니다.",
      },
      {
        type: "heading",
        text: "좋은 컴포넌트의 원칙",
      },
      {
        type: "list",
        items: [
          "컴포넌트 이름은 역할을 설명해야 한다.",
          "props 이름은 내부 구현보다 사용자의 의도를 드러내야 한다.",
          "UI 표현과 데이터 가공이 뒤섞이면 가공 로직을 밖으로 빼는 것을 고려한다.",
          "재사용을 너무 일찍 일반화하지 않는다.",
          "상태는 공유가 필요한 가장 가까운 위치에 둔다.",
        ],
      },
      {
        type: "paragraph",
        text: "React를 잘 쓴다는 것은 문법을 많이 아는 것만을 뜻하지 않습니다. 변화가 생겼을 때 어디를 고쳐야 하는지 명확한 UI 구조를 만드는 일에 가깝습니다. 컴포넌트는 그 구조를 만드는 가장 작은 단위입니다.",
      },
      {
        type: "paragraph",
        text: "처음에는 JSX와 props를 익히는 것으로 충분합니다. 그 다음에는 컴포넌트가 어떤 책임을 가져야 하는지, 어떤 데이터와 상태를 받아야 하는지, 어디까지를 스스로 결정해야 하는지를 계속 질문해야 합니다. 그 질문이 쌓이면 React 코드는 단순히 동작하는 화면에서 유지보수 가능한 인터페이스로 바뀝니다.",
      },
    ],
  },
];

export function getPosts(): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
