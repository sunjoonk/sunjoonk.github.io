"use client";

import { useId, type ReactNode } from "react";
import styles from "./VisualFigure.module.css";

export type VisualFigureProps = {
  id?: string;
  title: string;
  badge?: string;
  number?: number;
  caption: string;
  source?: string;
  sourceHref?: string;
  children: ReactNode;
  controls?: ReactNode;
};

/** Shared editorial frame for graphs and future visual explanations. */
export function VisualFigure({ id, title, badge, number, caption, source, sourceHref, children, controls }: VisualFigureProps) {
  const titleId = useId();
  const captionId = useId();
  return (
    <figure id={id} className={styles.figure} aria-labelledby={titleId} aria-describedby={captionId}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <h3 id={titleId}>{title}{badge && <span>{badge}</span>}</h3>
          {controls}
        </header>
        {children}
      </div>
      <figcaption id={captionId} className="article-media-caption">
        {number !== undefined && <span className="article-media-label">그림 {number}.</span>}
        <span>{caption}{source && <span className="article-media-source">출처: {sourceHref ? <a href={sourceHref}>{source}</a> : source}</span>}</span>
      </figcaption>
    </figure>
  );
}
