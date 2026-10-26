import { getPostBySlug } from "./posts";

// Editorial connections: explain what a reader can explore next.
const recommendations: Record<string, { slug: string; reason: string }[]> = {
  "speech-to-text-and-back": [
    { slug: "rag-beyond-similarity", reason: "음성 질문을 텍스트로 옮긴 다음, 답변에 필요한 근거를 빠짐없이 모으는 방법을 살펴봅니다." },
    { slug: "jev-system-one", reason: "인식한 말이 실제 동작으로 이어질 때, 모델 판단과 코드의 처리 규칙을 어떻게 나눌지 생각해봅니다." },
  ],
  "rea-reverse-engineering": [
    { slug: "gpt-6-astra", reason: "도구가 내놓은 결과를 무엇으로 검증할지, 작업 완료의 기준을 살펴봅니다." },
  ],
  "git-internals-and-collaboration": [
    { slug: "aws-deployment-and-operations", reason: "커밋에 남긴 변경이 서비스에 전달될 때, 새 버전으로 요청을 넘기는 과정을 살펴봅니다." },
    { slug: "rea-reverse-engineering", reason: "Git에 기록된 원본과 달리, 실행 파일에서 구현을 되짚을 때의 한계를 알아봅니다." },
  ],
  "aws-deployment-and-operations": [
    { slug: "git-internals-and-collaboration", reason: "배포할 버전을 만들기 전, 어떤 변경이 커밋에 포함되는지 확인합니다." },
    { slug: "gpt-6-astra", reason: "실행 성공과 실제 완료를 구분하는 관점을 AI 작업의 검증으로 넓혀봅니다." },
  ],
  "rag-beyond-similarity": [
    { slug: "jev-system-one", reason: "답의 근거를 모은 다음, 모델의 판단을 실제 처리 규칙에 연결하는 문제를 살펴봅니다." },
    { slug: "gpt-6-astra", reason: "검색 결과의 품질을 넘어, 전체 작업이 끝났는지 평가하는 기준을 생각해봅니다." },
  ],
  "jev-system-one": [
    { slug: "rag-beyond-similarity", reason: "모델의 판단에 필요한 근거가 검색에서 빠지는 경우를 살펴봅니다." },
    { slug: "gpt-6-astra", reason: "자동화의 경계를 정한 뒤, 실제로 일을 완수했는지 확인하는 기준을 알아봅니다." },
  ],
  "gpt-6-astra": [
    { slug: "jev-system-one", reason: "완료의 기준을 실제 자동화에 적용할 때, AI 판단과 코드의 역할을 나눠봅니다." },
    { slug: "rag-beyond-similarity", reason: "그럴듯한 결과에 빠진 근거를 찾는 방법을, 문서 검색 사례로 구체화합니다." },
  ],
};

export function getRelatedPosts(slug: string) {
  return (recommendations[slug] ?? []).flatMap(({ slug: target, reason }) => {
    const post = target !== slug ? getPostBySlug(target) : undefined;
    return post ? [{ post, reason }] : [];
  }).slice(0, 2);
}
