// src/Entry.js
import React from "react";
import PdfPages from './PdfPages';

export default function Entry({
  title,
  location,
  dates,
  details = [],
  images = [],
  isExpanded = false,
  onClick = () => {},
}) {
  return (
    <article>
      <div className="entry-header" onClick={onClick}>
        <div>
          <h3 className="entry-title">{title}</h3>
          {(location || dates) && (
            <p className="entry-meta">
              {location}
              {location && dates ? " · " : ""}
              {dates}
            </p>
          )}
        </div>
        <span className={`arrow ${isExpanded ? "expanded" : ""}`}>▾</span>
      </div>

      {isExpanded && (
        <div className="entry-details">
          {Array.isArray(details) ? (
            <ul>
              {details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          ) : (
            details
          )}
          {images && images.length > 0 && (
            <div className="image-carousel">
              {images.map((src, index) => (
                src.toLowerCase().endsWith('.pdf') ? (
                  <PdfPages key={index} file={src} />
                ) : (
                  <a href={src} target="_blank" rel="noopener noreferrer" key={index}>
                    <img
                      src={src}
                      alt={`${title} ${index + 1}`}
                      className="carousel-image"
                    />
                  </a>
                )
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
