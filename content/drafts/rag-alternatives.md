# LightRAG와 HippoRAG 2 비교

상태: 미발행 편집 재료 · 2026-10-11 분리

기존 RAG 글에서 보존한 원고다. 독립된 글로 퇴고하기 전에는 게시하지 않는다.
앞뒤 문맥, 예시·그림 번호, MDX 컴포넌트 import, 참고 자료의 관련성과 최신성을 다시 확인해야 한다.
아래 내용은 새로 검증한 운영 결과가 아니라 기존 조사와 설계 제안이다.

<h2 id="alternatives">같은 문제를 푸는 다른 설계들</h2>

대안은 이름을 많이 나열하기보다, GraphRAG의 어떤 부분을 다르게 설계했는지 비교하면 이해하기 쉽다. 여기서는 **LightRAG와 HippoRAG 2** 두 가지로 좁히겠다. 각각 2024년과 2025년에 공개된 연구로, 그래프를 활용하면서도 커뮤니티 보고서 중심의 검색과 다른 길을 택한다. 모든 도메인에서 최고라는 뜻은 아니다. 아래 설명은 링크한 논문 버전의 구조를 기준으로 한다.

<h3 id="lightrag">LightRAG: 구체적인 대상과 넓은 주제를 함께 찾는다</h3>

LightRAG도 LLM으로 문서에서 엔티티와 관계를 추출하고, 이를 벡터 표현과 함께 검색에 활용한다. 특징은 질문을 두 수준에서 다룬다는 점이다. 낮은 수준에서는 구체적인 엔티티를, 높은 수준에서는 주제와 관계를 단서로 관련 정보를 찾는다. 여기서 ‘높고 낮음’은 커뮤니티 트리의 층수를 뜻하지 않는다. [LightRAG 논문](https://arxiv.org/html/2410.05779v1)

예를 들어 “인증 서비스의 문제가 결제에 어떤 영향을 주었나?”라는 질문에는 ‘인증 서비스’라는 대상과 ‘서비스 장애 전파’라는 넓은 주제가 함께 들어 있다. 두 단서로 관련 엔티티·관계와 원문 조각을 모아 답변의 문맥을 만드는 식으로 이해할 수 있다. 이는 앞의 가상 사례에 적용해 본 설명이다.

커뮤니티 보고서를 미리 계층적으로 만드는 부담을 줄이고 관계를 직접 검색하고 싶을 때 비교할 만하다. 논문은 새 문서에서 얻은 그래프를 기존 구조에 통합하는 증분 갱신도 제안한다. 다만 ‘Light’라는 이름처럼 모든 작업이 저렴해지는 것은 아니다. 엔티티·관계 추출 비용은 남고, 문서 삭제나 상충하는 정보의 정리는 별도로 검증해야 한다.

<h3 id="hipporag">HippoRAG 2: 질문에서 출발해 연결된 원문까지 찾아간다</h3>

HippoRAG 2는 추출한 구절과 원문 조각인 passage를 그래프에 함께 넣는다. 질의 시에는 임베딩으로 관련 트리플을 찾고 LLM으로 관련성을 걸러낸 뒤, 구절과 passage의 신호를 Personalized PageRank에 반영해 읽을 원문을 고른다. 질문에 관련된 출발점에 가중치를 주고, 그 점수를 그래프의 연결을 따라 퍼뜨리는 방식이다. [HippoRAG 2 논문](https://arxiv.org/html/2502.14802v1)

결제 장애 문서에서 인증 서비스를 거쳐 연결 풀 변경 기록으로 이어지는 경우를 떠올려 보자. 마지막 기록은 처음 질문과 단어가 비슷하지 않아도 중간 대상을 통해 검색될 기회가 생긴다. 여러 원문을 연결해야 답할 수 있는 질문에서 비교할 이유다. 다만 이런 경로가 있다는 사실 자체가 장애 원인의 증명은 아니며, 최종 답변은 원문으로 확인해야 한다.

LightRAG가 구체적인 대상과 넓은 주제를 검색 단서로 나누는 데 초점을 둔다면, HippoRAG 2에서는 그래프를 따라 원문 검색 점수를 전파하는 과정이 핵심이다. 잘못 합친 동명이인이나 빠진 관계는 탐색을 잘못 이끌 수 있다. 논문의 벤치마크 성과는 출발점으로 삼되, 내 문서의 연결 질문과 단순 사실 질문을 함께 평가하겠다.


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
