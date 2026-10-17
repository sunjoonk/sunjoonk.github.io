export type Snapshot = { working: number; index: number; head: number; message: string };
export type SnapshotAction = { type: "edit"; value: number } | { type: "add" | "commit" | "reset" };
export const initialSnapshot: Snapshot = {
  working: 8000, index: 5000, head: 3000,
  message: "5000을 add한 뒤 파일만 8000으로 다시 수정했다. 지금 커밋하면 어느 값이 남을까?",
};
export function snapshotReducer(state: Snapshot, action: SnapshotAction): Snapshot {
  switch (action.type) {
    case "edit": return { ...state, working: action.value, message: `작업 파일을 ${action.value}으로 수정했다. 인덱스와 HEAD는 그대로다.` };
    case "add": return { ...state, index: state.working, message: `git add: 작업 파일의 ${state.working}을 인덱스에 반영했다. 아직 커밋은 바뀌지 않았다.` };
    case "commit": return state.head === state.index ? state : { ...state, head: state.index, message: `git commit: ${state.index}을 새 커밋에 기록했다. 작업 파일의 ${state.working}은 그대로다.` };
    case "reset": return initialSnapshot;
  }
}
export function shortStatus(state: Snapshot) {
  return `${state.head === state.index ? " " : "M"}${state.index === state.working ? " " : "M"}`;
}
