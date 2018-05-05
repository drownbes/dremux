const { Graph } = require("./graph");

describe("graph", () => {
  test("graph add edge", () => {
    const g = new Graph();
    expect(g._data).toEqual(new Map());

    g.addEdge(0, 1);
    g.addEdge(1, 2);
    g.addEdge(2, 3);
    g.addEdge(3, 1);

    let expected = new Map();
    expected.set(0, new Set([1]));
    expected.set(1, new Set([2]));
    expected.set(2, new Set([3]));
    expected.set(3, new Set([1]));
    expect(g._data).toEqual(expected);

    g.addEdge(3, 1);
    expect(g._data).toEqual(expected);

    g.addEdge(0, 3);
    expected = new Map();
    expected.set(0, new Set([1, 3]));
    expected.set(1, new Set([2]));
    expected.set(2, new Set([3]));
    expected.set(3, new Set([1]));
    expect(g._data).toEqual(expected);

    expect(g.size()).toEqual(4);
    expect([...g.vertexKeysIter()]).toEqual([0,1,2,3]);
  });

  test("graph add vertex param", () => {
    const g = new Graph();
    g._data = new Map([
      [0, new Set([1])],
      [1, new Set([2])],
      [2, new Set([3])],
      [3, new Set([1])]
    ]);

    g.addVertexParam("index", undefined);

    expect(g.vertexParams).toEqual({
      index: new Map([
        [0, undefined],
        [1, undefined],
        [2, undefined],
        [3, undefined]
      ])
    });

    g.setVertexParam(0, "index", 5);
    g.setVertexParam(2, "index", 9);

    expect(g.vertexParams).toEqual({
      index: new Map([[0, 5], [1, undefined], [2, 9], [3, undefined]])
    });

    expect(g.getVertexParam(0, "index")).toEqual(5);
    expect(g.getVertexParam(2, "index")).toEqual(9);
    expect(g.getVertexParam.bind(g, 10, "index")).toThrowError(
      "cannot get vertex param"
    );
    expect(g.getVertexParam.bind(g, 10, "wrongParam")).toThrowError(
      "cannot get vertex param"
    );

    expect(g.setVertexParam.bind(g, 10, "index", 15)).toThrowError(
      "cannot set vertex param"
    );

    expect(g.setVertexParam.bind(g, 10, "wrongParam", 15)).toThrowError(
      "cannot set vertex param"
    );

    g.clearVertexParams();
    expect(g.vertexParams).toEqual({});

    expect(g.getAllVertexes()).toEqual([0, 1, 2, 3]);

    expect(g.getVertexSubEdges(0)).toEqual([1]);

    const newGraph = new Graph();

    g.slurpVertexToGraph(0, newGraph, [0, 1]);
    expect(newGraph._data).toEqual(
      new Map([[0, new Set([1])], [1, new Set()]])
    );

    g.slurpVertexToGraph(1, newGraph, [0, 1]);
    expect(newGraph._data).toEqual(
      new Map([[0, new Set([1])], [1, new Set()]])
    );
  });
});
