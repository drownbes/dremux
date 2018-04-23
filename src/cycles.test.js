const { Graph } = require('./graph');
const { createSubGraph, leastIndexScc, simpleCycles } = require('./cycles');
const { tarjanScc } = require('./scc');

describe('cycles', () => {


  test('createSubGraph', () => {
    const g = new Graph();

    g.addEdge(0, 1);
    g.addEdge(1, 2);
    g.addEdge(2, 3);
    g.addEdge(3, 1);

    expect(createSubGraph(1, g)).toMatchSnapshot();
    expect(createSubGraph(2, g)).toMatchSnapshot();

  });

  test('leastIndexScc', () => {
    const g = new Graph();

    g.addEdge(0, 1);
    g.addEdge(1, 2);
    g.addEdge(2, 3);
    g.addEdge(3, 1);

    let sccs = tarjanScc(g);

    let ls = leastIndexScc(sccs, g);
    expect(ls).toMatchSnapshot();

  });

  test('simpleCycles', ()=> {
    const graph = new Graph();

    graph.addEdge(1, 2);
    graph.addEdge(1, 8);
    graph.addEdge(1, 5);
    graph.addEdge(2, 9);
    graph.addEdge(2, 7);
    graph.addEdge(2, 3);
    graph.addEdge(3, 1);
    graph.addEdge(3, 2);
    graph.addEdge(3, 6);
    graph.addEdge(3, 4);
    graph.addEdge(6, 4);
    graph.addEdge(4, 5);
    graph.addEdge(5, 2);
    graph.addEdge(8, 9);
    graph.addEdge(9, 8);

    expect(
      simpleCycles(graph)
    ).toMatchSnapshot();

  });

  test('simpleCycles', ()=> {
    const g = new Graph();

    g.addEdge(0, 1);
    g.addEdge(1, 2);
    g.addEdge(2, 3);
    g.addEdge(3, 1);
    g.addEdge(3, 4);
    g.addEdge(4, 5);
    g.addEdge(5, 3);

    expect(
      simpleCycles(g)
    ).toMatchSnapshot();

  });



});