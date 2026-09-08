"use client";

import { useEffect, useId, useRef, useState } from "react";

type CaptionProps = {
  /** Number within this article; images and videos have separate sequences. */
  number: number;
  caption: string;
  source?: string;
  sourceHref?: string;
};

function MediaCaption({ kind, number, caption, source, sourceHref, id }: CaptionProps & {
  kind: "그림" | "영상";
  id?: string;
}) {
  return (
    <figcaption className="article-media-caption" id={id}>
      <span className="article-media-label">{kind} {number}.</span>
      <span>
        {caption}
        {source && (
          <span className="article-media-source">
            출처: {sourceHref ? <a href={sourceHref}>{source}</a> : source}
          </span>
        )}
      </span>
    </figcaption>
  );
}

type ImageProps = CaptionProps & {
  src: string;
  alt: string;
  /** Supply the original dimensions to reserve space without cropping. */
  width: number;
  height: number;
};

export function ArticleImage({ src, alt, width, height, ...caption }: ImageProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const captionId = useId();
  const titleId = useId();

  useEffect(() => {
    setFailed(false);
  }, [src]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  function expand() {
    if (!dialog.current || failed) return;
    dialog.current.showModal();
    setOpen(true);
  }

  return (
    <figure className="article-media">
      <button
        ref={trigger}
        className="article-image-trigger"
        type="button"
        aria-label={`그림 ${caption.number} 확대 보기: ${alt}`}
        aria-describedby={captionId}
        aria-haspopup="dialog"
        disabled={failed}
        onClick={expand}
      >
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" onError={() => setFailed(true)} />
        {!failed && <span className="article-image-hint">확대 보기 ↗</span>}
      </button>
      {failed && <p className="article-media-error" role="status">이미지를 불러오지 못했습니다.</p>}
      <MediaCaption {...caption} kind="그림" id={captionId} />
      <dialog
        ref={dialog}
        className="article-lightbox"
        aria-labelledby={titleId}
        onClose={() => { setOpen(false); trigger.current?.focus(); }}
        onClick={(event) => {
          // The padded content covers the dialog; only the backdrop targets it.
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="article-lightbox-content">
          <div className="article-lightbox-bar">
            <span id={titleId}>그림 {caption.number}. {caption.caption}</span>
            <button type="button" autoFocus onClick={() => dialog.current?.close()}>닫기 ×</button>
          </div>
          {open && <img src={src} alt={alt} width={width} height={height} />}
          <p className="article-lightbox-alt">{alt}</p>
        </div>
      </dialog>
    </figure>
  );
}

type VideoProps = CaptionProps & {
  src: string;
  poster?: string;
  width: number;
  height: number;
  /** WebVTT subtitles for speech, separate from the figure caption. */
  captionsSrc?: string;
  captionsLanguage?: string;
  captionsLabel?: string;
};

export function ArticleVideo({
  src, poster, width, height, captionsSrc, captionsLanguage = "ko",
  captionsLabel = "한국어", ...caption
}: VideoProps) {
  const captionId = useId();
  return (
    <figure className="article-media">
      <video
        className="article-video"
        src={src}
        poster={poster}
        width={width}
        height={height}
        controls
        playsInline
        preload="metadata"
        aria-label={`영상 ${caption.number}. ${caption.caption}`}
        aria-describedby={captionId}
      >
        {captionsSrc && <track kind="captions" src={captionsSrc} srcLang={captionsLanguage} label={captionsLabel} default />}
        브라우저에서 동영상을 재생할 수 없습니다.
      </video>
      <MediaCaption {...caption} kind="영상" id={captionId} />
      <a className="article-video-original" href={src}>동영상 파일 열기 ↗</a>
    </figure>
  );
}
