"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { VisualFigure, type VisualFigureProps } from "./VisualFigure";
import { constrainPoint, createGraphModel, type GraphPoint, type RelationshipGraphData } from "./graph-model";
import styles from "./RelationshipGraph.module.css";

export type RelationshipGraphProps = Omit<VisualFigureProps, "children" | "controls"> & {
  data: RelationshipGraphData;
  /** A concise text description of what the graph represents. */
  description: string;
  defaultSelectedId?: string;
  /** Opt in only when connection count is meaningful; explain it in the caption. */
  sizeByDegree?: boolean;
};

export function RelationshipGraph(props: RelationshipGraphProps) {
  // Reset interactive state when the actual dataset changes, not on parent renders.
  return <GraphView key={JSON.stringify([props.data, props.defaultSelectedId])} {...props} />;
}

function GraphView({ data, description, defaultSelectedId, sizeByDegree = false, ...figure }: RelationshipGraphProps) {
  const model = useMemo(() => createGraphModel(data), [data]);
  const hintId = useId();
  const viewportId = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const zoomAnchor = useRef<GraphPoint | null>(null);
  const [zoom, setZoom] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(640);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setViewportWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const svg = useRef<SVGSVGElement>(null);
  const noteTitle = useRef<HTMLHeadingElement>(null);
  const drag = useRef<{ id: string; pointer: number; offset: GraphPoint; start: GraphPoint } | null>(null);
  const moved = useRef(false);
  const [positions, setPositions] = useState(model.positions);
  const [selected, setSelected] = useState(defaultSelectedId && model.nodesById.has(defaultSelectedId) ? defaultSelectedId : data.nodes[0]?.id);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [local, setLocal] = useState(false);
  const active = selected === undefined ? undefined : model.nodesById.get(selected);
  const highlighted = hovered ?? selected;
  const neighbors = selected === undefined ? undefined : model.neighbors.get(selected);
  const lit = highlighted === undefined ? undefined : model.neighbors.get(highlighted);
  const visibleNodes = local ? data.nodes.filter(node => node.id === selected || neighbors?.has(node.id)) : data.nodes;
  const visibleEdges = local ? model.edges.filter(edge => edge.source === selected || edge.target === selected) : model.edges;

  const scale = Math.max(0.1, viewportWidth * zoom / 640);
  const labelSize = 13 / scale;
  const labelPositions = useMemo(() => {
    // Keep labels in screen pixels; reveal lower-priority labels as space permits.
    const placed: { left: number; right: number; top: number; bottom: number }[] = [];
    const result = new Map<string, { x: number; y: number }>();
    const priority = (id: string) => id === highlighted ? 0 : id === selected ? 1 : neighbors?.has(id) ? 2 : 3;
    const candidates = [...visibleNodes].sort((a, b) => priority(a.id) - priority(b.id));
    for (const node of candidates) {
      if (viewportWidth < 600 && zoom === 1 && priority(node.id) === 3) continue;
      const width = Array.from(node.label).reduce((sum, char) => sum + (/[^\x00-\xff]/.test(char) ? 13 : 7), 0) / scale;
      const half = width / 2;
      const position = positions[node.id];
      const x = Math.max(half + 4 / scale, Math.min(640 - half - 4 / scale, position.x));
      const y = Math.min(450 - 6 / scale, position.y + 25 / scale);
      const box = { left: x - half - 4 / scale, right: x + half + 4 / scale, top: y - 14 / scale, bottom: y + 3 / scale };
      if (priority(node.id) > 1 && placed.some(other => box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top)) continue;
      placed.push(box);
      result.set(node.id, { x: x - position.x, y: y - position.y });
    }
    return result;
  }, [visibleNodes, positions, highlighted, selected, neighbors, viewportWidth, zoom, scale]);

  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element) return;
    if (zoom === 1) {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    } else if (zoomAnchor.current) {
      element.scrollLeft = zoomAnchor.current.x * element.scrollWidth - element.clientWidth / 2;
      element.scrollTop = zoomAnchor.current.y * element.scrollHeight - element.clientHeight / 2;
    }
    zoomAnchor.current = null;
  }, [zoom]);

  function changeZoom(next: number) {
    const element = viewport.current;
    if (element) zoomAnchor.current = next > zoom && selected ? {
      x: positions[selected].x / 640,
      y: positions[selected].y / 450,
    } : {
      x: (element.scrollLeft + element.clientWidth / 2) / element.scrollWidth,
      y: (element.scrollTop + element.clientHeight / 2) / element.scrollHeight,
    };
    setZoom(Math.max(1, Math.min(3, next)));
  }

  function select(id: string, fromDetails = false) {
    setSelected(id);
    setHovered(null);
    if (zoom > 1 && viewport.current && !drag.current) {
      const element = viewport.current;
      element.scrollTo(positions[id].x / 640 * element.scrollWidth - element.clientWidth / 2,
        positions[id].y / 450 * element.scrollHeight - element.clientHeight / 2);
    }
    // Detail links are replaced on selection; keep keyboard focus in the updated panel.
    if (fromDetails) requestAnimationFrame(() => noteTitle.current?.focus({ preventScroll: true }));
  }

  function endDrag() {
    drag.current = null;
    setDragging(null);
    setHovered(null);
  }

  function pointAt(clientX: number, clientY: number) {
    const matrix = svg.current?.getScreenCTM();
    return matrix ? new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse()) : null;
  }

  return (
    <VisualFigure {...figure} controls={<span className={styles.stats}>{data.nodes.length}개 항목 · {model.edges.length}개 관계</span>}>
      {data.nodes.length === 0 ? <p className={styles.hint}>표시할 관계 데이터가 없습니다.</p> : <>
        <p className={styles.hint} id={hintId}>항목을 선택하면 연결과 설명을 볼 수 있습니다.</p>
        <div className={styles.toolbar}>
          <div className={styles.segments} role="group" aria-label="관계 표시 범위">
            <button type="button" aria-pressed={!local} onClick={() => { setLocal(false); setHovered(null); }}>전체 관계</button>
            <button type="button" aria-pressed={local} onClick={() => { setLocal(true); setHovered(null); }}>선택 항목 주변</button>
          </div>
          <div className={styles.zoomControls} role="group" aria-label="그래프 배율">
            <div className={styles.zoomStepper}>
              <button type="button" aria-label="그래프 축소" aria-controls={viewportId} disabled={zoom === 1} onClick={() => changeZoom(zoom - 0.5)}>−</button>
              <output aria-live="polite" aria-label="현재 배율">{Math.round(zoom * 100)}%</output>
              <button type="button" aria-label="그래프 확대" aria-controls={viewportId} disabled={zoom === 3} onClick={() => changeZoom(zoom + 0.5)}>+</button>
            </div>
            <button type="button" className={styles.fitButton} aria-controls={viewportId} onClick={() => { changeZoom(1); setLocal(false); setHovered(null); if (viewport.current) viewport.current.scrollTo(0, 0); }}>전체 보기</button>
          </div>
        </div>
        <div ref={viewport} id={viewportId} className={styles.viewport} role="region" tabIndex={0} aria-label={`${figure.title}. 확대 후 상하좌우로 스크롤하여 탐색할 수 있습니다.`}>
          <div className={styles.canvas} style={{ width: `${zoom * 100}%` }}>
          <svg ref={svg} viewBox="0 0 640 450" className={styles.graph} role="group" aria-label={description} aria-describedby={hintId}>
            <g aria-hidden="true">{visibleEdges.map(edge => {
              const a = positions[edge.source];
              const b = positions[edge.target];
              return <g key={edge.id}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke" className={edge.source === selected || edge.target === selected ? styles.activeEdge : styles.edge} />
                {edge.label && <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} textAnchor="middle" style={{ fontSize: 11 / scale }} className={styles.edgeLabel}>{edge.label}</text>}
              </g>;
            })}</g>
            {visibleNodes.map(node => {
              const degree = model.neighbors.get(node.id)!.size;
              const position = positions[node.id];
              const label = labelPositions.get(node.id);
              const radius = sizeByDegree ? Math.min(18, 5 + degree) : 9;
              return <g key={node.id} role="button" tabIndex={0} aria-label={`${node.label}, 연결 ${degree}개`} aria-pressed={node.id === selected}
                transform={`translate(${position.x}, ${position.y})`}
                className={`${styles.node} ${node.id === highlighted || lit?.has(node.id) ? "" : styles.dimmed} ${dragging === node.id ? styles.dragging : ""}`}
                onFocus={() => setHovered(node.id)}
                onBlur={() => setHovered(null)}
                onKeyDown={event => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    select(node.id);
                  }
                  const delta = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }[event.key];
                  if (delta) {
                    event.preventDefault();
                    setPositions(previous => ({ ...previous, [node.id]: constrainPoint({ x: previous[node.id].x + delta[0], y: previous[node.id].y + delta[1] }) }));
                  }
                }}
                onPointerEnter={() => { if (!drag.current) setHovered(node.id); }}
                onPointerLeave={() => { if (!drag.current) setHovered(null); }}
                onPointerDown={event => {
                  // On touch screens, leave swipes to native scrolling; taps still select.
                  if (event.pointerType === "touch") { moved.current = false; return; }
                  if (event.button !== 0 || drag.current) return;
                  const point = pointAt(event.clientX, event.clientY);
                  if (!point) return;
                  event.preventDefault();
                  event.currentTarget.focus();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  moved.current = false;
                  drag.current = { id: node.id, pointer: event.pointerId, start: { x: event.clientX, y: event.clientY }, offset: { x: position.x - point.x, y: position.y - point.y } };
                  setDragging(node.id);
                  select(node.id);
                }}
                onPointerMove={event => {
                  const current = drag.current;
                  if (!current || current.pointer !== event.pointerId) return;
                  if (!moved.current && Math.hypot(event.clientX - current.start.x, event.clientY - current.start.y) < 3) return;
                  const point = pointAt(event.clientX, event.clientY);
                  if (!point) return;
                  moved.current = true;
                  setPositions(previous => ({ ...previous, [current.id]: constrainPoint({ x: point.x + current.offset.x, y: point.y + current.offset.y }) }));
                }}
                onPointerUp={event => {
                  if (drag.current?.pointer !== event.pointerId) return;
                  endDrag();
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onPointerCancel={endDrag}
                onLostPointerCapture={endDrag}
                onClick={() => { if (!moved.current) select(node.id); }}
              >
                <title>{`${node.label} · 연결 ${degree}개`}</title>
                <circle r={Math.max(radius + 5, 22 / scale)} fill="transparent" />
                <circle className={styles.selectionRing} r={radius + 5 / scale} vectorEffect="non-scaling-stroke" />
                <circle className={styles.dot} r={radius} />
                {label && <text x={label.x} y={label.y} style={{ fontSize: labelSize }} textAnchor="middle">{node.label}</text>}
              </g>;
            })}
          </svg>
          </div>
        </div>
        <div className={styles.graphFooter}>
          <div className={styles.legend} aria-label="그래프 범례">
            <span><i className={styles.legendDot} aria-hidden="true" />항목</span>
            <span><i className={styles.legendLine} aria-hidden="true" />관계</span>
            <span><i className={styles.legendRing} aria-hidden="true" />선택</span>
            {sizeByDegree && <span>큰 점 = 연결이 많음</span>}
          </div>
          <p className={styles.mobileHint}>{zoom === 1 ? "확대하면 더 많은 이름을 볼 수 있어요." : "상하좌우로 밀어 탐색 · 전체 보기로 복귀"}</p>
        </div>
        {active && <section className={styles.note} aria-label="선택한 항목 내용">
          <div aria-live="polite" aria-atomic="true">
            <span className={styles.eyebrow}>선택한 항목</span>
            <div className={styles.noteHeading}><h4 ref={noteTitle} tabIndex={-1}>{active.label}</h4><span>연결 {neighbors?.size ?? 0}개</span></div>
            {active.description && <p>{typeof active.description === "string" ? active.description : active.description.map((part, index) => typeof part === "string" ? part : <button key={index} type="button" className={styles.inlineLink} onClick={() => select(part.nodeId, true)}>{part.text.replace(/^\[\[|\]\]$/g, "")}</button>)}</p>}
          </div>
          <div className={styles.related} role="group" aria-label="연결된 항목">
            {Array.from(neighbors ?? []).map(id => <button key={id} type="button" onClick={() => select(id, true)}>{model.nodesById.get(id)!.label}<span aria-hidden="true">→</span></button>)}
            {!neighbors?.size && <span className={styles.hint}>연결된 항목이 없습니다.</span>}
          </div>
        </section>}
        <div className={styles.secondary}>
          <details className={styles.help}>
            <summary>사용 방법</summary>
            <p>터치: 항목을 탭해 선택하고, 확대 후 밀어서 탐색합니다. 마우스: 항목을 클릭하거나 드래그해 배치를 바꿉니다. 키보드: Tab으로 이동하고 Enter·Space로 선택하며, 방향키로 위치를 조정합니다.</p>
            <p>확대는 선택한 항목을 중심으로 합니다. 전체 보기는 배율·필터·스크롤을 복원하고, 배치 초기화는 항목의 위치만 복원합니다. 공간이 부족한 이름은 생략되며, 아래 텍스트 목록에서 모든 항목을 선택할 수 있습니다.</p>
          </details>
          <button type="button" onClick={() => { setPositions(model.positions); setHovered(null); }}>배치 초기화</button>
        </div>
        <details className={styles.list}>
          <summary>전체 항목과 관계를 텍스트로 보기</summary>
          <ul>{data.nodes.map(node => <li key={node.id}>
            <button type="button" className={styles.wikilink} aria-pressed={selected === node.id} onClick={() => select(node.id)}>{node.label}</button>
            {node.description && <span> — {typeof node.description === "string" ? node.description : node.description.map(part => typeof part === "string" ? part : part.text).join("")}</span>}
            <ul>{model.edges.filter(edge => edge.source === node.id || edge.target === node.id).map(edge => {
              const other = edge.source === node.id ? edge.target : edge.source;
              return <li key={edge.id}>{edge.label ?? "연결"}: {model.nodesById.get(other)!.label}</li>;
            })}</ul>
            {model.neighbors.get(node.id)!.size === 0 && <span> · 연결 없음</span>}
          </li>)}</ul>
        </details>
      </>}
    </VisualFigure>
  );
}
