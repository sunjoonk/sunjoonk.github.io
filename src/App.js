// src/App.js
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import Entry from "./Entry";
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaSun, FaMoon } from "react-icons/fa";
import {
  SiPython, SiTensorflow, SiPytorch, SiNumpy, SiPandas,
  SiJavascript, SiTypescript, SiReact,
  SiPostgresql, SiDocker, SiGit, SiFigma
} from "react-icons/si";

/** 프로필 이미지: public/profile.jpg 가 있으면 노출, 없으면 자동 숨김 */
function ProfileAvatar() {
  const imgRef = useRef(null);
  return (
    <img
      ref={imgRef}
      src="/profile.jpg"
      alt="Profile"
      onError={() => imgRef.current && (imgRef.current.style.display = "none")}
      style={{
        width: 108, height: 108, borderRadius: "50%",
        objectFit: "cover", border: "1px solid #e5e7eb"
      }}
    />
  );
}

export default function App() {
  // ===== 테마 =====
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    // OS 설정 확인
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    // <html> 태그에 data-theme 속성 적용 및 localStorage에 저장
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);


  // ===== 언어 토글 =====
  const [lang, setLang] = useState("KOR"); // 'KOR' | 'ENG'
  const t = {
    KOR: {
      name: "김선준",
      title: "AI 엔지니어",
      tagline: "AI 기술로 현실의 문제를 해결하는 엔지니어",
      aboutTitle: "소개",
      aboutText:
        "IBM x RedHat의 AX(AI Transformation) 과정을 통해 AI 전문가로 성장하고 있습니다. 데이터 기반의 문제 해결 능력과 새로운 기술에 대한 빠른 학습 능력을 바탕으로, 복잡한 비즈니스 요구사항을 해결하는 AI 솔루션을 만들고 싶습니다.",
      education: "교육",
      experience: "경력",
      projects: "프로젝트",
      achievements: "대회",
      skills: "보유 기술",
      mainProjects: "주요 프로젝트",
    },
    ENG: {
      name: "Sunjoon Kim",
      title: "AI Engineer",
      tagline: "An engineer who solves real-world problems with AI technology.",
      aboutTitle: "About",
      aboutText:
        "Currently growing as an AI specialist through the AX (AI Transformation) course by IBM x RedHat. With strong data-driven problem-solving skills and a knack for quickly learning new technologies, I aim to create AI solutions that tackle complex business needs.",
      education: "Education",
      experience: "Experience",
      projects: "Projects",
      achievements: "Competitions",
      skills: "Skills",
      mainProjects: "Main Projects",
    },
  };

  // 섹션 펼침 상태
  const [expandedEntries, setExpandedEntries] = useState({
    education: {},
    experience: {},
    projects: {},
    achievements: {},
  });
  const toggleEntry = (sec, key) =>
    setExpandedEntries((p) => ({
      ...p,
      [sec]: { ...p[sec], [key]: !p[sec][key] },
    }));

  // --- 교육
  const edu_ibm = {
    title:
      lang === "KOR" ? "[IBM x RedHat] AX(AI Transformation)" : "[IBM x RedHat] AX (AI Transformation)",
    location: lang === "KOR" ? "대한민국" : "Korea",
    dates: lang === "KOR" ? "2024.05 ~ 현재" : "May 2024 – Present",
    details:
      lang === "KOR"
        ? [
            "TensorFlow/PyTorch로 DNN·CNN·RNN·NLP 실습 및 모델 아키텍처 구현",
            "API 또는 HuggingFace의 오픈소스 모델을 활용한 AI 어플리케이션 개발",
            "FastAPI, Docker, GitHub Actions, AWS를 활용한 CI/CD 파이프라인 구축 및 운영 경험",
          ]
        : [
            "Deep dive into LLM/RAG, prompt engineering, and agent orchestration.",
            "Hands-on DNN/CNN/RNN/NLP with TensorFlow/PyTorch.",
            "FastAPI/Docker/AWS for serving & deployment.",
          ],
  };

  // --- 경력
  const exp_example = [
    {
      title: lang === "KOR" ? "AIMMO" : "AIMMO",
      location: lang === "KOR" ? "프로젝트 리더" : "Project Leader",
      dates: "2023.04 ~ 2025.03",
      summary: lang === "KOR" ? 
        [
          "자율주행 및 AI 학습 데이터 솔루션 기업에서 프로젝트 리더(PL) 역할을 수행했습니다.",
          "고객 요구사항 분석, 데이터 확보 계획 수립, 리스크 관리, AI 데이터 가공 인력 교육 및 관리를 총괄했습니다."
        ] : 
        [
          "Served as a Project Leader (PL) at a company specializing in autonomous driving and AI training data solutions.",
          "Oversaw project planning based on customer requirements, risk management, and the training and management of the AI data processing team."
        ],
      projects: [
        {
          title: lang === "KOR" ? "현대 모비스 (2D Image B-Box & Segmentation)" : "Hyundai Mobis (2D Image B-Box & Segmentation)",
          dates: "2023.07 ~ 2024.12",
          details: lang === "KOR" ? 
            [
              "Python을 활용하여 데이터 유효성을 검사하는 규칙을 직접 작성하고 적용했습니다.",
              "프로젝트의 데이터 가공 기준을 새롭게 수립하고 팀 인력 관리를 담당했습니다."
            ] : 
            [
              "Developed and applied data validation rules using Python.",
              "Established new data processing standards for the project and was in charge of team management."
            ],
        },
        {
          title: lang === "KOR" ? "우아한 형제들 (3D Cuboid Box Annotation)" : "Woowa Brothers (3D Cuboid Box Annotation)",
          dates: "2024.12 ~ 2025.02",
          details: lang === "KOR" ?
            [
              "자율주행 배달 로봇의 학습 데이터 확보 계획을 수립했습니다.",
              "2D 이미지와 3D LiDAR 포인트 데이터를 융합하는 고난도 프로젝트를 리딩했습니다."
            ] :
            [
              "Established the data acquisition plan for an autonomous delivery robot's training data.",
              "Led a complex project involving the fusion of 2D images and 3D LiDAR point data."
            ],
        },
        {
          title: lang === "KOR" ? "한화시스템 (3D Cuboid Box Annotation)" : "Hanwha Systems (3D Cuboid Box Annotation)",
          dates: "2025.02 ~ 2025.03",
          details: lang === "KOR" ?
            [
              "2D 이미지와 3D LiDAR 데이터 동기화를 위해 Python 기반 포인트 투영(Point Projection) 프로그램을 직접 제작했습니다."
            ] :
            [
              "Contributed to the project by creating a Python-based Point Projection program to synchronize 2D image and 3D LiDAR data."
            ],
        },
        {
          title: lang === "KOR" ? "Mitsubishi Electric (2D Image Segmentation)" : "Mitsubishi Electric (2D Image Segmentation)",
          dates: "2023.05 ~ 2023.07",
          details: lang === "KOR" ?
            [
              "프로젝트 기술 검증(POC) 초기 단계부터 참여하여 데이터 가공 기준을 확립하고 인력 관리를 수행했습니다."
            ] :
            [
              "Participated from the initial Proof of Concept (POC) stage to establish data processing standards and perform personnel management."
            ],
        },
        {
          title: lang === "KOR" ? "워터인포랜스 (2D Image Segmentation)" : "Waterinforlance (2D Image Segmentation)",
          dates: "2023.04 ~ 2023.04",
          details: lang === "KOR" ?
            [
              "납품 완료된 데이터에 대해 고객사의 변경된 요구사항을 반영하여 데이터 유지보수를 성공적으로 수행했습니다."
            ] :
            [
              "Successfully performed data maintenance by reflecting the client's changed requirements for the delivered data."
            ],
        },
      ]
    },
  ];

  // --- 프로젝트
  const pj_lawI = {
    title: lang === "KOR" ? "법률 도메인 특화 Agentic LLM 서비스" : "Agentic LLM Service for Legal Domain",
    location: "Side / Team",
    dates: lang === "KOR" ? "2025 ~ 진행중" : "2025.09 – 2025.10",
    details:
      lang === "KOR"
        ? [
            "RAG 파이프라인 설계: Llama-3-8B 모델과 RAG를 결합하여 법률 질의응답 성능을 최적화하고, 법령·판례 텍스트를 도메인 구조에 맞게 정제·청킹하여 검색 정확도를 향상시켰습니다.",
            "Agentic 아키텍처 구축: LangChain 기반 에이전트 오케스트레이션으로 Retrieval, 추론, 문서 작성 등 모듈을 유연하게 조율하고, 동적 툴 라우팅을 구현했습니다.",
            "데이터베이스 및 배포: ChromaDB를 활용한 Vector DB와 PostgreSQL(RDBMS)을 구축했으며, GitHub Actions와 AWS EC2를 통해 CI/CD 파이프라인을 자동화하고 서비스를 배포했습니다.",
          ]
        : [
            "Designed RAG Pipeline: Optimized legal Q&A performance by combining the Llama-3-8B model with RAG, and improved search accuracy by refining and chunking legal texts.",
            "Built Agentic Architecture: Orchestrated modules like Retrieval, Reasoning, and Drafting using LangChain, and implemented dynamic tool routing.",
            "Database & Deployment: Established a Vector DB with ChromaDB and a PostgreSQL RDBMS. Automated the CI/CD pipeline and deployed the service using GitHub Actions and AWS EC2.",
          ],
    images: ["/images/lawai.png"],
  };

  const pj_portfolio = {
    title: lang === "KOR" ? "개인 포트폴리오 웹사이트" : "Personal Portfolio Website",
    location: "개인",
    dates: "2024",
    details:
      lang === "KOR"
        ? [
            "React와 CSS를 사용하여 포트폴리오 웹사이트를 디자인하고 개발했습니다.",
            "GitHub Actions를 사용하여 GitHub Pages에 자동 배포 파이프라인을 구축했습니다.",
            "다크 모드, 다국어 지원 등 사용자 경험을 향상시키는 기능을 구현했습니다.",
          ]
        : [
            "Designed and developed a portfolio website using React and CSS.",
            "Built an automated deployment pipeline to GitHub Pages using GitHub Actions.",
            "Implemented features to enhance user experience, such as dark mode and multi-language support.",
          ],
    images: [],
  };

  const pj_transformer = {
    title: lang === "KOR" ? "Transformer 아키텍처를 활용한 번역 모델 학습" : "Training a Translation Model using Transformer Architecture",
    location: "개인",
    dates: "2024",
    details:
      lang === "KOR"
        ? [
            "PyTorch를 사용하여 'Attention Is All You Need' 논문에 기반한 Transformer 모델을 직접 구현하고, 기계 번역 태스크에 적용했습니다.",
            "인코더-디코더 구조 내에서 Multi-Head Self-Attention과 Positional Encoding의 역할을 깊이 있게 이해하고 구현하여 모델의 성능을 최적화했습니다.",
            "IWSLT 2017 (DE-EN) 데이터셋을 활용하여 모델을 학습시키고, BLEU 점수를 통해 번역 품질을 정량적으로 평가했습니다."
          ]
        : [
            "Implemented a Transformer model from scratch using PyTorch, based on the 'Attention Is All You Need' paper, and applied it to a machine translation task.",
            "Optimized model performance by deeply understanding and implementing Multi-Head Self-Attention and Positional Encoding within the encoder-decoder structure.",
            "Trained the model on the IWSLT 2017 (DE-EN) dataset and quantitatively evaluated translation quality using BLEU score."
          ],
    images: ['/files/transformer-slides.pdf'],
  };

  // --- 수상
  const awd_quantum = {
    title:
      lang === "KOR"
        ? "K-Digital Training 해커톤 - SinkSafe"
        : "K-Digital Training Hackathon",
    location: lang === "KOR" ? "주최: 직업능력심사평가원" : "Korea Skills Quality Authority",
    dates: "2025",
    details:
      lang === "KOR"
        ? [
            "인공위성 InSAR 데이터와 YOLOv12 모델을 활용한 싱크홀 위험지역 탐지.",
            "React를 활용하여 위험지역 시각화 웹 서비스 제작.",
          ]
        : [
            "Sinkhole Risk Area Detection using Satellite InSAR Data and the YOLOv12 Model.",
            "Developing a Web Service for Hazard Area Visualization using React.",
          ],
    images: ["/images/hackathon.png"],
  };

  // --- 스킬
  const skills =
    lang === "KOR"
      ? [
          { title: "AI / ML", items: [
            { Icon: SiPython, label: "Python" },
            { Icon: SiTensorflow, label: "TensorFlow" },
            { Icon: SiPytorch, label: "PyTorch" },
            { Icon: SiNumpy, label: "NumPy" },
            { Icon: SiPandas, label: "Pandas" },
          ]},
          { title: "프론트엔드", items: [
            { Icon: SiJavascript, label: "JavaScript" },
            { Icon: SiTypescript, label: "TypeScript" },
            { Icon: SiReact, label: "React" },
          ]},
          { title: "데이터/인프라", items: [
            { Icon: SiPostgresql, label: "PostgreSQL" },
            { Icon: SiDocker, label: "Docker" },
            { Icon: SiGit, label: "Git" },
            { Icon: SiFigma, label: "Figma" },
          ]},
        ]
      : [
          { title: "AI / ML", items: [
            { Icon: SiPython, label: "Python" },
            { Icon: SiTensorflow, label: "TensorFlow" },
            { Icon: SiPytorch, label: "PyTorch" },
            { Icon: SiNumpy, label: "NumPy" },
            { Icon: SiPandas, label: "Pandas" },
          ]},
          { title: "Frontend", items: [
            { Icon: SiJavascript, label: "JavaScript" },
            { Icon: SiTypescript, label: "TypeScript" },
            { Icon: SiReact, label: "React" },
          ]},
          { title: "Data/Infra", items: [
            { Icon: SiPostgresql, label: "PostgreSQL" },
            { Icon: SiDocker, label: "Docker" },
            { Icon: SiGit, label: "Git" },
            { Icon: SiFigma, label: "Figma" },
          ]},
        ];

  // ===== UI =====
  return (
    <div className="App">
      {/* 헤더 */}
      <header className="App-header">
        <div className="header-top">
          <div className="header-left">
            <ProfileAvatar />
            <div>
              <h1>{t[lang].name}</h1>
              <div className="header-subtitle">{t[lang].title}</div>
            </div>
          </div>
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'light' ? (
              <FaMoon size={20} />
            ) : (
              <FaSun size={20} />
            )}
          </button>
        </div>

        {/* 언어 토글 */}
        <div className="lang-toggle" aria-label="Language toggle" style={{ margin: "10px 0 16px" }}>
          <div
            className="lang-indicator"
            style={{ transform: `translateX(${lang === "ENG" ? "0" : "100%"})` }}
          />
          <button className={`lang-btn ${lang === "ENG" ? "active" : ""}`} onClick={() => setLang("ENG")}>
            ENG
          </button>
          <button className={`lang-btn ${lang === "KOR" ? "active" : ""}`} onClick={() => setLang("KOR")}>
            KOR
          </button>
        </div>

        {/* 연락처 */}
        <div className="contact-icons">
          <a href="mailto:sunjoon.dev@gmail.com" aria-label="Email">
            <FaEnvelope size={28} style={{ margin: "0 12px" }} />
          </a>
          <a href="tel:010-6537-0433" aria-label="Phone">
            <FaPhone size={28} style={{ margin: "0 12px" }} />
          </a>
          <a href="https://github.com/sunjoonk" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub size={28} style={{ margin: "0 12px" }} />
          </a>
          <a href="https://www.linkedin.com/in/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin size={28} style={{ margin: "0 12px" }} />
          </a>
        </div>
      </header>

      {/* About */}
      <section className="About-section">
        <h2>{t[lang].aboutTitle}</h2>
        <p>{t[lang].aboutText}</p>
      </section>

      {/* Education */}
      <section className="Education-section">
        <h2>{t[lang].education}</h2>
        <div className="section-content">
          <Entry
            title={edu_ibm.title}
            location={edu_ibm.location}
            dates={edu_ibm.dates}
            details={edu_ibm.details}
            isExpanded={expandedEntries.education.ibm}
            onClick={() => toggleEntry("education", "ibm")}
          />
        </div>
      </section>

      {/* Experience */}
      <section className="Experience-section">
        <h2>{t[lang].experience}</h2>
        <div className="section-content entry-list">
          {exp_example.map((exp, index) => (
            <Entry
              key={index}
              title={exp.title}
              location={exp.location}
              dates={exp.dates}
              isExpanded={expandedEntries.experience[`exp${index}`]}
              onClick={() => toggleEntry("experience", `exp${index}`)}
              details={
                <>
                  <ul>
                    {exp.summary.map((item, i) => <li key={`s-${i}`}>{item}</li>)}
                  </ul>
                  <div className="project-list">
                    {exp.projects.map((proj, pIndex) => (
                      <div key={pIndex} className="project-item">
                        <div className="project-title">{proj.title} <span className="project-dates">({proj.dates})</span></div>
                        <ul>{proj.details.map((d, i) => <li key={`p-${i}`}>{d}</li>)}</ul>
                      </div>
                    ))}
                  </div>
                </>
              }
            />
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="Project-section">
        <h2>{t[lang].projects}</h2>
        <div className="section-content entry-list">
          <Entry
            title={pj_lawI.title}
            location={pj_lawI.location}
            dates={pj_lawI.dates}
            details={pj_lawI.details}
            images={pj_lawI.images}
            isExpanded={expandedEntries.projects.lawI}
            onClick={() => toggleEntry("projects", "lawI")}
          />
          <Entry
            title={pj_portfolio.title}
            location={pj_portfolio.location}
            dates={pj_portfolio.dates}
            details={pj_portfolio.details}
            images={pj_portfolio.images}
            isExpanded={expandedEntries.projects.portfolio}
            onClick={() => toggleEntry("projects", "portfolio")}
          />
          <Entry
            title={pj_transformer.title}
            location={pj_transformer.location}
            dates={pj_transformer.dates}
            details={pj_transformer.details}
            images={pj_transformer.images}
            isExpanded={expandedEntries.projects.transformer}
            onClick={() => toggleEntry("projects", "transformer")}
          />
        </div>
      </section>

      {/* Achievements */}
      <section className="Achievements-section">
        <h2>{t[lang].achievements}</h2>
        <div className="section-content">
          <Entry
            title={awd_quantum.title}
            location={awd_quantum.location}
            dates={awd_quantum.dates}
            details={awd_quantum.details}
            images={awd_quantum.images}
            isExpanded={expandedEntries.achievements.quantum}
            onClick={() => toggleEntry("achievements", "quantum")}
          />
        </div>
      </section>

      {/* Skills */}
      <section className="Skills-section">
        <h2>{t[lang].skills}</h2>
        <div className="section-content">
          <div className="skills-grid">
            {skills.map((g, i) => (
              <div className="skill-card" key={i}>
                <div className="skill-title">{g.title}</div>
                <div className="skill-items-wrap">
                  {g.items.map((it, idx) => (
                    <div className="skill-item" key={idx}>
                      <span className="skill-icon"><it.Icon size={18} /></span>
                      <span className="skill-label">{it.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
