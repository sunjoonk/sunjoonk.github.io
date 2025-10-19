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
  const [expanded, setExpanded] = useState({
    education: { expanded: true, entries: {} },
    experience: { expanded: true, entries: {} },
    projects: { expanded: false, entries: {} },
    achievements: { expanded: false, entries: {} },
    skills: { expanded: false },
  });
  const toggleSection = (sec) =>
    setExpanded((p) => ({ ...p, [sec]: { ...p[sec], expanded: !p[sec].expanded } }));
  const toggleEntry = (sec, key) =>
    setExpanded((p) => ({
      ...p,
      [sec]: { ...p[sec], entries: { ...p[sec].entries, [key]: !p[sec].entries[key] } },
    }));

  // --- 교육
  const edu_ibm = {
    title:
      lang === "KOR" ? "[IBM x RedHat] AX(AI Transformation) 과정" : "[IBM x RedHat] AX (AI Transformation) Course",
    location: lang === "KOR" ? "대한민국 (온/오프라인)" : "Korea (hybrid)",
    dates: lang === "KOR" ? "2024.05 ~ 현재" : "May 2024 – Present",
    details:
      lang === "KOR"
        ? [
            "LLM·RAG, 프롬프트 엔지니어링·에이전트 오케스트레이션 심화.",
            "TensorFlow/PyTorch로 DNN·CNN·RNN·NLP 실습, 실전 과제 수행.",
            "FastAPI·Docker·AWS로 서빙/배포 파이프라인 경험.",
          ]
        : [
            "Deep dive into LLM/RAG, prompt engineering, and agent orchestration.",
            "Hands-on DNN/CNN/RNN/NLP with TensorFlow/PyTorch.",
            "FastAPI/Docker/AWS for serving & deployment.",
          ],
  };

  // --- 경력
  const exp_example = {
    title: lang === "KOR" ? "회사명" : "Company Name",
    location: lang === "KOR" ? "직책" : "Position",
    dates: "YYYY.MM ~ YYYY.MM",
    details: lang === "KOR" ? ["경력에 대한 설명을 이곳에 작성하세요."] : ["Describe your experience here."],
  };

  // --- 프로젝트
  const pj_lawI = {
    title: lang === "KOR" ? "[Law-I] AI 법률 비서 (RAG + Multi-Agent)" : "[Law-I] Legal AI Assistant (RAG + Multi-Agent)",
    location: "Side / Team",
    dates: lang === "KOR" ? "2025 ~ 진행중" : "2025 – Ongoing",
    details:
      lang === "KOR"
        ? [
            "국가법령·판례 기반 RAG: 청킹 → 임베딩(bge-m3) → FAISS/Chroma.",
            "LangChain 에이전트(Search/Draft/Critic) + ‘검색 없는 생성 금지’ 가드레일.",
            "증거팩/인용 자동화, React UI, FastAPI + AWS 배포.",
          ]
        : [
            "RAG on statutes/caselaw: chunking → embeddings (bge-m3) → FAISS/Chroma.",
            "LangChain agents (Search/Draft/Critic) with guardrails.",
            "Evidence pack & citations, React UI, FastAPI + AWS.",
          ],
    images: ["/images/law-i-1.png", "/images/law-i-2.png"],
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
    images: ["/images/portfolio-1.png"],
  };

  // --- 수상
  const awd_quantum = {
    title:
      lang === "KOR"
        ? "K-Digital Training 해커톤"
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
    images: ["/images/hackathon-1.png", "/images/hackathon-2.png"],
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
        <h2 onClick={() => toggleSection("education")}>{t[lang].education}</h2>
        {expanded.education.expanded && (
          <div className="section-content">
            <Entry
              title={edu_ibm.title}
              location={edu_ibm.location}
              dates={edu_ibm.dates}
              details={edu_ibm.details}
              isExpanded={expanded.education.entries.ibm}
              onClick={() => toggleEntry("education", "ibm")}
            />
          </div>
        )}
      </section>

      {/* Experience */}
      <section className="Experience-section">
        <h2 onClick={() => toggleSection("experience")}>{t[lang].experience}</h2>
        {expanded.experience.expanded && (
          <div className="section-content">
            <Entry
              title={exp_example.title}
              location={exp_example.location}
              dates={exp_example.dates}
              details={exp_example.details}
              isExpanded={expanded.experience.entries.example}
              onClick={() => toggleEntry("experience", "example")}
            />
          </div>
        )}
      </section>

      {/* Projects */}
      <section className="Project-section">
        <h2 onClick={() => toggleSection("projects")}>{t[lang].projects}</h2>
        {expanded.projects.expanded && (
          <div className="section-content entry-list">
            <Entry
              title={pj_lawI.title}
              location={pj_lawI.location}
              dates={pj_lawI.dates}
              details={pj_lawI.details}
              images={pj_lawI.images}
              isExpanded={expanded.projects.entries.lawI}
              onClick={() => toggleEntry("projects", "lawI")}
            />
            <Entry
              title={pj_portfolio.title}
              location={pj_portfolio.location}
              dates={pj_portfolio.dates}
              details={pj_portfolio.details}
              images={pj_portfolio.images}
              isExpanded={expanded.projects.entries.portfolio}
              onClick={() => toggleEntry("projects", "portfolio")}
            />
          </div>
        )}
      </section>

      {/* Achievements */}
      <section className="Achievements-section">
        <h2 onClick={() => toggleSection("achievements")}>{t[lang].achievements}</h2>
        {expanded.achievements.expanded && (
          <div className="section-content">
            <Entry
              title={awd_quantum.title}
              location={awd_quantum.location}
              dates={awd_quantum.dates}
              details={awd_quantum.details}
              images={awd_quantum.images}
              isExpanded={expanded.achievements.entries.quantum}
              onClick={() => toggleEntry("achievements", "quantum")}
            />
          </div>
        )}
      </section>

      {/* Skills */}
      <section className="Skills-section">
        <h2 onClick={() => toggleSection("skills")}>{t[lang].skills}</h2>
        {expanded.skills.expanded && (
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
        )}
      </section>
    </div>
  );
}
