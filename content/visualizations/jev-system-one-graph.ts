import type { RelationshipGraphData } from "../../components/visualizations";

// A conceptual responsibility map, not a directed execution flow.
export const jevSystemOneGraph: RelationshipGraphData = {
  nodes: [
    { id: "code", label: "애플리케이션 코드", position: { x: 320, y: 265 }, description: "이 글에서 제안하는 설계의 중심이다. 입력을 준비하고 모델의 판단을 받아 정책을 적용한다. 숫자 계산, 권한 확인, 재시도와 최종 실행은 코드가 맡는다." },
    { id: "jev", label: "Jev", position: { x: 320, y: 135 }, description: "자연어로 정의한 질문을 평가한다. Choice, Score, Noul로 판단을 반환하며, 결과를 실제 행동으로 바꾸는 책임은 애플리케이션에 있다." },
    { id: "choice", label: "Choice · 선택", position: { x: 105, y: 70 }, description: "예: 접수된 문제를 UI, API, 문서, 기타 중 어디로 분류할까? 선택지별 확률을 함께 읽으면 경계에 걸린 사례를 살펴볼 수 있다." },
    { id: "score", label: "Score · 정도", position: { x: 320, y: 40 }, description: "예: 재현 절차가 어느 정도 구체적인가? 순서가 있는 기준을 먼저 정한다. 점수의 의미는 개발자가 작성한 기준에 달려 있다." },
    { id: "noul", label: "Noul · 참일 확률", position: { x: 535, y: 70 }, description: "예: 보고서에 임시 해결 방법이 언급되어 있는가? 0과 1 사이의 값은 해당 명제에 대한 확률이며, 문제의 심각도를 뜻하지 않는다." },
    { id: "state", label: "입력과 근거", position: { x: 110, y: 270 }, description: "보고서 원문과 필요한 맥락을 준비한다. 관련 없는 기록을 모두 붙이는 대신 질문에 필요한 필드를 고른다." },
    { id: "generation", label: "생성 모델", position: { x: 530, y: 270 }, description: "이 설계에서는 사용자에게 보여줄 설명이나 답변 초안이 필요할 때 사용한다. Jev의 분류 결과만으로 설명의 근거까지 확보되는 것은 아니다." },
    { id: "review", label: "사람의 검토", position: { x: 320, y: 390 }, description: "분류가 애매하거나 기존 기준이 포괄하지 못하는 사례를 확인한다. 수정한 라벨과 이유는 다음 평가 데이터에 반영한다." },
  ],
  edges: [
    { source: "code", target: "jev" },
    { source: "jev", target: "choice" },
    { source: "jev", target: "score" },
    { source: "jev", target: "noul" },
    { source: "code", target: "state" },
    { source: "code", target: "generation" },
    { source: "code", target: "review" },
  ],
};
