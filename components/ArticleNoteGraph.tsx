"use client";

import { useId, useRef, useState } from "react";
import styles from "./ArticleNoteGraph.module.css";

const notes = [
  { id: "payment", title: "결제 서비스", group: "service", x: 160, y: 148, body: "결제 요청을 처리한다. 토큰 검증은 [[인증 서비스]]에 요청하며, 실패한 요청은 [[재시도 정책]]을 따른다.", links: ["auth", "retry"] },
  { id: "order", title: "주문 서비스", group: "service", x: 490, y: 150, body: "주문 생성 전에 [[인증 서비스]]에서 토큰을 검증한다. 최근 지연 현상은 [[주문 장애 기록]]에 정리했다.", links: ["auth", "incident-b"] },
  { id: "auth", title: "인증 서비스", group: "service", x: 320, y: 246, body: "결제와 주문이 함께 사용하는 토큰 검증 서비스다. 외부 연결은 [[연결 풀 설정]]을 사용하고 변경은 [[인증 배포 기록]]에 남긴다.", links: ["pool", "deploy"] },
  { id: "incident-a", title: "결제 장애 기록", group: "incident", x: 90, y: 292, body: "결제 지연이 발생했다. [[결제 서비스]]의 오류 로그와 [[인증 서비스]] 응답을 확인했다. 원인은 아직 조사 중이며, 후속 논의는 [[장애 회고]]에 남겼다.", links: ["payment", "auth", "review"] },
  { id: "incident-b", title: "주문 장애 기록", group: "incident", x: 550, y: 292, body: "주문 요청의 응답 시간이 늘었다. [[인증 서비스]] 호출 구간을 조사했고 [[장애 회고]]에서 다른 장애와 비교하기로 했다.", links: ["auth", "review"] },
  { id: "pool", title: "연결 풀 설정", group: "operation", x: 245, y: 390, body: "동시 연결 수와 대기 시간을 관리하는 설정이다. 최근 변경은 [[인증 배포 기록]]에 있다. 변경 시점만으로 장애의 원인을 확정할 수는 없다.", links: ["deploy"] },
  { id: "deploy", title: "인증 배포 기록", group: "operation", x: 435, y: 380, body: "[[인증 서비스]]의 연결 설정을 변경했다. [[연결 풀 설정]]에 변경값을 기록했다. 실제 영향은 지표와 원문 로그로 확인해야 한다.", links: ["auth", "pool"] },
  { id: "retry", title: "재시도 정책", group: "operation", x: 225, y: 55, body: "타임아웃이 발생한 요청을 다시 보내는 기준이다. [[결제 서비스]]에 적용하며, 증폭된 요청이 있었는지는 별도 확인이 필요하다.", links: ["payment"] },
  { id: "review", title: "장애 회고", group: "incident", x: 418, y: 58, body: "[[결제 장애 기록]]과 [[주문 장애 기록]]을 함께 검토한다. 두 기록이 공통으로 언급한 인증 서비스를 다음 조사 대상으로 삼는다.", links: ["incident-a", "incident-b"] },
] as const;

type NoteId = typeof notes[number]["id"];
// Keep one undirected line for each linked pair of notes.
const edges = Array.from(new Set(notes.flatMap(note => note.links.map(link => [note.id, link].sort().join(":")))))
  .map(pair => pair.split(":").map(id => notes.find(note => note.id === id)!));

type Point = { x: number; y: number };
const initialPositions = Object.fromEntries(notes.map(note => [note.id, { x: note.x, y: note.y }])) as Record<NoteId, Point>;
const constrain = (point: Point) => ({ x: Math.max(65, Math.min(575, point.x)), y: Math.max(32, Math.min(402, point.y)) });

export function ArticleNoteGraph() {
  const titleId = useId();
  const hintId = useId();
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: NoteId; pointer: number; offset: Point; start: Point } | null>(null);
  const moved = useRef(false);
  const [positions, setPositions] = useState(initialPositions);
  const [selected, setSelected] = useState<NoteId>("auth");
  const [hovered, setHovered] = useState<NoteId | null>(null);
  const [dragging, setDragging] = useState<NoteId | null>(null);
  const [local, setLocal] = useState(false);
  const active = notes.find(note => note.id === selected)!;
  const neighborsOf = (id: NoteId) => new Set([id, ...edges.filter(edge => edge.some(note => note.id === id)).flatMap(edge => edge.map(note => note.id))]);
  const neighbors = neighborsOf(selected);
  const highlighted = hovered ?? selected;
  const lit = neighborsOf(highlighted);
  const visibleNotes = local ? notes.filter(note => neighbors.has(note.id)) : notes;
  const visibleEdges = local ? edges.filter(([a, b]) => a.id === selected || b.id === selected) : edges;

  function pointAt(clientX: number, clientY: number) {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return null;
    return new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
  }

  return (
    <figure id="note-graph" className={styles.figure} aria-labelledby={titleId}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <h3 id={titleId}>노트 그래프 <span>예시</span></h3>
          <div className={styles.controls}>
            <button type="button" aria-pressed={local} onClick={() => { setLocal(!local); setHovered(null); }}>주변만 보기</button>
            <button type="button" onClick={() => { setPositions(initialPositions); setHovered(null); }}>배치 초기화</button>
          </div>
        </header>
        <p className={styles.hint} id={hintId}>클릭해서 읽고, 드래그해서 옮겨보세요.</p>
        <div className={styles.viewport} role="region" aria-label="노트 관계 그래프. 좁은 화면에서는 좌우로 스크롤할 수 있습니다.">
          <svg ref={svg} viewBox="0 0 640 450" className={styles.graph} role="group" aria-label="장애 분석 노트 9개의 내부 링크 관계" aria-describedby={hintId}>
            <g aria-hidden="true">{visibleEdges.map(([a, b]) => <line key={`${a.id}-${b.id}`} x1={positions[a.id].x} y1={positions[a.id].y} x2={positions[b.id].x} y2={positions[b.id].y} className={a.id === highlighted || b.id === highlighted ? styles.activeEdge : styles.edge} />)}</g>
            {visibleNotes.map(note => {
              const degree = edges.filter(edge => edge.some(end => end.id === note.id)).length;
              const position = positions[note.id];
              return <g key={note.id} role="button" aria-label={`${note.title} 노트 선택 및 이동`} aria-pressed={note.id === selected}
                transform={`translate(${position.x}, ${position.y})`}
                className={`${styles.node} ${lit.has(note.id) ? "" : styles.dimmed} ${dragging === note.id ? styles.dragging : ""}`}
                onPointerEnter={() => { if (!drag.current) setHovered(note.id); }}
                onPointerLeave={() => { if (!drag.current) setHovered(null); }}
                onPointerDown={event => {
                  if (event.button !== 0 || drag.current) return;
                  const point = pointAt(event.clientX, event.clientY);
                  if (!point) return;
                  event.preventDefault();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  moved.current = false;
                  drag.current = { id: note.id, pointer: event.pointerId, start: {x: event.clientX, y: event.clientY}, offset: { x: position.x - point.x, y: position.y - point.y } };
                  setDragging(note.id);
                  setHovered(null);
                  setSelected(note.id);
                }}
                onPointerMove={event => {
                  const current = drag.current;
                  if (!current || current.pointer !== event.pointerId) return;
                  if (!moved.current && Math.hypot(event.clientX - current.start.x, event.clientY - current.start.y) < 3) return;
                  const point = pointAt(event.clientX, event.clientY);
                  if (!point) return;
                  moved.current = true;
                  setPositions(previous => ({ ...previous, [current.id]: constrain({ x: point.x + current.offset.x, y: point.y + current.offset.y }) }));
                }}
                onPointerUp={event => {
                  if (drag.current?.pointer !== event.pointerId) return;
                  drag.current = null;
                  setDragging(null);
                  setHovered(null);
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onPointerCancel={() => { drag.current = null; setDragging(null); setHovered(null); }}
                onLostPointerCapture={() => { drag.current = null; setDragging(null); }}
                onClick={() => { if (!moved.current) setSelected(note.id); }}
                >
                <title>{note.title} · 연결된 노트 {degree}개</title>
                <circle r={23} fill="transparent" />
                <circle className={styles.dot} r={5 + degree} />
                <text y={29} textAnchor="middle">{note.title}</text>
              </g>;
            })}
          </svg>
        </div>
        <p className={styles.mobileHint}>빈 공간을 좌우로 밀어 나머지 노트를 볼 수 있어요.</p>
        <section className={styles.note} aria-label="선택한 노트 내용" aria-live="polite" aria-atomic="true">
          <h4>{active.title}</h4>
          <p>{active.body.split(/(\[\[.*?\]\])/g).map((part, i) => {
            const target = notes.find(note => `[[${note.title}]]` === part);
            return target ? <button type="button" className={styles.wikilink} key={i} onClick={() => { setSelected(target.id); setHovered(null); }} aria-label={`${target.title} 노트로 이동`}>{part}</button> : part;
          })}</p>
        </section>
      </div>
      <figcaption className="article-media-caption"><span className="article-media-label">그림 1.</span><span>내부 링크로 연결한 가상의 장애 분석 노트. 점은 문서, 선은 참조이며 큰 점일수록 연결된 노트가 많다. 배치를 옮겨도 연결은 유지된다. 점 사이의 거리 자체가 의미 유사도나 인과관계를 뜻하지는 않는다.<span className="article-media-source">출처: 직접 제작 · 실제 보관함이나 자동 추출 결과가 아닌 설명용 데이터</span></span></figcaption>
    </figure>
  );
}
