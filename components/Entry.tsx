import type { ReactNode } from "react";

type EntryProps = {
  title: string;
  location?: string;
  dates?: string;
  details?: string[] | ReactNode;
  images?: string[];
  isExpanded?: boolean;
  onClick?: () => void;
};

export default function Entry({
  title,
  location,
  dates,
  details = [],
  images = [],
  isExpanded = false,
  onClick = () => {},
}: EntryProps) {
  return (
    <article>
      <button className="entry-header" onClick={onClick} type="button">
        <span>
          <span className="entry-title">{title}</span>
          {(location || dates) && (
            <span className="entry-meta">
              {location}
              {location && dates ? " · " : ""}
              {dates}
            </span>
          )}
        </span>
        <span className={`arrow ${isExpanded ? "expanded" : ""}`}>▾</span>
      </button>

      {isExpanded && (
        <div className="entry-details">
          {Array.isArray(details) ? (
            <ul>
              {details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          ) : (
            details
          )}
          {images.length > 0 && (
            <div className="image-carousel">
              {images.map((src, index) =>
                src.toLowerCase().endsWith(".pdf") ? (
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={src}
                    className="carousel-image-placeholder"
                  >
                    PDF 보기
                  </a>
                ) : (
                  <a href={src} target="_blank" rel="noopener noreferrer" key={src}>
                    <img
                      src={src}
                      alt={`${title} ${index + 1}`}
                      className="carousel-image"
                    />
                  </a>
                )
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
