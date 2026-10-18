"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  code: string;
  language?: string;
  filename?: string;
  kind?: "code" | "output";
};

const languageNames: Record<string, string> = {
  js: "JavaScript", ts: "TypeScript", jsx: "JSX", tsx: "TSX",
  bash: "Shell", sh: "Shell", json: "JSON", mdx: "MDX",
  css: "CSS", html: "HTML", python: "Python", text: "텍스트",
};

export default function ArticleCode({ code, language = "text", filename, kind = "code" }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [copying, setCopying] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    setCopying(true);
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      // Keep the text selectable when clipboard access is unavailable.
      setStatus("failed");
      codeRef.current?.focus();
      const selection = window.getSelection();
      if (selection && codeRef.current) {
        const range = document.createRange();
        range.selectNodeContents(codeRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } finally {
      setCopying(false);
      timer.current = setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return (
    <div className="article-code" data-kind={kind}>
      <div className="article-code-toolbar">
        <span className="article-code-label">
          {filename && <span className="article-code-filename">{filename}</span>}
          <span>{kind === "output" ? "실행 결과" : languageNames[language] ?? language}</span>
        </span>
        <button type="button" onClick={copy} disabled={copying}
          aria-label={`${filename ?? (kind === "output" ? "실행 결과" : languageNames[language] ?? language)} 복사`}>
          {status === "copied" ? "복사 완료" : "복사"}
        </button>
      </div>
      <pre tabIndex={0} aria-label={filename ?? (kind === "output" ? "실행 결과" : `${languageNames[language] ?? language} 예제`)}>
        <code ref={codeRef} tabIndex={-1} className={`language-${language}`}>{code}</code>
      </pre>
      <span className={status === "failed" ? "article-code-feedback" : "article-code-status"} role="status">
        {status === "copied" ? "클립보드에 복사했습니다." : status === "failed" ? "복사 권한이 없어 텍스트를 선택했습니다. Ctrl+C 또는 ⌘C로 복사하세요." : ""}
      </span>
    </div>
  );
}
