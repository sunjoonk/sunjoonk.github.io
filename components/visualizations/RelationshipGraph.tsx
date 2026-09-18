"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  const svg = useRef<SVGSVGElement>(null);
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
    if (element) zoomAnchor.current = {
      x: (element.scrollLeft + element.clientWidth / 2) / element.scrollWidth,
      y: (element.scrollTop + element.clientHeight / 2) / element.scrollHeight,
    };
    setZoom(Math.max(1, Math.min(3, next)));
  }

  function select(id: string) {
    setSelected(id);
    setHovered(null);
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
    <VisualFigure {...figure} controls={
      <div className={styles.controls}>
        <button type="button" disabled={!active} aria-pressed={local} onClick={() => { setLocal(!local); setHovered(null); }}>주변만 보기</button>
        <button type="button" disabled={!active} onClick={() => { setPositions(model.positions); setHovered(null); }}>배치 초기화</button>
      </div>
    }>
      {data.nodes.length === 0 ? <p className={styles.hint}>표시할 관계 데이터가 없습니다.</p> : <>
        <p className={styles.hint} id={hintId}>항목을 선택하면 설명이 나타납니다. 마우스로 드래그해 배치를 바꿀 수 있습니다. 키보드에서는 Tab으로 이동하고 Enter 또는 Space로 선택하며, 방향키로 위치를 조정합니다.</p>
        <div className={styles.zoomControls} role="group" aria-label="그래프 배율">
          <button type="button" aria-label="그래프 축소" aria-controls={viewportId} disabled={zoom === 1} onClick={() => changeZoom(zoom - 0.5)}>−</button>
          <output aria-live="polite" aria-label="현재 배율">{Math.round(zoom * 100)}%</output>
          <button type="button" aria-label="그래프 확대" aria-controls={viewportId} disabled={zoom === 3} onClick={() => changeZoom(zoom + 0.5)}>+</button>
          <button type="button" aria-controls={viewportId} disabled={zoom === 1} onClick={() => changeZoom(1)}>화면에 맞춤</button>
        </div>
        <div ref={viewport} id={viewportId} className={styles.viewport} role="region" tabIndex={0} aria-label={`${figure.title}. 확대 후 상하좌우로 스크롤하여 탐색할 수 있습니다.`}>
          <div className={styles.canvas} style={{ width: `${zoom * 100}%` }}>
          <svg ref={svg} viewBox="0 0 640 450" className={styles.graph} role="group" aria-label={description} aria-describedby={hintId}>
            <g aria-hidden="true">{visibleEdges.map(edge => {
              const a = positions[edge.source];
              const b = positions[edge.target];
              return <g key={edge.id}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={edge.source === highlighted || edge.target === highlighted ? styles.activeEdge : styles.edge} />
                {edge.label && <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} textAnchor="middle" className={styles.edgeLabel}>{edge.label}</text>}
              </g>;
            })}</g>
            {visibleNodes.map(node => {
              const degree = model.neighbors.get(node.id)!.size;
              const position = positions[node.id];
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
                <circle r={23} fill="transparent" />
                <circle className={styles.dot} r={sizeByDegree ? Math.min(18, 5 + degree) : 9} />
                <text y={29} textAnchor="middle">{node.label}</text>
              </g>;
            })}
          </svg>
          </div>
        </div>
        <p className={styles.mobileHint}>{zoom === 1 ? "전체 그래프입니다. + 버튼으로 확대하고, 항목을 탭해 설명을 읽어보세요." : "그래프를 상하좌우로 밀어 탐색하세요. ‘화면에 맞춤’을 누르면 전체가 보입니다."}</p>
        {active && <section className={styles.note} aria-label="선택한 항목 내용" aria-live="polite" aria-atomic="true">
          <h4>{active.label}</h4>
          {active.description && <p>{typeof active.description === "string" ? active.description : active.description.map((part, index) =>
            typeof part === "string" ? part : <button key={index} type="button" className={styles.wikilink} onClick={() => select(part.nodeId)} aria-label={`${model.nodesById.get(part.nodeId)!.label} 선택`}>{part.text}</button>
          )}</p>}
        </section>}
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
