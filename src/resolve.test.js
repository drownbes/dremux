const { Graph } = require('./graph');
const { graphResolve } = require('./resolve');

const logStr = [];

const simulateTask = (id, deps) => new Promise((resolve,reject) => {
  setTimeout(() => {
    if(deps) {
      logStr.push(`resolved ${id} with deps: ${[...deps.keys()]}`);
    } else {
      logStr.push(`resolved ${id}`);
    }

    resolve(`resolved ${id}`);
  }, 0);
});

describe('resolve', () => {
  test('graphResolve', async () => {
    const g = new Graph();
    g.addEdge(0, 3);
    g.addEdge(0, 6);
    g.addEdge(1, 3);
    g.addEdge(2, 3);
    g.addEdge(2, 4);
    g.addEdge(3, 5);


    await graphResolve(g, simulateTask).then(r => {
      logStr.push(r);
      expect(logStr).toMatchSnapshot();
    })

  });


})