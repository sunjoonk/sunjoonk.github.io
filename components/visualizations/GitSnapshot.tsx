"use client";

import { useId, useReducer } from "react";
import { initialSnapshot, shortStatus, snapshotReducer } from "../../content/visualizations/git-snapshot";
import { VisualFigure } from "./VisualFigure";
import styles from "./GitSnapshot.module.css";

export function GitSnapshot() {
  const [state, dispatch] = useReducer(snapshotReducer, initialSnapshot);
  const id = useId();
  const status = shortStatus(state);
  const difference = (before: number, after: number) => before === after
    ? <span className={styles.empty}>차이 없음</span>
    : <><span>− timeout = {before}</span><span className={styles.added}>+ timeout = {after}</span></>;
  return <VisualFigure title="같은 파일, 서로 다른 세 값" number={1}
    caption="추적 중인 config.txt 한 파일과 옵션 없는 commit을 단순화했다. 버튼은 화면 속 상태만 바꾸며 실제 저장소를 수정하지 않는다."
    source="직접 제작 · Git add / diff / commit 문서">
    <div className={styles.lab}>
      <div className={styles.topline}><span>config.txt · timeout 한 줄</span><button type="button" onClick={() => dispatch({ type: "reset" })}>처음 사례로</button></div>
      <div className={styles.snapshots}>
        <div className={styles.snapshot}>
          <span className={styles.eyebrow}>01 · WORKING TREE</span><h4>지금 편집한 파일</h4>
          <code>timeout = <strong>{state.working}</strong></code>
          <label htmlFor={`${id}-value`}>파일의 값 바꾸기</label>
          <select id={`${id}-value`} value={state.working} onChange={event => dispatch({ type: "edit", value: Number(event.target.value) })}>
            <option value={3000}>3000 ms</option><option value={5000}>5000 ms</option><option value={8000}>8000 ms</option>
          </select>
        </div>
        <div className={styles.snapshot}>
          <span className={styles.eyebrow}>02 · INDEX</span><h4>다음 커밋에 담을 값</h4>
          <code>timeout = <strong>{state.index}</strong></code>
          <span className={styles.actionHint}>작업 파일 → 인덱스</span>
          <button type="button" disabled={state.working === state.index} onClick={() => dispatch({ type: "add" })}>git add config.txt</button>
        </div>
        <div className={styles.snapshot}>
          <span className={styles.eyebrow}>03 · HEAD</span><h4>현재 커밋에 남은 값</h4>
          <code>timeout = <strong>{state.head}</strong></code>
          <span className={styles.actionHint}>인덱스 → 새 커밋</span>
          <button type="button" disabled={state.head === state.index} onClick={() => dispatch({ type: "commit" })}>git commit</button>
        </div>
      </div>
      <p className={styles.message} role="status" aria-live="polite" aria-atomic="true">{state.message}</p>
      <div className={styles.diffs}>
        <div><h4>git diff</h4><small>인덱스 → 작업 파일</small><div className={styles.diff}>{difference(state.index, state.working)}</div></div>
        <div><h4>git diff --staged</h4><small>HEAD → 인덱스</small><div className={styles.diff}>{difference(state.head, state.index)}</div></div>
      </div>
      <div className={styles.status}><code>git status --short</code><code>{status.trim() ? `${status} config.txt` : "(출력 없음)"}</code><span>첫 칸: 스테이징 변경 · 둘째 칸: 미스테이징 변경</span></div>
    </div>
  </VisualFigure>;
}
