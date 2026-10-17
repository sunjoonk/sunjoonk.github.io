export type TaskState = "absent" | "ready" | "starting" | "unhealthy" | "draining" | "stopped";
export type DeploymentScene = {
  label: string;
  title: string;
  old: TaskState;
  next: TaskState;
  observation: string;
};

const before: DeploymentScene = {
  label: "배포 전", title: "v1 두 개가 요청을 받는다", old: "ready", next: "absent",
  observation: "v1 배포는 완료된 상태다. 두 태스크가 트래픽을 감당할 수 있고, 새 버전을 시작할 자원 여유가 있다고 가정한다.",
};
const starting: DeploymentScene = {
  label: "v2 실행", title: "실행은 네 개, 새 요청 대상은 두 개", old: "ready", next: "starting",
  observation: "v2 프로세스는 실행됐지만 초기화와 준비 상태 확인이 남아 있다. 이 장면에서는 정상 v1만 새 요청을 받는다.",
};

// Illustrative snapshots, not ECS scheduling or health-check timing emulation.
// Each lane represents two replicas. Failed-task replacements are omitted.
export const deploymentScenarios = {
  normal: [before, starting, {
    label: "준비 통과", title: "잠시 v1과 v2가 함께 요청을 받는다", old: "ready", next: "ready",
    observation: "v2가 준비 검사를 통과했다. 새 요청이 두 버전으로 나뉠 수 있다. 분산 비율은 이 그림에서 정하지 않는다.",
  }, {
    label: "v1 제외", title: "새 요청은 v2로, 진행 중 요청은 v1에서", old: "draining", next: "ready",
    observation: "v1은 새 요청 대상에서 빠지고 이미 받은 요청을 마무리한다. 드레이닝과 애플리케이션의 정상 종료가 함께 필요하다.",
  }, {
    label: "교체 완료", title: "v2 두 개만 남는다", old: "stopped", next: "ready",
    observation: "v1의 진행 중 요청이 끝나고 종료됐다. 실제 배포에서는 사용자 요청의 오류와 지연도 확인해야 성공이라고 말할 수 있다.",
  }] satisfies DeploymentScene[],
  failure: [before, starting, {
    label: "준비 실패", title: "v2가 실행돼도 요청은 v1로 간다", old: "ready", next: "unhealthy",
    observation: "v2의 준비 상태 검사가 계속 실패한다. 정상 v1이 남아 있으므로 새 요청은 v1로 간다. 실패 태스크의 재시작 과정은 생략했다.",
  }, {
    label: "실패 판정", title: "실패 누적 뒤 배포 중단을 결정한다", old: "ready", next: "unhealthy",
    observation: "서킷 브레이커가 실패 기준에 도달했다. 검사 한 번이 실패했다고 즉시 롤백되는 것은 아니다. 여기서 v1은 아직 교체되지 않았다.",
  }, {
    label: "v1 복귀", title: "마지막 완료 배포인 v1로 돌아간다", old: "ready", next: "stopped",
    observation: "롤백 옵션이 켜져 있고 돌아갈 완료 배포가 있다는 조건이다. 이 예시에서는 v1이 계속 남아 있었다. 일부 교체 뒤의 복구라면 이전 태스크를 다시 시작할 수도 있다.",
  }] satisfies DeploymentScene[],
};

export const taskStates: Record<TaskState, { label: string; detail: string; running: boolean; receives: boolean }> = {
  absent: { label: "아직 없음", detail: "시작 전", running: false, receives: false },
  ready: { label: "새 요청 수신", detail: "healthy", running: true, receives: true },
  starting: { label: "준비 확인 중", detail: "initial · 실행 중", running: true, receives: false },
  unhealthy: { label: "준비 검사 실패", detail: "unhealthy · 실행 중", running: true, receives: false },
  draining: { label: "기존 요청 마무리", detail: "draining", running: true, receives: false },
  stopped: { label: "종료됨", detail: "요청 대상 제외", running: false, receives: false },
};
