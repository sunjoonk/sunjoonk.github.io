# 문서 세 개로 이해하는 GraphRAG

상태: 미발행 편집 재료 · 2026-10-11 분리

기존 RAG 글에서 보존한 원고다. 독립된 글로 퇴고하기 전에는 게시하지 않는다.
앞뒤 문맥, 예시·그림 번호, MDX 컴포넌트 import, 참고 자료의 관련성과 최신성을 다시 확인해야 한다.
아래 내용은 새로 검증한 운영 결과가 아니라 기존 조사와 설계 제안이다.

<h2 id="graphrag">GraphRAG는 무엇을 바꾸는가?</h2>

그래프를 활용하는 RAG에는 여러 구현이 있다. 여기서는 **2024년에 공개된 Microsoft GraphRAG**를 기준으로 살펴본다.

기본 아이디어는 문서를 읽어 엔티티와 관계를 추출하고, 연결이 밀접한 노드들을 커뮤니티로 묶은 뒤, 그 내용을 요약해두는 것이다. 엔티티는 사람이나 조직뿐 아니라 서비스, 기술, 사건처럼 문서에서 식별할 대상이다. 커뮤니티는 그래프의 연결 구조를 바탕으로 얻는 묶음이다. [GraphRAG 논문](https://arxiv.org/abs/2404.16130)

먼저 문서끼리 연결되는 모습을 직접 살펴보자. Obsidian의 그래프 뷰에서는 점이 노트, 선이 내부 링크를 나타낸다. 아래는 그 표현을 빌려 만든 예시다. 인증 서비스 노트를 선택하면 결제와 주문의 장애 기록이 같은 문서를 참조한다는 것을 확인할 수 있다. [Obsidian 그래프 뷰](https://obsidian.md/help/plugins/graph)

<ArticleNoteGraph />

위 예시는 문서 사이의 링크를 보여준다. GraphRAG는 문서 속 서비스나 사건을 찾아, ‘의존한다’, ‘영향을 줬다’ 같은 관계로 연결한다. 가상의 장애 기록을 이런 관계로 표현하면 다음과 같다.

```text
결제 서비스 ── 의존한다 ──→ 인증 서비스
주문 서비스 ── 의존한다 ──→ 인증 서비스
장애 A      ── 영향을 줬다 → 결제 서비스
장애 B      ── 영향을 줬다 → 주문 서비스
```

이 구조를 보면 두 서비스가 공유하는 의존성을 조사할 수 있다. 다만 공통 의존성이 있다는 것만으로 인증 서비스가 두 장애의 원인이라고 결론 내릴 수는 없다. 원인 관계는 각 보고서의 근거로 따로 확인해야 한다.

<h3>Local Search: 특정 대상의 주변을 읽는다</h3>

“결제 서비스와 연결된 시스템은?”처럼 대상이 뚜렷한 질문에서는 관련 엔티티를 출발점으로 삼는다. 연결된 엔티티와 관계, 관련 원문 조각 등을 모아 컨텍스트를 구성한다. 그래프와 원문을 함께 이용하는 방식이다. [Local Search](https://microsoft.github.io/graphrag/query/local_search/)

<h3>Global Search: 문서 집합 전체의 주제를 읽는다</h3>

“장애 기록 전반에서 반복되는 문제는?”이라는 질문은 출발점 하나를 고르기 어렵다. Global Search는 지정한 커뮤니티 계층의 보고서들을 바탕으로 중간 답변을 만들고, 중요한 내용을 모아 최종 답변을 생성한다. 여러 묶음을 처리한 뒤 결과를 합치는 map-reduce 방식이다. [Global Search](https://microsoft.github.io/graphrag/query/global_search/)

여기서 그래프의 역할은 질문마다 경로를 따라가는 일에만 있지 않다. **데이터 전체를 어떤 단위로 나누어 읽을지 준비하는 역할**도 한다. 커뮤니티를 요약하는 과정에서 여러 기록의 공통 주제가 검색 가능한 형태로 만들어진다.

이 설명을 설계에 적용할 때는 두 가지를 구분하고 싶다. 전체 주제를 설명하는 일과 정확한 빈도를 집계하는 일이다. “가장 흔한 원인”의 순위와 건수가 필요하다면, 요약문에서 추정하기보다 사건을 중복 없이 구조화하고 집계하는 단계를 별도로 두겠다. 요약에 덜 드러난 소수의 중요한 사건도 원문에서 확인할 수 있어야 한다.

<h3>작은 사례: 원문 세 개를 하나의 답변으로 연결한다</h3>

아래는 동작을 이해하기 위해 만든 가상 문서다. 실제 검색 결과나 성능 실험은 아니며, 앞의 노트 그래프에서 등장한 결제·인증 서비스를 사용한다.

- **문서 A · 결제 장애 기록:** “결제 요청이 지연됐다. 결제 서비스는 인증 서비스에 토큰 검증을 요청한다.”
- **문서 B · 주문 장애 기록:** “주문 요청이 지연됐다. 주문 서비스는 Auth Service에 토큰 검증을 요청한다.”
- **문서 C · 서비스 목록:** “Auth Service는 인증 서비스의 영문 이름이다. 서비스 ID는 svc-auth다.”

색인 단계에서 A와 B의 의존 관계를 추출하고, C의 서비스 ID와 별칭을 이용해 두 이름을 같은 대상으로 연결한다. 원문 근거를 함께 남기면 다음과 같은 구조를 얻는다.

```text
결제 서비스 ── 의존한다 [A] ──→ 인증 서비스 (svc-auth)
주문 서비스 ── 의존한다 [B] ──→ 인증 서비스 (svc-auth)
                                  ↑
                     Auth Service와 같은 대상 [C]
```

이제 “결제와 주문이 함께 의존하는 서비스는 무엇인가?”라고 질문해 보자. 벡터 검색과 리랭킹도 A와 B를 모두 가져오면 답할 수 있다. 하지만 A만 최종 근거로 선택됐다면 주문 쪽의 의존성을 확인할 수 없다. 그래프를 활용하는 검색에서는 관련 엔티티와 관계를 통해 A·B·C의 근거를 함께 모으는 구성을 생각할 수 있다. 이는 Local Search의 역할을 단순화한 예시이며, 실제 탐색 범위와 컨텍스트 선택은 구현에 따라 달라진다.

LLM에는 관계만 넘기지 않고 이를 뒷받침하는 원문도 전달한다. 그러면 답변은 다음처럼 구성할 수 있다.

> 결제와 주문은 모두 인증 서비스에 토큰 검증을 요청합니다. [문서 A, B] 주문 기록의 ‘Auth Service’는 서비스 목록에서 같은 서비스로 확인됩니다. [문서 C] 다만 이 자료만으로 두 장애의 원인이 인증 서비스였다고 단정할 수는 없습니다.

여기서 그래프가 제공한 것은 이름이 다른 두 기록을 같은 대상으로 연결하는 구조다. 지난해 모든 장애의 공통 경향을 묻는다면 이 연결 하나만으로는 부족하고, 앞서 설명한 커뮤니티 보고서처럼 더 넓은 범위를 읽을 준비가 필요하다.


<h2 id="construction">그래프는 누가, 어떻게 만드는가?</h2>

사람이 모든 문서를 읽고 선을 그리지는 않는다. 표준 GraphRAG에서는 LLM이 문서 조각마다 엔티티와 관계를 추출하고, 프로그램이 작은 그래프들을 병합한다. 커뮤니티는 Hierarchical Leiden 알고리즘으로 구성하고, 보고서는 LLM으로 작성한다. [공식 색인 파이프라인](https://microsoft.github.io/graphrag/index/default_dataflow/)

사람이 맡을 중요한 일은 추출의 목적과 품질 기준을 정하는 것이다. 장애 분석이라면 서비스·장애·배포·팀을 대상으로 삼고, 의존·영향·담당 관계를 우선 다루는 식이다. 다음은 내가 이 용도에 맞춰 설계한다면 사용할 기준이다. GraphRAG의 기본 출력 스키마와는 구분된다.

<div className="article-table-wrap" role="region" aria-label="장애 분석 그래프의 설계 예시" tabIndex={0}>
  <table>
    <thead><tr><th scope="col">정할 것</th><th scope="col">예시</th></tr></thead>
    <tbody>
      <tr><th scope="row">대상 종류</th><td>서비스, 장애, 배포, 팀</td></tr>
      <tr><th scope="row">관계 종류</th><td>의존한다, 영향을 줬다, 담당한다</td></tr>
      <tr><th scope="row">식별 기준</th><td>서비스 ID, 장애 티켓 번호, 저장소 주소</td></tr>
      <tr><th scope="row">근거와 시간</th><td>문서 ID·버전, 원문 문장, 사건 시점</td></tr>
    </tbody>
  </table>
</div>

<h3>한 문장에서 관계 후보를 만든다</h3>

“결제 서비스는 인증 서비스에 토큰 검증을 요청한다. 이번 장애의 원인은 아직 조사 중이다.”라는 문장을 읽었다고 하자. 추출 결과를 다음처럼 저장할 수 있다.

```json
{
  "source": "결제 서비스",
  "relation": "의존한다",
  "target": "인증 서비스",
  "evidence": "결제 서비스는 인증 서비스에 토큰 검증을 요청한다.",
  "document_id": "incident-042",
  "document_version": 3
}
```

여기서 의존 관계는 추출할 수 있지만, 인증 서비스가 장애를 유발했다고 기록하면 안 된다. 출력이 올바른 JSON인지 확인하는 일과 의미가 원문에 의해 뒷받침되는지 확인하는 일도 다르다. 원문 구간의 존재와 출력 형식은 코드로 검증하고, 관계의 타당성은 표본 검토와 도메인별 평가로 확인하겠다. LLM이 붙인 자신감 점수만으로 사실을 승인하지는 않겠다.

<h3>문서마다 다르게 부르는 대상을 통합한다</h3>

더 어려운 일은 문서 A의 ‘인증 서비스’, 문서 B의 ‘Auth Service’, 문서 C의 ‘auth-api’가 같은 대상인지 판단하는 것이다. Microsoft의 기본 파이프라인은 제목과 타입이 같은 엔티티를 병합한다. 복잡한 별칭이나 동명이인까지 해결하려면 추가 설계가 필요하다. [기본 엔티티 병합](https://microsoft.github.io/graphrag/index/default_dataflow/)

나는 고유 ID와 공식 서비스 목록을 먼저 사용하고, 별칭 사전으로 알려진 이름을 묶겠다. 남은 경우에만 타입·이름·문맥으로 후보를 좁혀 LLM이나 사람이 검토하도록 하겠다. 모든 대상 쌍을 비교하는 방식은 규모가 커질수록 부담이 커진다. 확신이 부족한 대상을 일단 별개로 남겨두는 규칙도 필요하다.

서비스 목록이나 의존 관계가 이미 운영 시스템에 있다면 그것을 출발점으로 삼을 수 있다. 문서 추출 결과는 기존 대상에 연결하고, 각 관계에는 근거를 여러 개 보존하겠다. 한 원문이 삭제돼도 다른 문서의 근거가 남아 있을 수 있기 때문이다.


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
