"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

type Theme = "light" | "dark";

function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = getCurrentTheme() === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // The theme still applies for this session when storage is unavailable.
    }
    setTheme(nextTheme);
  };

  const nextThemeLabel = theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환";

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={nextThemeLabel}
      title={nextThemeLabel}
    >
      <FaMoon className="theme-icon theme-icon-moon" aria-hidden="true" />
      <FaSun className="theme-icon theme-icon-sun" aria-hidden="true" />
    </button>
  );
}
