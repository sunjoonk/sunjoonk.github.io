import { FaAws, FaEnvelope, FaGithub } from "react-icons/fa";
import {
  SiDocker,
  SiDjango,
  SiFastapi,
  SiGit,
  SiGithubactions,
  SiHuggingface,
  SiNextdotjs,
  SiNginx,
  SiPostgresql,
  SiPytorch,
  SiPython,
  SiReact,
  SiTensorflow,
  SiTypescript,
} from "react-icons/si";
import Header from "../../components/Header";

const skills = [
  {
    title: "AI / LLM",
    items: [
      { Icon: SiPython, label: "Python" },
      { Icon: SiTensorflow, label: "TensorFlow" },
      { Icon: SiPytorch, label: "PyTorch" },
      { Icon: SiHuggingface, label: "Hugging Face" },
    ],
  },
  {
    title: "Backend / Infra",
    items: [
      { Icon: SiFastapi, label: "FastAPI" },
      { Icon: SiDjango, label: "Django" },
      { Icon: SiDocker, label: "Docker" },
      { Icon: FaAws, label: "AWS" },
      { Icon: SiPostgresql, label: "PostgreSQL" },
      { Icon: SiNginx, label: "Nginx" },
    ],
  },
  {
    title: "Frontend / Workflow",
    items: [
      { Icon: SiReact, label: "React" },
      { Icon: SiNextdotjs, label: "Next.js" },
      { Icon: SiTypescript, label: "TypeScript" },
      { Icon: SiGit, label: "Git" },
      { Icon: SiGithubactions, label: "GitHub Actions" },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="about-main" id="main-content">
        <div className="about-container">
          <header className="about-classic-hero">
            <div className="about-portrait-column">
              <img
                src="/profile.png"
                alt="김선준 프로필"
                className="profile-avatar"
                width={184}
                height={184}
              />
              <p>Profile 001</p>
            </div>

            <div className="about-identity-copy">
              <p className="blog-kicker">About</p>
              <h1>김선준</h1>
              <p className="about-role">Developer · AI Engineer</p>
              <p className="about-tagline">AI를 활용해 더 나은 제품을 만드는 개발자입니다.</p>
              <p className="about-hero-description">
                기술 자체보다 기술이 사용자에게 어떤 경험을 제공하는지 고민합니다.
                근거를 가지고 판단하고, 직접 확인하며, 조금씩 더 나은 서비스를
                만들어갑니다.
              </p>

              <div className="about-contact-links about-hero-links">
                <a href="mailto:sunjoon.dev@gmail.com">
                  <FaEnvelope size={17} aria-hidden="true" />
                  Email
                </a>
                <a href="https://github.com/sunjoonk" target="_blank" rel="noopener noreferrer">
                  <FaGithub size={17} aria-hidden="true" />
                  GitHub
                </a>
              </div>
            </div>
          </header>

          <section className="about-classic-section">
            <header>
              <p className="blog-kicker">Now</p>
              <h2>지금 하고 있는 일</h2>
            </header>
            <div className="about-section-body about-prose">
              <p>현재 AI를 활용한 웹 서비스를 개발하고 있습니다.</p>
              <p>
                웹 서비스를 만들고 개선하는 일부터 자체 호스팅 서버를 관리하는 일까지,
                제품이 사용자에게 안정적으로 전달되기 위해 필요한 여러 영역을 경험하고
                있습니다.
              </p>
              <p>
                특히 사용자가 서비스를 어떻게 경험하는지, 그리고 제품이 어떻게 더 나은
                경쟁력을 가질 수 있을지를 고민합니다. 고민에 그치지 않고 실제 서비스의
                변화로 이어질 때 가장 큰 보람을 느낍니다.
              </p>
            </div>
          </section>

          <section className="about-classic-section">
            <header>
              <p className="blog-kicker">Principles</p>
              <h2>일할 때 중요하게 생각하는 것</h2>
            </header>
            <div className="about-section-body about-values-grid">
              <article className="about-value-item">
                <span>01</span>
                <h3>근거를 가지고 판단합니다</h3>
                <p>
                  직감에만 의존하기보다 데이터와 실제 결과를 확인하려고 합니다. 작게라도
                  검증할 수 있는 방법을 찾고, 예상한 대로 동작하는지 직접 확인하는 과정을
                  중요하게 생각합니다.
                </p>
              </article>
              <article className="about-value-item">
                <span>02</span>
                <h3>사용자의 경험에서 출발합니다</h3>
                <p>
                  기술적으로 흥미로운 구현이 반드시 좋은 제품을 의미하지는 않는다고
                  생각합니다. 사용자의 불편을 줄이고 서비스의 가치를 높이는 방향인지 계속
                  질문합니다.
                </p>
              </article>
            </div>
          </section>

          <section className="about-classic-section">
            <header>
              <p className="blog-kicker">Together</p>
              <h2>함께 일하는 방식</h2>
            </header>
            <div className="about-section-body about-prose">
              <p className="about-lead-text">
                문제를 함께 고민하고, 해결될 때까지 열정을 나눌 수 있는 동료가 되고
                싶습니다.
              </p>
              <p>
                혼자 빠르게 답을 내는 것보다 서로의 생각을 나누며 더 나은 답을 찾는 과정을
                좋아합니다. 맡은 일을 끝까지 확인하고, 동료가 안심하고 자신의 역할을 맡길
                수 있는 신뢰할 만한 개발자가 되는 것이 목표입니다.
              </p>
            </div>
          </section>

          <section className="about-classic-section">
            <header>
              <p className="blog-kicker">Learning</p>
              <h2>계속 공부하는 것</h2>
            </header>
            <div className="about-section-body about-prose">
              <p className="about-lead-text">장기적으로는 AI 엔지니어로 성장하고 싶습니다.</p>
              <p>
                현재는 AI 기술을 실제 서비스와 제품으로 연결하는 일을 주로 하고 있지만,
                모델을 직접 학습하고 개선하는 데 필요한 수학적 기반과 모델링 역량에는 아직
                배울 것이 많다고 느낍니다.
              </p>
              <p>
                요즘은 AI 추론 모델을 더 효율적으로 운영하는 방법과 LLM 오케스트레이션을
                통한 업무 자동화에 관심을 두고 있습니다. 여러 모델과 도구를 연결했을 때
                자동화할 수 있는 일의 범위가 어디까지 확장될 수 있는지 탐구하고 있습니다.
              </p>
              <p>
                부족한 부분을 감추기보다 정확히 인식하고, 하나씩 채워가는 방식으로 성장하고자
                합니다.
              </p>
            </div>
          </section>

          <section className="about-classic-section">
            <header>
              <p className="blog-kicker">Writing</p>
              <h2>기록하는 이유</h2>
            </header>
            <div className="about-section-body about-prose">
              <p className="about-lead-text">
                배우고 고민했던 시간이 아무런 기록 없이 흘러가게 두고 싶지 않습니다.
              </p>
              <p>
                업무와 공부 과정에서 얻은 유용한 지식, 문제를 해결하며 내렸던 선택,
                시행착오에서 배운 내용을 이곳에 기록합니다. 기록이 미래의 저에게 다시 꺼내
                볼 수 있는 자료가 되고, 비슷한 문제를 만난 누군가에게도 작은 도움이 되기를
                바랍니다.
              </p>
            </div>
          </section>

          <section className="about-classic-section">
            <header>
              <p className="blog-kicker">Direction</p>
              <h2>앞으로</h2>
            </header>
            <div className="about-section-body about-prose">
              <p className="about-lead-text">
                어떤 상황에서도 한 사람의 개발자로서 자신의 역할을 다할 수 있는 사람이 되고
                싶습니다.
              </p>
              <p>
                익숙한 기술 안에서만 문제를 해결하는 사람이 아니라, 필요한 것을 배우고
                상황에 맞는 방법을 찾아 제품을 앞으로 나아가게 하는 개발자를 목표로 합니다.
              </p>
              <p className="about-closing-statement">
                결국 함께 일하는 사람과 서비스를 사용하는 사람 모두에게
                <strong> 신뢰할 수 있는 사람</strong>으로 기억되고 싶습니다.
              </p>
            </div>
          </section>

          <section className="about-classic-section about-tools-section">
            <header>
              <p className="blog-kicker">Tools I Use</p>
              <h2>사용하는 기술</h2>
            </header>
            <div className="about-skills-grid">
              {skills.map((group) => (
                <article className="about-skill-group" key={group.title}>
                  <h3>{group.title}</h3>
                  <div>
                    {group.items.map((item) => (
                      <span key={item.label}>
                        <item.Icon size={17} aria-hidden="true" />
                        {item.label}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
