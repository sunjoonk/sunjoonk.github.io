"use client";

import { useId, useState } from "react";
import { VisualFigure } from "./VisualFigure";
import styles from "./JevDecision.module.css";

const examples = [
  { label: "한쪽에 집중", report: "두 번째 창을 열면 저장 버튼이 사라집니다. 새로고침하면 다시 보입니다.", probabilities: { ui: 0.86, api: 0.10, other: 0.04 } },
  { label: "두 분류가 비슷", report: "저장을 누르면 화면이 멈춥니다. 요청이 실패한 것인지 버튼이 반응하지 않는 것인지 모르겠습니다.", probabilities: { ui: 0.51, api: 0.47, other: 0.02 } },
  { label: "기타가 우세", report: "계약 담당자 연락처를 어디에서 찾을 수 있나요?", probabilities: { ui: 0.03, api: 0.02, other: 0.95 } },
] as const;
const labels = { ui: "UI", api: "API", other: "기타" };

export function JevDecision() {
  const [example, setExample] = useState(0);
  const [threshold, setThreshold] = useState(0.8);
  const id = useId();
  const current = examples[example];
  const ranked = Object.entries(current.probabilities).sort((a, b) => b[1] - a[1]);
  const [choice, probability] = ranked[0];
  const review = choice === "other" || probability < threshold;
  const confidence = (probability - 1 / 3) / (1 - 1 / 3);

  return <VisualFigure
    title="같은 선택값이어도 처리 경로는 달라진다"
    number={1}
    caption="분류 확률은 설명을 위해 정한 값이다. 신고 예시와 자동 배정 기준을 바꾸면 코드의 처리 결과가 달라진다. 실제 모델을 호출하거나 신고를 배정하지 않는다."
    source="직접 제작 · 가상 출력과 예시 정책"
  >
    <div className={styles.example}>
      <div className={styles.tabs} role="group" aria-label="가상 신고 사례 선택">
        {examples.map((item, index) => <button key={item.label} type="button" aria-pressed={example === index} aria-controls={`${id}-result`} onClick={() => setExample(index)}>{item.label}</button>)}
      </div>
      <p className={styles.report}>{current.report}</p>
      <div className={styles.columns} id={`${id}-result`}>
        <section aria-label="가상의 모델 판단">
          <span className={styles.label}>01 / 모델의 판단 · 가상 출력</span>
          <dl className={styles.distribution}>
            {Object.entries(current.probabilities).map(([key, value]) => <div className={styles.row} key={key}>
              <dt>{labels[key as keyof typeof labels]}</dt>
              <dd><span className={styles.track} aria-hidden="true"><span style={{ width: `${value * 100}%` }} /></span><span>{value.toFixed(2)}</span></dd>
            </div>)}
          </dl>
          <p className={styles.metric}>choice: <strong>{choice}</strong><br />confidence: {confidence.toFixed(3)}</p>
        </section>
        <section aria-label="코드에서 정한 배정 정책">
          <label className={styles.label} htmlFor={`${id}-threshold`}>02 / 코드의 기준 · 최고 확률 하한</label>
          <div className={styles.threshold}><output htmlFor={`${id}-threshold`}>{threshold.toFixed(2)}</output><span>이상일 때 자동 배정</span></div>
          <input id={`${id}-threshold`} type="range" min="0.5" max="0.95" step="0.05" value={threshold} onChange={event => setThreshold(Number(event.target.value))} />
          <p className={styles.metric}>기타는 확률에 관계없이 검토한다.<br />이 기준은 검증된 권장값이 아니다.</p>
        </section>
      </div>
      <div className={styles.outcome} role="status" aria-live="polite" aria-atomic="true">
        <span className={styles.label}>03 / 처리 결과</span>
        <p><strong>{review ? "검토 대기열" : `${labels[choice as keyof typeof labels]} 팀에 자동 배정`}</strong><span>{choice === "other" ? "분류 범위 밖의 신고이므로 사람이 확인한다." : `${probability.toFixed(2)} ${review ? "<" : "≥"} ${threshold.toFixed(2)} · ${review ? "선택된 분류는 있지만 자동 배정 기준에는 못 미친다." : "설정한 최고 확률 기준을 충족한다."}`}</span></p>
      </div>
    </div>
  </VisualFigure>;
}
