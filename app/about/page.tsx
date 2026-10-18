import { FaEnvelope, FaGithub } from "react-icons/fa";
import Header from "../../components/Header";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className={`blog-main ${styles.main}`} id="main-content">
        <article className={styles.profile} aria-labelledby="about-name">
          <header className={styles.identity}>
            <img src="/profile.png" alt="김선준 프로필" width={112} height={112} className={styles.portrait} />
            <div>
              <p className={styles.eyebrow}>About</p>
              <h1 id="about-name">김선준</h1>
              <p className={styles.role}>AI Engineer · Full-stack Developer</p>
            </div>
          </header>

          <div className={styles.intro}>
            <p className={styles.lead}>현업 엔지니어의 업무를 돕는 AI 서비스를 만듭니다.</p>
            <p>
              현재는 RAG 기반 시험 장비 자동화 서비스를 개발하고 있습니다.
              AI를 활용하는 일부터 Next.js와 Django로 웹 서비스를 만들고,
              C#으로 클라이언트를 구현하는 일까지 함께 하고 있습니다.
            </p>
          </div>

          <section className={styles.section} aria-labelledby="about-interest">
            <h2 id="about-interest">기술이 쓰이는 곳에 관심이 있습니다.</h2>
            <p>
              새로운 기술을 보면 어디에 쓸 수 있을지부터 생각합니다.
              AI가 텍스트와 이미지 속 정보를 이해하고, 실제 업무에 활용할 수 있도록
              만드는 과정에 관심이 있습니다.
            </p>
            <p>
              현업 엔지니어가 정보를 찾고, 확인하고, 업무에 적용하는 과정에서 겪는
              어려움을 해결하고 싶습니다. 그 과정에서 반복되는 일을 줄이고,
              판단이 필요한 일에 더 집중할 수 있는 도구를 만들고자 합니다.
            </p>
          </section>

          <section className={styles.section} aria-labelledby="about-writing">
            <h2 id="about-writing">궁금한 것은 직접 만들어보고 기록합니다.</h2>
            <p>
              이곳에는 기술을 이해하고 직접 구현하면서 생긴 질문을 기록합니다.
              AI를 서비스에 적용하는 과정뿐 아니라, 흥미로워서 만들어본 작은 UI와
              개발 도구에 관한 이야기도 남깁니다.
            </p>
          </section>

          <nav className={styles.contact} aria-label="연락 및 프로필">
            <a href="https://github.com/sunjoonk" target="_blank" rel="noopener noreferrer">
              <FaGithub size={17} aria-hidden="true" /> GitHub
            </a>
            <a href="mailto:sunjoon.dev@gmail.com">
              <FaEnvelope size={17} aria-hidden="true" /> Email
            </a>
          </nav>
        </article>
      </main>
    </>
  );
}
