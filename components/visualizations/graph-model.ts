export type GraphPoint = { x: number; y: number };

export type GraphText = string | { text: string; nodeId: string };

export type RelationshipNode = {
  id: string;
  label: string;
  description?: string | readonly GraphText[];
  /** SVG coordinates in a 640 × 450 viewBox. Omit for a circular layout. */
  position?: GraphPoint;
};

/** An undirected relationship; source/target do not imply causation or direction. */
export type RelationshipEdge = { source: string; target: string; label?: string };

export type RelationshipGraphData = {
  nodes: readonly RelationshipNode[];
  edges: readonly RelationshipEdge[];
};

export function constrainPoint(point: GraphPoint): GraphPoint {
  return { x: Math.max(65, Math.min(575, point.x)), y: Math.max(32, Math.min(402, point.y)) };
}

/** Validate editorial data early instead of silently dropping broken relationships. */
export function createGraphModel(data: RelationshipGraphData) {
  const nodesById = new Map<string, RelationshipNode>();
  for (const node of data.nodes) {
    if (!node.id || nodesById.has(node.id)) throw new Error(`RelationshipGraph: duplicate or empty node id "${node.id}".`);
    if (node.position && (!Number.isFinite(node.position.x) || !Number.isFinite(node.position.y))) {
      throw new Error(`RelationshipGraph: invalid position for "${node.id}".`);
    }
    nodesById.set(node.id, node);
  }
  for (const node of data.nodes) {
    if (Array.isArray(node.description)) {
      for (const part of node.description) {
        if (typeof part !== "string" && !nodesById.has(part.nodeId)) {
          throw new Error(`RelationshipGraph: unknown description target "${part.nodeId}".`);
        }
      }
    }
  }
  const pairs = new Set<string>();
  const edges = data.edges.map(edge => {
    if (!nodesById.has(edge.source) || !nodesById.has(edge.target)) {
      throw new Error(`RelationshipGraph: unknown edge endpoint ${JSON.stringify(edge)}.`);
    }
    if (edge.source === edge.target) throw new Error("RelationshipGraph: self-links are not supported.");
    const id = JSON.stringify([edge.source, edge.target].sort());
    if (pairs.has(id)) throw new Error(`RelationshipGraph: duplicate relationship ${id}.`);
    pairs.add(id);
    return { ...edge, id };
  });
  const neighbors = new Map(data.nodes.map(node => [node.id, new Set<string>()]));
  for (const edge of edges) {
    neighbors.get(edge.source)!.add(edge.target);
    neighbors.get(edge.target)!.add(edge.source);
  }
  const positions = Object.fromEntries(data.nodes.map((node, index) => {
    const angle = (index / data.nodes.length) * 2 * Math.PI - Math.PI / 2;
    const fallback = data.nodes.length === 1 ? { x: 320, y: 225 } : { x: 320 + 230 * Math.cos(angle), y: 220 + 165 * Math.sin(angle) };
    return [node.id, constrainPoint(node.position ?? fallback)];
  }));
  return { nodesById, edges, neighbors, positions };
}
