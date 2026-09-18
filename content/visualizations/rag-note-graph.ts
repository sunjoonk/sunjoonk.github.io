import type { RelationshipGraphData } from "../../components/visualizations";

const notes = [
  { id: "payment", title: "결제 서비스", group: "service", x: 160, y: 148, body: "결제 요청을 처리한다. 토큰 검증은 [[인증 서비스]]에 요청하며, 실패한 요청은 [[재시도 정책]]을 따른다.", links: ["auth", "retry"] },
  { id: "order", title: "주문 서비스", group: "service", x: 490, y: 150, body: "주문 생성 전에 [[인증 서비스]]에서 토큰을 검증한다. 최근 지연 현상은 [[주문 장애 기록]]에 정리했다.", links: ["auth", "incident-b"] },
  { id: "auth", title: "인증 서비스", group: "service", x: 320, y: 246, body: "결제와 주문이 함께 사용하는 토큰 검증 서비스다. 외부 연결은 [[연결 풀 설정]]을 사용하고 변경은 [[인증 배포 기록]]에 남긴다.", links: ["pool", "deploy"] },
  { id: "incident-a", title: "결제 장애 기록", group: "incident", x: 90, y: 292, body: "결제 지연이 발생했다. [[결제 서비스]]의 오류 로그와 [[인증 서비스]] 응답을 확인했다. 원인은 아직 조사 중이며, 후속 논의는 [[장애 회고]]에 남겼다.", links: ["payment", "auth", "review"] },
  { id: "incident-b", title: "주문 장애 기록", group: "incident", x: 550, y: 292, body: "주문 요청의 응답 시간이 늘었다. [[인증 서비스]] 호출 구간을 조사했고 [[장애 회고]]에서 다른 장애와 비교하기로 했다.", links: ["auth", "review"] },
  { id: "pool", title: "연결 풀 설정", group: "operation", x: 245, y: 390, body: "동시 연결 수와 대기 시간을 관리하는 설정이다. 최근 변경은 [[인증 배포 기록]]에 있다. 변경 시점만으로 장애의 원인을 확정할 수는 없다.", links: ["deploy"] },
  { id: "deploy", title: "인증 배포 기록", group: "operation", x: 435, y: 380, body: "[[인증 서비스]]의 연결 설정을 변경했다. [[연결 풀 설정]]에 변경값을 기록했다. 실제 영향은 지표와 원문 로그로 확인해야 한다.", links: ["auth", "pool"] },
  { id: "retry", title: "재시도 정책", group: "operation", x: 225, y: 55, body: "타임아웃이 발생한 요청을 다시 보내는 기준이다. [[결제 서비스]]에 적용하며, 증폭된 요청이 있었는지는 별도 확인이 필요하다.", links: ["payment"] },
  { id: "review", title: "장애 회고", group: "incident", x: 418, y: 58, body: "[[결제 장애 기록]]과 [[주문 장애 기록]]을 함께 검토한다. 두 기록이 공통으로 언급한 인증 서비스를 다음 조사 대상으로 삼는다.", links: ["incident-a", "incident-b"] },
] as const;

// Article-specific wiki-link syntax is converted to stable node references here.
export const ragNoteGraph: RelationshipGraphData = {
  nodes: notes.map(note => ({
    id: note.id,
    label: note.title,
    position: { x: note.x, y: note.y },
    description: note.body.split(/(\[\[.*?\]\])/g).map(text => {
      const target = notes.find(candidate => `[[${candidate.title}]]` === text);
      return target ? { text, nodeId: target.id } : text;
    }),
  })),
  edges: Array.from(new Map(notes.flatMap(note => note.links.map(target => {
    const pair = [note.id, target].sort();
    return [JSON.stringify(pair), { source: pair[0], target: pair[1] }] as const;
  }))).values()),
};
