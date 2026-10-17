"use client";

import { useId, useState } from "react";
import { candidateMatches, observedPositions, reconstructionCandidates, referencePan } from "../../content/visualizations/reconstruction-model";
import { VisualFigure } from "./VisualFigure";
import styles from "./ReconstructionLab.module.css";

export function ReconstructionLab() {
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState(160);
  const id = useId();
  const matches = reconstructionCandidates.filter(candidate => candidateMatches(candidate, expanded ? position : null)).length;
  return <VisualFigure title="세 점이 같으면, 같은 프로그램일까?" badge="설명용 실험" number={1}
    caption="DX-Ball 문서의 식을 scale=1로 고정해 브라우저에서 계산한다. 후보 B·C는 비교를 위해 직접 만든 식이다. REA 실행 결과나 원본 바이너리 실측이 아니다. x는 0~640의 정수, trunc는 소수부 버림이다."
    source="DX-Ball sound-pan 사례 · 비교 화면 직접 제작" sourceHref="https://rea.tools/showcase/dx-ball/">
    <div className={styles.lab}>
      <div className={styles.samples} aria-label="처음 관찰한 세 점">
        {observedPositions.map(x => <div key={x}><span>x = {x}</span><strong>{referencePan(x)}</strong><small>{x === 0 ? "왼쪽" : x === 320 ? "중앙" : "오른쪽"}</small></div>)}
      </div>
      <div className={styles.controls}>
        <button type="button" aria-pressed={expanded} aria-controls={`${id}-comparison`} onClick={() => setExpanded(value => !value)}>{expanded ? "추가 관찰 제외" : "중간 위치도 관찰하기"}</button>
        <span>기존 관찰은 유지하고, 입력 하나를 더 비교한다.</span>
      </div>
      {expanded && <div className={styles.probe}>
        <label htmlFor={`${id}-position`}>추가 입력 <strong>x = {position}</strong></label>
        <input id={`${id}-position`} type="range" min={0} max={640} step={1} value={position} onChange={event => setPosition(Number(event.target.value))} aria-valuetext={`위치 ${position}, 기준 출력 ${referencePan(position)}`} />
        <div className={styles.axis}><span>0 · 왼쪽</span><span>320 · 중앙</span><span>640 · 오른쪽</span></div>
      </div>}
      <div id={`${id}-comparison`}>
        <div className={styles.result} role="status" aria-live="polite" aria-atomic="true">
          <span className={styles.eyebrow}>{expanded ? `추가 관찰 · x=${position}, 기준 출력 ${referencePan(position)}` : "관찰 범위 · x=0, 320, 640"}</span>
          <p><strong>{matches}</strong>개의 후보가 아직 남아 있다</p>
          <span>{matches === 3 ? "세 후보 모두 현재 관찰을 설명한다. 중간 위치에서 차이를 찾아보자." : "C는 관찰과 어긋난다. 그래도 A와 B 중 원래 작성된 식은 판별할 수 없다."}</span>
        </div>
        <div className={styles.candidates}>
          {reconstructionCandidates.map(candidate => {
            const matches = candidateMatches(candidate, expanded ? position : null);
            return <div key={candidate.id} className={styles.candidate} data-match={matches}>
              <div className={styles.candidateHeading}><span className={styles.letter}>{candidate.id}</span><h4>{candidate.title}</h4><span className={styles.verdict}>{matches ? "관찰과 일치" : "불일치"}</span></div>
              <code>{candidate.expression}</code>
              {expanded && <div className={styles.values}>이 입력의 출력 <strong>{candidate.evaluate(position)}</strong><span>기준값 {referencePan(position)}</span></div>}
            </div>;
          })}
        </div>
      </div>
      <p className={styles.note}>‘관찰과 일치’는 원본 소스라는 뜻이 아니다. 이 정수 범위에서 A와 B는 같은 결과를 내지만 작성 형태는 다르다.</p>
    </div>
  </VisualFigure>;
}
