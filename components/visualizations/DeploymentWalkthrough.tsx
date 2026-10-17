"use client";

import { useId, useState } from "react";
import { deploymentScenarios, taskStates, type TaskState } from "../../content/visualizations/deployment-scenarios";
import { VisualFigure } from "./VisualFigure";
import styles from "./DeploymentWalkthrough.module.css";

export function DeploymentWalkthrough() {
  const [scenario, setScenario] = useState<keyof typeof deploymentScenarios>("normal");
  const [step, setStep] = useState(1);
  const id = useId();
  const scenes = deploymentScenarios[scenario];
  const scene = scenes[step];
  const running = [scene.old, scene.next].filter(state => taskStates[state].running).length * 2;
  const receiving = [scene.old, scene.next].filter(state => taskStates[state].receives).length * 2;
  const destination = [taskStates[scene.old].receives && "v1", taskStates[scene.next].receives && "v2"].filter(Boolean).join(" + ");

  const lane = (version: string, state: TaskState, names: string[]) => <div className={styles.lane} data-state={state}>
    <div className={styles.laneHeading}><strong>{version}</strong><span>{version === "v1" ? "기존 버전" : "새 버전"}</span></div>
    <div className={styles.connector}><span aria-hidden="true">{taskStates[state].receives ? "↓" : "—"}</span>{taskStates[state].receives ? "새 요청 전달" : state === "draining" ? "새 요청 차단 · 기존 요청만" : "새 요청 전달 안 함"}</div>
    <div className={styles.replicas}>{names.map(name => <div key={name} className={styles.task}>
      <span className={styles.taskId}>{version} / {name}</span>
      <strong>{taskStates[state].label}</strong>
      <small>{taskStates[state].detail}</small>
    </div>)}</div>
  </div>;

  return <VisualFigure
    id="deployment-walkthrough"
    title="배포 중, 요청은 어디로 갈까?"
    number={1}
    caption="정상 v1 두 개를 유지하며 v2 두 개를 교체하는 설명용 장면. 실제 스케줄링·시간·분산 비율을 재현하지 않는다. 시나리오를 바꾸면 같은 단계에서 결과를 비교할 수 있다."
    source="직접 제작 · AWS 공식 문서를 바탕으로 구성"
  >
    <div className={styles.experiment}>
      <div className={styles.scenarios} role="group" aria-label="배포 시나리오">
        <button type="button" aria-pressed={scenario === "normal"} aria-controls={`${id}-scene`} onClick={() => setScenario("normal")}>정상 교체</button>
        <button type="button" aria-pressed={scenario === "failure"} aria-controls={`${id}-scene`} onClick={() => setScenario("failure")}>준비 검사 실패</button>
      </div>
      <div className={styles.steps} role="group" aria-label="배포 단계 선택">
        {scenes.map((item, index) => <button type="button" key={index} aria-pressed={step === index} aria-controls={`${id}-scene`} onClick={() => setStep(index)}>
          <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
        </button>)}
      </div>
      <div id={`${id}-scene`}>
        <div className={styles.summary} role="status" aria-live="polite" aria-atomic="true">
          <span className={styles.eyebrow}>장면 {step + 1} / 5 · {scenario === "normal" ? "정상 교체" : "준비 검사 실패"}</span>
          <p className={styles.headline}>{scene.title}</p>
          <span className={styles.readout}>실행 중 {running}개 · 새 요청 대상 {receiving}개 · 요청 경로 {destination}</span>
        </div>
        <div className={styles.diagram} aria-label="ALB에서 버전별 태스크로 가는 요청">
          <div className={styles.ingress}><span>사용자의 새 요청</span><span aria-hidden="true">↓</span><strong>ALB</strong><small>준비된 대상으로 전달</small></div>
          <div className={styles.lanes}>
            {lane("v1", scene.old, ["A", "B"])}
            {lane("v2", scene.next, ["C", "D"])}
          </div>
        </div>
        <p className={styles.observation}>{scene.observation}</p>
      </div>
      <p className={styles.note}>전제: v1은 정상이고 트래픽을 감당한다. 모든 대상이 비정상인 ALB의 fail-open 상황은 이 그림에 포함하지 않았다.</p>
    </div>
  </VisualFigure>;
}
