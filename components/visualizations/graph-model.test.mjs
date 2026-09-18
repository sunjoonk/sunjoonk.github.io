import assert from "node:assert/strict";
import test from "node:test";
import { createGraphModel, constrainPoint } from "./graph-model.ts";

test("relationships are symmetric and preserve editorial labels", () => {
  const model = createGraphModel({
    nodes: [{ id: "a", label: "A" }, { id: "b", label: "B" }, { id: "isolated", label: "Isolated" }],
    edges: [{ source: "a", target: "b", label: "참조" }],
  });
  assert.deepEqual([...model.neighbors.get("a")], ["b"]);
  assert.deepEqual([...model.neighbors.get("b")], ["a"]);
  assert.equal(model.neighbors.get("isolated").size, 0);
  assert.equal(model.edges[0].label, "참조");
});

test("empty, single-node, and partially positioned graphs have valid layouts", () => {
  assert.deepEqual(createGraphModel({ nodes: [], edges: [] }).positions, {});
  assert.deepEqual(createGraphModel({ nodes: [{ id: "a", label: "A" }], edges: [] }).positions.a, { x: 320, y: 225 });
  const data = { nodes: [{ id: "a", label: "A", position: { x: 90, y: 292 } }, { id: "b", label: "B" }], edges: [] };
  const model = createGraphModel(data);
  assert.deepEqual(model.positions.a, data.nodes[0].position);
  assert.deepEqual(model.positions, createGraphModel(data).positions);
  assert.deepEqual(constrainPoint({ x: -100, y: 900 }), { x: 65, y: 402 });
  assert.ok(Number.isFinite(model.positions.b.x));
});

test("invalid editorial references fail with actionable errors", () => {
  const nodes = [{ id: "a", label: "A" }, { id: "b", label: "B" }];
  assert.throws(() => createGraphModel({ nodes: [nodes[0], nodes[0]], edges: [] }), /duplicate or empty node/);
  assert.throws(() => createGraphModel({ nodes, edges: [{ source: "a", target: "missing" }] }), /unknown edge endpoint/);
  assert.throws(() => createGraphModel({ nodes, edges: [{ source: "a", target: "a" }] }), /self-links/);
  assert.throws(() => createGraphModel({ nodes, edges: [{ source: "a", target: "b" }, { source: "b", target: "a" }] }), /duplicate relationship/);
  assert.throws(() => createGraphModel({ nodes: [{ ...nodes[0], description: [{ text: "Broken", nodeId: "missing" }] }], edges: [] }), /unknown description target/);
  assert.throws(() => createGraphModel({ nodes: [{ ...nodes[0], position: { x: NaN, y: 0 } }], edges: [] }), /invalid position/);
});

test("IDs containing delimiters do not collide or break object lookup", () => {
  const nodes = ["a:b", "c", "a", "b:c", "__proto__"].map(id => ({ id, label: id }));
  const model = createGraphModel({ nodes, edges: [{ source: "a:b", target: "c" }, { source: "a", target: "b:c" }] });
  assert.notEqual(model.edges[0].id, model.edges[1].id);
  assert.ok(Object.hasOwn(model.positions, "__proto__"));
});
