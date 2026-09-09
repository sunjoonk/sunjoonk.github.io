"use client";

import { createContext, useContext, useState, ViewTransition, type ReactNode } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Origin = { slug: string; slot: string };
type ArchiveView = "list" | "cards";
const OriginContext = createContext<{
  origin: Origin | null;
  select: (origin: Origin) => void;
  archiveView: ArchiveView;
  setArchiveView: (view: ArchiveView) => void;
}>({ origin: null, select: () => {}, archiveView: "list", setArchiveView: () => {} });

export function PostTransitionProvider({ children }: { children: ReactNode }) {
  const [origin, select] = useState<Origin | null>(null);
  // Keep the layout in the persistent provider so back navigation restores it
  // before React captures the destination title and restores scroll position.
  const [archiveView, setArchiveView] = useState<ArchiveView>("list");
  return <OriginContext.Provider value={{ origin, select, archiveView, setArchiveView }}>{children}</OriginContext.Provider>;
}

export function useArchiveView() {
  const { archiveView, setArchiveView } = useContext(OriginContext);
  return { archiveView, setArchiveView };
}

export function PostLink({ slug, slot, children }: Origin & { children: ReactNode }) {
  const { select } = useContext(OriginContext);
  return (
    <Link href={`/posts/${slug}`} prefetch onNavigate={() => {
      // Commit the clicked occurrence before Next captures the outgoing page.
      flushSync(() => select({ slug, slot }));
    }}>
      {children}
    </Link>
  );
}

export function PostTitle({ slug, slot, children }: { slug: string; slot?: string; children: ReactNode }) {
  const { origin } = useContext(OriginContext);
  const selectedSlot = origin?.slug === slug ? origin.slot : "archive";
  return (
    <ViewTransition name={`post-title-${slug}-${slot ?? selectedSlot}`} share="post-title-morph" default="none">
      {children}
    </ViewTransition>
  );
}

export function ArticleReveal({ children }: { children: ReactNode }) {
  return <ViewTransition enter="article-reveal" exit="article-exit" default="none">{children}</ViewTransition>;
}

export function PostBackLink({ slug, children }: { slug: string; children: ReactNode }) {
  const { origin } = useContext(OriginContext);
  const router = useRouter();
  return <Link href="/" onNavigate={(event) => {
    if (origin?.slug === slug) {
      event.preventDefault();
      router.back();
    }
  }}>{children}</Link>;
}
