"use client";

import { useId, useState } from "react";
import { completionTrials, criteria, qualifies, type Criterion } from "../../content/visualizations/completion-evidence";
import { VisualFigure } from "./VisualFigure";
import styles from "./CompletionEvidence.module.css";

export function CompletionEvidence() {
  const [criterion, setCriterion] = useState<Criterion>("artifact");
  const id = useId();
  const selected = criteria.find(item => item.id === criterion)!;
  const count = completionTrials.filter(trial => qualifies(trial, criterion)).length;
  return <VisualFigure title="같은 여덟 번의 실행, 달라지는 완료율" number={1}
    badge="가상 기록" caption="평가 기준을 설명하기 위해 만든 여덟 개의 기록. Astra 또는 다른 모델의 실측 성능이 아니다. 분모와 실행 기록은 고정하고 판정 기준만 바꾼다."
    source="직접 제작 · 설명용 데이터">
    <div className={styles.audit}>
      <div className={styles.criteria} role="group" aria-label="완료 판정 기준">
        {criteria.map((item, index) => <button key={item.id} type="button" aria-pressed={item.id === criterion} aria-controls={`${id}-result`} onClick={() => setCriterion(item.id)}><span>0{index + 1}</span>{item.label}</button>)}
      </div>
      <div id={`${id}-result`} className={styles.summary} role="status" aria-live="polite" aria-atomic="true">
        <div className={styles.score}><strong>{count}</strong><span>/ {completionTrials.length}회</span><span className={styles.percent}>{count / completionTrials.length * 100}%</span></div>
        <div><span className={styles.label}>현재 기준 · {selected.label}</span><p>{selected.description}</p></div>
      </div>
      <div className={styles.strip} aria-hidden="true">{completionTrials.map(trial => <span key={trial.id} data-pass={qualifies(trial, criterion)}>{trial.id}</span>)}</div>
      <table className={styles.ledger}>
        <caption>가상 실행 기록 · 같은 로그인 오류 수정 과제를 여덟 번 수행했다고 가정</caption>
        <thead><tr><th scope="col">실행</th><th scope="col">남아 있는 근거</th><th scope="col">판정</th></tr></thead>
        <tbody>{completionTrials.map(trial => <tr key={trial.id} data-pass={qualifies(trial, criterion)}>
          <th scope="row">{trial.id}</th><td>{trial.evidence}<small>파일 있음 · 사람 교정 {trial.corrections}회</small></td><td>{qualifies(trial, criterion) ? "충족" : "미충족"}</td>
        </tr>)}</tbody>
      </table>
      <p className={styles.note}>미충족 실행도 분모에 남는다. ‘교정 없이’는 시작 지시와 사전에 정한 도구 사용까지 없었다는 뜻이 아니다.</p>
    </div>
  </VisualFigure>;
}
