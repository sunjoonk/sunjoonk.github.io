"use client";

import { useRef } from "react";
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

const projectImages = {
  lawai: Array.from({ length: 9 }, (_, index) => `/images/lawai/${String(index + 1).padStart(2, "0")}.png`),
  hackathon: Array.from({ length: 11 }, (_, index) => `/images/hackathon/${String(index + 1).padStart(2, "0")}.png`),
};

function ProfileAvatar() {
  const imgRef = useRef<HTMLImageElement | null>(null);

  return (
    <img
      ref={imgRef}
      src="/profile.png"
      alt="김선준 프로필"
      onError={() => {
        if (imgRef.current) {
          imgRef.current.style.display = "none";
        }
      }}
      className="profile-avatar"
    />
  );
}

export default function AboutPage() {
  const profile = {
    name: "김선준",
    title: "AI 엔지니어",
    tagline: "AI의 이론과 서비스를 연결하는 엔지니어",
    about:
      "TensorFlow, PyTorch를 사용하여 모델 구현 및 학습이 가능하며, 사전 학습된 모델을 파인튜닝 및 RAG 등을 적용하여 원하는 Task를 수행하는 모델을 만들고 서비스를 개발할 수 있는 도전적이고 열정이 넘치는 개발자입니다.",
  };

  const education = {
    title: "[IBM x RedHat] AX Academy",
    location: "대한민국",
    dates: "2025.05 ~ 2025.11",
    details: [
      "TensorFlow/PyTorch로 DNN·CNN·RNN·NLP 실습 및 모델 아키텍처 구현",
      "API 또는 HuggingFace의 오픈소스 모델을 활용한 AI 어플리케이션 개발",
      "FastAPI, Docker, GitHub Actions, AWS를 활용한 CI/CD 파이프라인 구축 및 운영 경험",
    ],
  };

  const projects = [
    {
      eyebrow: "Project",
      title: "법률 도메인 특화 Agentic LLM 서비스",
      location: "Side / Team",
      dates: "2025",
      details: [
        "RAG 파이프라인 설계: Llama-3-8B 모델과 RAG를 결합하여 법률 질의응답 성능을 최적화하고, 법령·판례 텍스트를 도메인 구조에 맞게 정제·청킹하여 검색 정확도를 향상시켰습니다.",
        "Agentic 아키텍처 구축: LangGraph 기반 에이전트 오케스트레이션으로 Retrieval, 추론, 문서 작성 등 모듈을 유연하게 조율하고, 동적 툴 라우팅을 구현했습니다.",
        "데이터베이스 및 배포: ChromaDB를 활용한 Vector DB와 PostgreSQL(RDBMS)을 구축했으며, GitHub Actions와 AWS EC2를 통해 CI/CD 파이프라인을 자동화하고 서비스를 배포했습니다.",
      ],
      images: projectImages.lawai,
    },
  ];

  const achievements = [
    {
      eyebrow: "Competition",
      title: "K-Digital Training 해커톤 - SinkSafe",
      location: "주최: 직업능력심사평가원",
      dates: "2025",
      details: [
        "인공위성 InSAR 데이터와 YOLOv12 모델을 활용한 싱크홀 위험지역 탐지.",
        "React를 활용하여 위험지역 시각화 웹 서비스 제작.",
      ],
      images: projectImages.hackathon,
    },
  ];

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

  return (
    <>
      <Header />
      <main className="about-main">
        <div className="about-container">
          <header className="about-classic-hero">
            <div className="about-portrait-column">
              <ProfileAvatar />
              <p>Profile 001</p>
            </div>

            <div className="about-identity-copy">
              <p className="blog-kicker">About</p>
              <h1>{profile.name}</h1>
              <p className="about-role">{profile.title}</p>
              <p className="about-tagline">{profile.tagline}</p>

              <div className="about-contact-links about-hero-links">
                <a href="mailto:sunjoon.dev@gmail.com">
                  <FaEnvelope size={17} />
                  Email
                </a>
                <a href="https://github.com/sunjoonk" target="_blank" rel="noopener noreferrer">
                  <FaGithub size={17} />
                  GitHub
                </a>
              </div>
            </div>
          </header>

          <section className="about-classic-section about-intro-section">
            <header>
              <p className="blog-kicker">Profile</p>
              <h2>소개</h2>
            </header>
            <p>{profile.about}</p>
          </section>

          <section className="about-classic-section">
            <header>
              <p className="blog-kicker">Skills</p>
              <h2>보유 기술</h2>
            </header>
            <div className="about-skills-grid">
              {skills.map((group) => (
                <article className="about-skill-group" key={group.title}>
                  <h3>{group.title}</h3>
                  <div>
                    {group.items.map((item) => (
                      <span key={item.label}>
                        <item.Icon size={17} />
                        {item.label}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="about-classic-section">
            <header>
              <p className="blog-kicker">Education</p>
              <h2>교육</h2>
            </header>
            <article className="about-lined-entry">
              <div>
                <h3>{education.title}</h3>
                <p>
                  {education.location} · {education.dates}
                </p>
              </div>
              <ul>
                {education.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          </section>

          <section className="about-classic-section">
            <header>
              <p className="blog-kicker">Projects</p>
              <h2>프로젝트</h2>
            </header>
            <div className="about-entry-list">
              {projects.map((project) => (
                <article className="about-project-entry" key={project.title}>
                  <div className="about-entry-copy">
                    <p className="project-meta">
                      {project.location} · {project.dates}
                    </p>
                    <h3>{project.title}</h3>
                    <ul>
                      {project.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="project-image-strip" aria-label={`${project.title} images`}>
                    {project.images.slice(0, 4).map((src, index) => (
                      <a href={src} target="_blank" rel="noopener noreferrer" key={src}>
                        <img src={src} alt={`${project.title} ${index + 1}`} />
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="about-classic-section">
            <header>
              <p className="blog-kicker">Competitions</p>
              <h2>대회</h2>
            </header>
            <div className="about-entry-list">
              {achievements.map((achievement) => (
                <article className="about-project-entry" key={achievement.title}>
                  <div className="about-entry-copy">
                    <p className="project-meta">
                      {achievement.location} · {achievement.dates}
                    </p>
                    <h3>{achievement.title}</h3>
                    <ul>
                      {achievement.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="project-image-strip" aria-label={`${achievement.title} images`}>
                    {achievement.images.slice(0, 4).map((src, index) => (
                      <a href={src} target="_blank" rel="noopener noreferrer" key={src}>
                        <img src={src} alt={`${achievement.title} ${index + 1}`} />
                      </a>
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
