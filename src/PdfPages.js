// src/PdfPages.js
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// PDF.js worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PdfPages({ file }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      loading={<div className="carousel-image-placeholder">Loading PDF...</div>}
      error={<div className="carousel-image-placeholder">Failed to load PDF.</div>}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <a href={file} target="_blank" rel="noopener noreferrer" key={`page_${index + 1}`} className="carousel-pdf-wrapper">
          <Page
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={160 * 1.5} // 이미지와 비슷한 너비로 조정
          />
        </a>
      ))}
    </Document>
  );
}