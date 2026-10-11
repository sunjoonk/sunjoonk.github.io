# GraphRAG 운영과 평가

상태: 미발행 편집 재료 · 2026-10-11 분리

기존 RAG 글에서 보존한 원고다. 독립된 글로 퇴고하기 전에는 게시하지 않는다.
앞뒤 문맥, 예시·그림 번호, MDX 컴포넌트 import, 참고 자료의 관련성과 최신성을 다시 확인해야 한다.
아래 내용은 새로 검증한 운영 결과가 아니라 기존 조사와 설계 제안이다.

<h2 id="scale">문서 10만 개를 처리한다면?</h2>

방대한 문서를 한 번에 모델에 넣는 대신, 작은 작업을 반복 실행하는 색인 시스템이 필요하다. 아래는 대량 처리를 위한 설계 제안이다. 공식 라이브러리를 설치하면 이 분산 운영 전체가 자동으로 갖춰진다는 뜻은 아니다.

```text
문서 수집·텍스트 추출
  → 중복 제거·문서 버전 기록
  → 원문 위치를 보존하며 조각 생성
  → 작업 큐 → 여러 추출 워커
  → 출력 형식·근거 검증
  → 같은 대상 식별·관계 병합
  → 그래프 저장 → 커뮤니티 탐지 → 보고서 생성
```

PDF라면 표와 본문의 읽기 순서부터 확인해야 한다. 관계가 잘못 추출된 원인이 LLM이 아니라 깨진 텍스트일 수도 있다. 조각을 만들 때도 제목·절·표처럼 의미 있는 경계를 고려하고 원문으로 돌아갈 위치를 남기겠다.

가령 문서 10만 개를 평균 10개 조각으로 나누면 **100만 개의 추출 작업**이 생긴다. 조각당 한 번 호출한다고 가정해도 100만 번이다. 이는 규모를 설명하기 위한 계산이며, 실제 호출 수는 묶음 처리와 재추출 설정 등에 따라 달라진다. 문서 수만으로 비용을 추정하지 말고, 표본에서 입력·출력 토큰과 처리 시간을 측정해야 한다.

문서별 추출은 병렬화하기 좋지만, 처리량 제한을 넘겨 워커만 늘리면 재시도가 쌓일 수 있다. 다음 항목을 함께 설계하겠다.

- **작업량 제어:** 요청·토큰 제한에 맞춰 동시 실행 수를 조절하고 실패 유형별로 재시도한다.
- **캐시와 재시작:** 완료된 결과를 저장하고 실패한 작업부터 재개한다. 문서 조각의 해시와 모델·프롬프트·설정 버전을 함께 관리한다.
- **단계 분리:** 개별 추출과 문서 간 병합·커뮤니티 계산을 분리한다. 표본 작업의 처리 속도를 전체 파이프라인의 속도로 착각하지 않는다.

GraphRAG 자체에도 동일한 프롬프트와 설정의 요청 결과를 재사용하는 LLM 캐시가 있다. 다만 캐시가 모든 버전 관리와 변경 영향 추적을 대신하는 것은 아니다. [색인 아키텍처와 캐시](https://microsoft.github.io/graphrag/index/architecture/)

<h3>중복 제거: 같은 내용을 여러 번 추출하지 않는다</h3>

먼저 원문은 보존하고, 추출한 텍스트의 줄바꿈이나 불필요한 공백을 일관되게 정리한다. 이 텍스트에 SHA-256 같은 해시를 계산해 같은 내용인지 식별하겠다. 같은 해시가 이미 처리됐다면 추출 결과를 재사용할 수 있다. 단, 표의 셀 경계나 코드의 들여쓰기처럼 의미 있는 구조는 정규화 과정에서 지우지 않는다.

한두 문장만 다른 문서는 해시가 달라진다. 이런 경우에는 제목·출처로 비교 대상을 좁히거나 텍스트 유사도로 후보를 찾은 뒤, 실제 변경 구간을 비교하겠다. **유사하다는 이유만으로 삭제하지는 않는다.** “타임아웃 3초”가 “30초”로 바뀐 문서는 거의 같아 보여도 답이 달라진다.

같은 내용을 위키와 PDF에서 각각 수집했더라도 출처 정보는 둘 다 남긴다. 계산 결과를 재사용하는 것과 출처를 하나로 지우는 것은 별개의 작업이다. 관계의 근거에도 어떤 문서의 어느 구간이 이를 뒷받침하는지 목록을 보존해야 한다.

<h3>문서 버전: 무엇이 바뀌었고 어디에 반영됐는지 기록한다</h3>

문서의 정체성과 내용의 버전은 분리하겠다. 예를 들어 위키 페이지 ID를 고정된 `document_id`로 쓰고, 원본 수정 번호 또는 수집 시스템의 버전 번호와 내용 해시를 함께 저장한다. URL만 식별자로 쓰면 주소 이동을 새 문서로 오인할 수 있다.

```text
document_id: incident-042
version: 3
content_hash: 변경 감지용 해시
chunk_id: 이 버전에 속한 조각 ID
source_location: 원문 페이지·절·문자 구간
extraction_config: 모델·프롬프트·분할 규칙 버전
```

갱신 시에는 이전 버전과 해시를 비교하고, 바뀐 조각의 관계를 다시 추출한다. 조각 경계가 달라졌다면 주변 조각도 재처리해야 한다. 관계와 보고서에는 사용한 조각의 버전을 연결해 두고, 새 버전이 준비되면 검색에 노출할 버전을 전환하겠다. 이전 버전은 이력으로 남기되 최신 답변의 근거에 섞이지 않도록 한다.

삭제도 같은 원리다. 삭제된 문서의 근거를 비활성화하고, 다른 근거가 없는 관계와 그 관계를 사용한 요약을 갱신한다. 다른 문서가 여전히 뒷받침하는 관계까지 함께 지우면 안 된다. 이 기록은 공식 GraphRAG의 자동 보장 사항이 아니라, 운영 시스템에 추가할 설계다.

<h3>커뮤니티 탐지: 연결이 밀접한 대상들을 알고리즘으로 묶는다</h3>

엔티티와 관계가 모이면 그래프 알고리즘으로 연결 구조를 분석한다. Microsoft의 기본 GraphRAG는 계층적 Leiden 알고리즘으로 커뮤니티를 만든다. 큰 그룹을 더 작은 그룹으로 나누며 여러 수준의 묶음을 얻는 방식이다. **그룹을 나누는 계산과 그룹을 설명하는 LLM 요약은 서로 다른 단계다.** [GraphRAG의 커뮤니티 구성](https://microsoft.github.io/graphrag/index/default_dataflow/)

Leiden은 노드의 소속을 조정하고 그룹을 정제·축약하는 과정을 반복하며, 선택한 목적함수에 따라 연결 구조가 좋은 분할을 찾는다. 직관적으로는 다른 그룹보다 서로 더 밀접하게 연결된 대상들을 찾는 것이다. 사람이 “결제 팀”이라는 이름을 먼저 붙여 분류하는 방식과는 다르다. [Leiden 원 논문](https://arxiv.org/abs/1810.08473)

예를 들어 결제·주문·인증 서비스와 여러 장애 기록 사이에 관계가 많이 모여 있다면 같은 커뮤니티에 포함될 수 있다. 실제 결과는 간선과 가중치, 분할 설정에 달려 있으며, 같은 그룹이라는 사실만으로 공통 장애 원인이 입증되지는 않는다. 재현을 위해 입력 그래프 버전과 알고리즘 설정·난수 시드도 기록하겠다.

그다음 LLM이 그룹 안의 엔티티와 관계 설명 등 근거를 읽고 주요 내용을 보고서로 정리한다. 상위 그룹의 보고서에는 하위 보고서를 활용할 수도 있다. 나는 각 요약에서 원문까지 돌아갈 수 있도록 근거 연결을 남기고, 서로 다른 사건을 하나의 인과관계로 합쳐 쓰지 않았는지 검토하겠다.

<h3>수정한 문서 하나가 그래프 전체에 영향을 줄 수 있다</h3>

새 문서의 추출만 끝냈다고 갱신이 완료되지는 않는다. 기존 관계가 부정되거나 서비스 이름이 바뀌면 관련 노드, 관계 설명, 커뮤니티 보고서도 검토해야 한다. 연결 구조가 달라지면 커뮤니티의 경계 자체가 바뀔 수도 있다.

내가 구현한다면 원문과 파생 결과 사이의 의존성을 기록하고, 변경된 근거가 영향을 주는 결과를 다시 생성하겠다. 최신 관계를 반영하는 작업과 주기적인 커뮤니티 재계산을 분리할 수 있지만, 그 사이 어떤 버전의 요약을 제공할지 정해야 한다. 삭제·수정된 문서의 내용이 예전 보고서에 남아 검색되는 경우도 평가에 포함하겠다.

<h2 id="cost">비용은 어떻게 비교할까?</h2>

기본 RAG와 비교할 때는 최초 색인, 갱신, 질문당 비용을 나누어야 한다. 다음 표는 임베딩과 리랭킹을 사용하는 검색 RAG와 표준 GraphRAG의 작업을 비교한 것이다. 모든 GraphRAG 구현이 같은 비용을 갖는 것은 아니다.

<div className="article-table-wrap" role="region" aria-label="기본 RAG와 GraphRAG의 비용 발생 단계" tabIndex={0}>
  <table>
    <thead><tr><th scope="col">단계</th><th scope="col">임베딩·리랭킹 RAG</th><th scope="col">표준 GraphRAG</th></tr></thead>
    <tbody>
      <tr><th scope="row">초기 색인</th><td>문서 분할, 임베딩, 검색 인덱스</td><td>엔티티·관계 추출과 병합, 커뮤니티 탐지·요약, 임베딩</td></tr>
      <tr><th scope="row">질문 처리</th><td>후보 검색, 리랭킹, 답변 생성</td><td>Local은 관련 그래프·원문 수집, Global은 보고서별 중간 답변 종합</td></tr>
      <tr><th scope="row">문서 갱신</th><td>변경된 조각과 검색 인덱스 갱신</td><td>변경된 근거와 관계, 파생 요약의 영향 범위 처리</td></tr>
      <tr><th scope="row">운영 관리</th><td>검색 품질, 버전, 인덱스 운영</td><td>추가로 대상 식별, 관계 품질, 요약의 일관성 관리</td></tr>
    </tbody>
  </table>
</div>

표준 GraphRAG는 색인 단계에서도 생성 모델을 사용한다. Microsoft는 그래프 추출이 색인 비용의 약 75%를 차지한다고 추정한다. 이는 해당 구현에 대한 추정이며 모든 시스템에 적용되는 비율은 아니다. [공식 색인 방식 비교](https://microsoft.github.io/graphrag/index/methods/)

내 데이터의 비용은 작은 표본을 실제로 처리해 추정하겠다. 다음 항목을 기본 검색과 그래프 방식에 대해 같은 조건으로 기록하면 된다.

<div className="article-table-wrap" role="region" aria-label="색인과 질의 비용 측정 항목" tabIndex={0}>
  <table>
    <thead><tr><th scope="col">측정 대상</th><th scope="col">기록할 값</th></tr></thead>
    <tbody>
      <tr><th scope="row">표본 원문</th><td>문서·조각 수, 총 토큰 수</td></tr>
      <tr><th scope="row">색인</th><td>임베딩·추출·요약별 사용량과 비용, 전체 소요 시간</td></tr>
      <tr><th scope="row">질문 처리</th><td>검색·리랭킹·생성 비용, 응답 시간</td></tr>
      <tr><th scope="row">갱신</th><td>문서 수정·삭제 후 재처리 범위와 비용</td></tr>
    </tbody>
  </table>
</div>

문서별 추출량은 전체 토큰 수에 맞춰 대략 환산할 수 있지만, 문서 간 병합과 커뮤니티 계산까지 같은 비율로 늘어난다고 가정하지는 않겠다. 표본의 크기를 늘려가며 실제 처리량을 확인해야 한다.

<details>
<summary>공개 비용 비교 사례와 해석 범위</summary>

차이가 크게 벌어진 공개 사례도 있다. 2024년 LazyGraphRAG 발표는 해당 평가 설정의 색인 비용이 벡터 RAG와 같고, 전체 GraphRAG의 0.1%였다고 보고했다. 역산하면 약 1,000배의 차이다. 하지만 AP 기사 5,590건과 합성 질문 100개를 사용한 특정 평가의 보고이므로, 현재 프로젝트의 견적 배수로 사용해서는 안 된다. [LazyGraphRAG의 비용과 평가 조건](https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/)

</details>

질문당 비용은 탐색 범위에 따라 달라진다. 작은 영역을 모아 한 번 답하는 Local과 많은 보고서에서 중간 답변을 만드는 Global을 같은 비용으로 묶을 수 없다. 시간도 토큰 처리량, 동시 실행, 반복 탐색의 단계 수에 따라 달라진다. 나는 다음 식의 항목을 각각 측정하겠다.

```text
기간 전체 비용
= 최초 색인 비용
+ 기간 중 갱신 비용
+ 질문 수 × 평균 질문 처리 비용
+ 저장·운영 비용
```

질문이 많아지면 초기 비용을 나눠 부담할 수 있다. 그러나 질문당 비용까지 더 높다면 사용량만으로 경제성이 생기지는 않는다. 더 좋은 답변이 사람의 조사 시간을 얼마나 줄이는지도 봐야 한다.


<h2 id="evaluation">내 데이터로 첫 실험을 시작한다면?</h2>

원 GraphRAG 논문의 주요 평가는 약 100만~170만 토큰 규모의 두 문서 집합에서 전체 맥락을 종합하는 질문을 다뤘다. 그 결과만으로 모든 규모와 질문에서 임베딩·리랭킹보다 우수하다고 결론 내릴 수는 없다. [평가 범위와 한계](https://arxiv.org/html/2404.16130v1)

내가 시작한다면 대표 문서 수백 개와 실제 질문 수십 개로 작은 실험을 만들겠다. 다음 순서로 판단할 수 있다.

1. **실패를 분류한다.** 단일 사실, 관계 연결, 전체 종합 중 어디에서 부족한지 본다.
2. **비교 기준을 맞춘다.** 같은 원문·생성 모델을 사용하고, 컨텍스트와 비용 예산을 기록한다. 기본 검색에는 적절한 필터와 리랭킹을 적용한다.
3. **필요한 변화만 추가한다.** 후보 누락이면 검색을, 연결 누락이면 반복 탐색·그래프를, 전체 포괄성 부족이면 계층·커뮤니티 요약을 시험한다.
4. **근거와 운영을 함께 평가한다.** 필요한 문서와 연결 고리를 찾았는지, 주요 주제를 빠뜨리지 않았는지, 인용이 주장을 지지하는지 본다. 색인·갱신·질의 비용과 응답 지연도 함께 측정한다.
5. **수정과 삭제를 시험한다.** 원문이 바뀐 뒤 과거 관계나 요약이 계속 답변에 사용되는지 확인한다.

처음에는 모든 대안을 한꺼번에 구현하기보다, 벡터 검색·리랭킹을 기준으로 삼고 실패 유형에 맞는 그래프 방식 하나를 비교하겠다. 질문별 결과를 아래 양식으로 남기면 검색 실패와 답변 생성 실패를 분리해 볼 수 있다.

<div className="article-table-wrap" role="region" aria-label="첫 실험의 질문별 기록 양식" tabIndex={0}>
  <table>
    <thead><tr><th scope="col">기록 항목</th><th scope="col">작은 사례에 적용한 예</th></tr></thead>
    <tbody>
      <tr><th scope="row">질문과 유형</th><td>결제와 주문의 공통 의존 서비스는? · 관계 연결</td></tr>
      <tr><th scope="row">필요한 근거</th><td>A·B의 의존 관계, C의 별칭 정보</td></tr>
      <tr><th scope="row">실제 검색 근거</th><td>각 방식이 선택한 문서 ID와 누락된 근거 기록</td></tr>
      <tr><th scope="row">답변과 인용</th><td>인증 서비스라고 답했는지, A·B·C로 뒷받침했는지</td></tr>
      <tr><th scope="row">시간과 비용</th><td>질문당 응답 시간·비용과 별도의 색인·갱신 비용</td></tr>
    </tbody>
  </table>
</div>

성공 기준은 결과를 보기 전에 정하겠다. 연결 질문에서 필요한 근거의 누락이 줄어들고, 단순 사실 질문의 품질이 유지되며, 팀이 정한 응답 시간·비용 예산 안에 들어오는지를 함께 본다. 기준을 만족하지 못했다면 추출 오류인지, 검색 과정의 누락인지, 생성 단계의 문제인지 기록하고 다음 변경을 정한다.

복잡한 질문이 개선되어도 원래 잘 풀던 쉬운 질문이 나빠질 수 있다. 기본 검색을 유지하고 관계 분석이나 전체 종합이 필요한 질문에만 추가 단계를 사용하는 구성도 검토하겠다. 이때 질문을 잘못 분류했을 때의 실패까지 함께 봐야 한다.

이번에 살펴본 RAG의 변화는 검색 대상이 문장에서 관계와 요약으로 넓어지고, 검색 시점이 답변을 구성하는 과정까지 확장된다는 데 있다. 내게 중요한 기준은 그 구조가 새로운가보다 **실패했던 질문에 필요한 근거를 더 잘 제공하는가**다. 그리고 더 풍부한 연결을 제시할수록, 독자가 그 연결의 원문 근거를 확인할 수 있어야 한다.


<h2 id="references">참고 자료</h2>

별도 표시가 없는 원문과 공식 문서는 2026년 9월 10일 확인했다. 연도는 최초 공개 시점을 기준으로 표기했다. 논문별 데이터와 평가 조건이 다르므로 수치를 하나의 성능 순위로 합치지 않았다.

- [From Local to Global: A Graph RAG Approach to Query-Focused Summarization](https://arxiv.org/abs/2404.16130) — 2024. Microsoft GraphRAG의 출발점.
- [GraphRAG Local Search](https://microsoft.github.io/graphrag/query/local_search/), [Global Search](https://microsoft.github.io/graphrag/query/global_search/) — 공식 검색 방법 문서.
- [From RAG to Memory: Non-Parametric Continual Learning for Large Language Models](https://arxiv.org/html/2502.14802v1) — 2025. HippoRAG 2의 그래프와 검색 절차.
- [LazyGraphRAG: Setting a new standard for quality and cost](https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/) — 2024. 질의 시점으로 미룬 LLM 분석과 평가 조건.
- [GraphRAG Indexing Dataflow](https://microsoft.github.io/graphrag/index/default_dataflow/), [Architecture](https://microsoft.github.io/graphrag/index/architecture/), [Methods](https://microsoft.github.io/graphrag/index/methods/) — 추출·병합·커뮤니티 탐지와 캐시, Standard·Fast 방식의 차이.
- [Retrieve & Re-Rank](https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html) — Sentence Transformers의 후보 검색과 재평가 구조. 2026년 9월 18일 재확인.
- [Billion-scale similarity search with GPUs](https://arxiv.org/abs/1702.08734) — 2017. 대규모 벡터 검색 연구. 의미적 답변 품질의 보장을 뜻하지는 않는다.

- [Obsidian Graph view](https://obsidian.md/help/plugins/graph) — 노트와 내부 링크의 그래프 표현. 2026년 9월 18일 확인하고 인터랙티브 예시를 추가했다.
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) — 2020. 검색과 생성을 결합한 RAG 연구. 2026년 9월 18일 확인.
- [Semantic Search](https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html) — 임베딩을 이용한 의미 검색. 2026년 9월 18일 확인.

- [LightRAG: Simple and Fast Retrieval-Augmented Generation](https://arxiv.org/html/2410.05779v1) — 2024. 두 수준의 검색과 증분 갱신. 2026년 9월 18일 확인.
- [From Louvain to Leiden: guaranteeing well-connected communities](https://arxiv.org/abs/1810.08473) — 2018 프리프린트, 2019 출판. 커뮤니티 탐지 알고리즘. 2026년 9월 18일 확인.
