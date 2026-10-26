import { VisualFigure } from "./VisualFigure";
import styles from "./SpeechFlow.module.css";

const flows = [
  {
    label: "01 / STT", title: "소리에서 글자로",
    steps: [
      ["파형", "시간에 따라 변하는 음성 샘플"],
      ["음성 표현", "전처리와 인코더가 소리의 특징을 표현"],
      ["텍스트 디코더", "음성 표현을 참고해 텍스트 토큰 예측"],
      ["전사문", "말한 내용을 문자열로 복원"],
    ],
    note: "인코더·디코더 방식의 예시. CTC 방식은 본문에서 따로 설명한다.",
  },
  {
    label: "02 / TTS", title: "글자에서 소리로",
    steps: [
      ["텍스트", "읽을 문장과 발음·화자 조건"],
      ["텍스트 표현", "정규화·토큰화 후 문장 정보를 표현"],
      ["음향 표현", "말의 길이와 억양을 담은 멜 스펙트로그램 예측"],
      ["보코더 → 파형", "음향 표현을 재생 가능한 소리로 변환"],
    ],
    note: "SpeechT5의 TTS처럼 멜 스펙트로그램을 거치는 구성의 예시.",
  },
];

export function SpeechFlow() {
  return (
    <VisualFigure title="두 방향, 서로 다른 출력" number={1}
      caption="모든 음성 모델이 이 단계를 따르는 것은 아니다. STT는 텍스트 시퀀스를, 이 TTS 구성은 음향 표현을 예측한다."
      source="직접 제작 · 본문의 Hugging Face 구조 설명과 SpeechT5 문서를 바탕으로 단순화">
      <div className={styles.flows}>
        {flows.map((flow) => (
          <section className={styles.flow} key={flow.label} aria-label={flow.title}>
            <span className={styles.label}>{flow.label}</span>
            <h4>{flow.title}</h4>
            <ol>
              {flow.steps.map(([title, description], index) => (
                <li key={title}>
                  <span className={styles.number} aria-hidden="true">{index + 1}</span>
                  <div><strong>{title}</strong><p>{description}</p></div>
                </li>
              ))}
            </ol>
            <p className={styles.note}>{flow.note}</p>
          </section>
        ))}
      </div>
    </VisualFigure>
  );
}
