const { Graph } = require('./graph');
const { tarjanScc } = require('./scc');

describe('scc', () => {

  test('scc tests', () => {
    const g = new Graph();
    g.addEdge(0, 1);
    g.addEdge(0, 6);
    g.addEdge(1, 2);
    g.addEdge(1, 5);
    g.addEdge(2, 3);
    g.addEdge(3, 4);
    g.addEdge(4, 2);
    g.addEdge(5, 0);

    const res = tarjanScc(g);
    expect(res).toMatchSnapshot();

  });
});
