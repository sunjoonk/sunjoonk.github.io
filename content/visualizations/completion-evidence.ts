export type Criterion = "artifact" | "accepted" | "unassisted";
export const criteria: { id: Criterion; label: string; description: string }[] = [
  { id: "artifact", label: "파일을 만들었나", description: "결과 파일이 존재하면 센다. 올바르게 동작하는지는 아직 묻지 않는다." },
  { id: "accepted", label: "요구사항을 지켰나", description: "기능 검사와 변경 범위를 모두 통과한 결과를 센다. 사람의 교정은 허용한다." },
  { id: "unassisted", label: "교정 없이 끝냈나", description: "요구사항을 통과하고, 시작 후 사람의 교정도 없었던 결과만 센다." },
];
// Invented teaching records. No model was run and no performance is implied.
export const completionTrials = [
  { id: "01", evidence: "정상·오류 경로 통과, 범위 준수", artifact: true, accepted: true, corrections: 0 },
  { id: "02", evidence: "정상·오류 경로 통과, 범위 준수", artifact: true, accepted: true, corrections: 0 },
  { id: "03", evidence: "시간 초과 뒤 버튼이 계속 잠김", artifact: true, accepted: false, corrections: 0 },
  { id: "04", evidence: "누락한 시간 초과 처리를 사람이 지적한 뒤 통과", artifact: true, accepted: true, corrections: 1 },
  { id: "05", evidence: "정상·오류 경로 통과, 범위 준수", artifact: true, accepted: true, corrections: 0 },
  { id: "06", evidence: "기능은 통과했지만 요청 밖의 인증 설정도 변경", artifact: true, accepted: false, corrections: 0 },
  { id: "07", evidence: "요청 밖의 변경을 사람이 되돌리게 한 뒤 통과", artifact: true, accepted: true, corrections: 1 },
  { id: "08", evidence: "정상·오류 경로 통과, 범위 준수", artifact: true, accepted: true, corrections: 0 },
];
export function qualifies(trial: typeof completionTrials[number], criterion: Criterion) {
  if (criterion === "artifact") return trial.artifact;
  if (criterion === "accepted") return trial.accepted;
  return trial.accepted && trial.corrections === 0;
}
