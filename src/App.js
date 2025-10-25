// src/App.js
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import Entry from "./Entry";
import { FaEnvelope, FaGithub, FaSun, FaMoon } from "react-icons/fa";
import {
  SiPython, SiTensorflow, SiPytorch, SiNumpy, SiPandas, SiTypescript, 
  SiReact, SiPostgresql, SiDocker, SiGit, SiFastapi, SiNginx
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
      projects: "Projects",
      achievements: "Competitions",
      skills: "Skills",
      mainProjects: "Main Projects",
    },
  };

  // 섹션 펼침 상태
  const [expandedEntries, setExpandedEntries] = useState({
    education: {
      ibm: true,
    },
    projects: {
      lawI: true,
      transformer: true,
    },
    achievements: {
      quantum: true,
    },
  });
  const toggleEntry = (sec, key) =>
    setExpandedEntries((p) => ({
      ...p,
      [sec]: { ...p[sec], [key]: !p[sec][key] },
    }));

  // --- 교육
  const edu_ibm = {
    title:
      lang === "KOR" ? "[IBM x RedHat] AX Academy" : "[IBM x RedHat] AX Academy",
    location: lang === "KOR" ? "대한민국" : "Korea",
    dates: lang === "KOR" ? "2025.05 ~ 2025.11" : "2025.05 ~ 2025.11",
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

  // --- 프로젝트
  const pj_lawI = {
    title: lang === "KOR" ? "법률 도메인 특화 Agentic LLM 서비스" : "Agentic LLM Service for Legal Domain",
    location: "Side / Team",
    dates: lang === "KOR" ? "2025" : "2025",
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
    imageFolder: "lawai",
  };

  // --- 이미지 폴더에서 이미지 목록을 동적으로 가져오는 함수
  const getImagesFrom = (folderName) => {
    try {
      // require.context를 사용하여 public/images/{folderName} 내의 모든 이미지 파일을 가져옵니다.
      const requireContext = require.context('../public/images', true, /\.(png|jpe?g|svg|gif)$/);
      return requireContext.keys()
        .filter(path => path.startsWith(`./${folderName}/`))
        .map(path => `/images${path.substring(1)}`);
    } catch (error) {
      return []; // 폴더가 없거나 파일이 없는 경우 빈 배열 반환
    }
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
    imageFolder: "hackathon",
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
            { Icon: SiTypescript, label: "TypeScript" },
            { Icon: SiReact, label: "React" },
          ]},
          { title: "데이터/인프라", items: [
            { Icon: SiPostgresql, label: "PostgreSQL" },
            { Icon: SiDocker, label: "Docker" },
            { Icon: SiFastapi, label: "FastAPI" },
            { Icon: SiNginx, label: "Nginx" },
            { Icon: SiGit, label: "Git" },
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
            { Icon: SiTypescript, label: "TypeScript" },
            { Icon: SiReact, label: "React" },
          ]},
          { title: "Data/Infra", items: [
            { Icon: SiPostgresql, label: "PostgreSQL" },
            { Icon: SiDocker, label: "Docker" },
            { Icon: SiFastapi, label: "FastAPI" },
            { Icon: SiNginx, label: "Nginx" },
            { Icon: SiGit, label: "Git" },
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
          <a href="https://github.com/sunjoonk" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub size={28} style={{ margin: "0 12px" }} />
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

      {/* Projects */}
      <section className="Project-section">
        <h2>{t[lang].projects}</h2>
        <div className="section-content entry-list">
          <Entry
            title={pj_lawI.title}
            location={pj_lawI.location}
            dates={pj_lawI.dates}
            details={pj_lawI.details}
            images={getImagesFrom(pj_lawI.imageFolder)}
            isExpanded={expandedEntries.projects.lawI}
            onClick={() => toggleEntry("projects", "lawI")}
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
            images={getImagesFrom(awd_quantum.imageFolder)}
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
