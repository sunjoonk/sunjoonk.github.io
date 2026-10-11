"use client";

import { useId, useState } from "react";
import { VisualFigure } from "./VisualFigure";
import styles from "./RagEvidence.module.css";

/** A fixed teaching example, not a retrieval benchmark or a live model response. */
export function RagEvidence() {
  const [includeAlias, setIncludeAlias] = useState(true);
  const resultId = useId();

  return (
    <VisualFigure
      title="이름을 연결하는 근거 하나"
      number={1}
      caption="A·B는 각 서비스의 의존성을, C는 두 이름이 같은 대상임을 뒷받침한다. 근거의 조합에 따른 답변 범위를 비교한 설명용 예시다."
      source="직접 제작 · 가상 문서, 실제 검색·모델 실행 결과 아님"
    >
      <div className={styles.example}>
        <p className={styles.question}>결제와 주문이 함께 의존하는 서비스는 무엇일까?</p>
        <div className={styles.documents} aria-label="비교에 사용하는 가상 원문 세 개">
          <div className={styles.document}>
            <span className={styles.label}>A / 결제 장애 기록</span>
            <p>결제 요청이 지연됐다. 결제 서비스는 <strong>인증 서비스</strong>에 토큰 검증을 요청한다.</p>
          </div>
          <div className={styles.document}>
            <span className={styles.label}>B / 주문 장애 기록</span>
            <p>주문 요청이 지연됐다. 주문 서비스는 <strong>Auth Service</strong>에 토큰 검증을 요청한다.</p>
          </div>
          <div className={styles.document} data-included={includeAlias}>
            <span className={styles.label}>C / 서비스 목록</span>
            <p><strong>Auth Service는 인증 서비스의 영문 이름</strong>이다. 서비스 ID는 svc-auth다.</p>
            <span className={styles.sourceState}>{includeAlias ? "답변 근거에 포함" : "원문은 있지만, 답변 근거에서 제외"}</span>
          </div>
        </div>

        <div className={styles.controls} role="group" aria-label="답변에 사용할 근거 비교">
          <button type="button" aria-pressed={!includeAlias} aria-controls={resultId} onClick={() => setIncludeAlias(false)}>A·B만 읽기</button>
          <button type="button" aria-pressed={includeAlias} aria-controls={resultId} onClick={() => setIncludeAlias(true)}>A·B·C 함께 읽기</button>
        </div>

        <div id={resultId} className={styles.result}>
          <div className={styles.relations} aria-label="원문에서 확인한 의존 관계">
            <div className={styles.relation}>
              <span className={styles.entity}>결제 서비스</span>
              <span className={styles.edge}>의존한다 · A<span aria-hidden="true">⟶</span></span>
              <span className={styles.entity}>인증 서비스<small>{includeAlias ? "svc-auth · C로 식별" : "A에 적힌 이름"}</small></span>
            </div>
            <div className={styles.relation}>
              <span className={styles.entity}>주문 서비스</span>
              <span className={styles.edge}>의존한다 · B<span aria-hidden="true">⟶</span></span>
              <span className={styles.entity}>{includeAlias ? "인증 서비스" : "Auth Service"}<small>{includeAlias ? "svc-auth · C로 식별" : "B에 적힌 이름"}</small></span>
            </div>
          </div>
          <div className={styles.answer} role="status" aria-live="polite" aria-atomic="true">
            <span className={styles.label}>{includeAlias ? "C로 같은 대상임을 확인" : "두 이름의 관계를 확인할 근거가 없음"}</span>
            <p>{includeAlias
              ? "결제와 주문은 모두 인증 서비스(svc-auth)에 의존한다. A·B의 의존 관계와 C의 별칭 정보로 답할 수 있다."
              : "결제는 인증 서비스에, 주문은 Auth Service에 의존한다. 두 이름이 같은 서비스인지는 A·B만으로 확정하지 않는다."}</p>
          </div>
        </div>
        <p className={styles.boundary}>어느 경우에도 장애의 원인은 확정할 수 없다. 이 문서들은 의존 관계를 설명할 뿐이다.</p>
      </div>
    </VisualFigure>
  );
}
