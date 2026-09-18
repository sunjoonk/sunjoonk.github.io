import { RelationshipGraph } from "./visualizations";
import { ragNoteGraph } from "../content/visualizations/rag-note-graph";

/** Article adapter: the rendering and interactions live in the shared library. */
export function ArticleNoteGraph() {
  return (
    <RelationshipGraph
      id="note-graph"
      title="노트 그래프"
      badge="예시"
      data={ragNoteGraph}
      defaultSelectedId="auth"
      sizeByDegree
      description="장애 분석 노트 9개의 내부 링크 관계"
      number={1}
      caption="내부 링크로 연결한 가상의 장애 분석 노트. 점은 문서, 선은 참조이며 큰 점일수록 연결된 노트가 많다. 배치를 옮겨도 연결은 유지된다. 점 사이의 거리 자체가 의미 유사도나 인과관계를 뜻하지는 않는다."
      source="직접 제작 · 실제 보관함이나 자동 추출 결과가 아닌 설명용 데이터"
    />
  );
}
