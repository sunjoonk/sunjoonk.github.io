// Teaching models inspired by the documented DX-Ball pan rule at scale = 1.
// These are not REA outputs or an execution of the original binary.
export const referencePan = (x: number) => Math.trunc(x * 1.5625 - 500) || 0;
export const observedPositions = [0, 320, 640];
export const reconstructionCandidates = [
  { id: "A", title: "곱한 뒤 중심을 빼기", expression: "trunc(x × 1.5625 − 500)", evaluate: referencePan },
  { id: "B", title: "중심을 옮긴 뒤 곱하기", expression: "trunc((x − 320) × 1.5625)", evaluate: (x: number) => Math.trunc((x - 320) * 1.5625) || 0 },
  { id: "C", title: "왼쪽·중앙·오른쪽만 구분", expression: "x < 320 ? −500 : x > 320 ? 500 : 0", evaluate: (x: number) => x < 320 ? -500 : x > 320 ? 500 : 0 },
];
export function candidateMatches(candidate: typeof reconstructionCandidates[number], extra: number | null) {
  const positions = extra === null ? observedPositions : [...observedPositions, extra];
  return positions.every(x => candidate.evaluate(x) === referencePan(x));
}
