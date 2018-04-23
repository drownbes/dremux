const { Graph } = require('./graph');
const { tarjanScc } = require('./scc');


function createSubGraph(startVertex, g) {
  const ng = new Graph();
  g.getAllVertexes().forEach(v => {
    if(parseInt(v) >= parseInt(startVertex)) {
      ng.addVertex(v);
      g.getVertexSubEdges(v).forEach(sv => {
        if(parseInt(sv) >= parseInt(startVertex)) {
          ng.addEdge(v, sv);
        }
      });
    }
  });
  return ng;
}

function leastIndexScc(sccs, subGraph) {
  let min = Number.MAX_VALUE;
  let minScc = undefined;

  sccs.forEach(sccG => {
    if(sccG.getAllVertexes().length > 1) {
      sccG.getAllVertexes().forEach(sv => {
        if(parseInt(sv) < min) {
          min = sv;
          minScc = sccG;
        }
      });
    }
  });

  if(!minScc) return undefined;

  const graphScc = new Graph();
  const sccVertexes = minScc.getAllVertexes();
  subGraph.getAllVertexes().forEach(v => {
    if(sccVertexes.includes(v)) {
      subGraph.getVertexSubEdges(v).forEach(sv => {
        if(sccVertexes.includes(sv)) {
          graphScc.addEdge(v, sv);
        }
      });
    }
  });
  graphScc.minVertex = min;
  return graphScc;
}



function simpleCycles(g) {
  let stack = [];
  let blockedMap = new Map();
  let blockedSet = new Set();
  let allCycles = [];
  let startIndex = 0;

  while(startIndex < g.getAllVertexes().length) {
    let subGraph = createSubGraph(startIndex, g);
    let sccs = tarjanScc(subGraph);
    let leastScc = leastIndexScc(sccs, subGraph);
    if(leastScc) {
      blockedSet.clear();
      blockedMap.clear();
      findCyclesInSCG(leastScc.minVertex, leastScc.minVertex, leastScc);
      startIndex = parseInt(leastScc.minVertex) + 1;
    } else {
      break;
    }
  }

  function findCyclesInSCG(startVertex, currentVertex, graph) {
    let foundCycle = false;
    stack.push(currentVertex);
    blockedSet.add(currentVertex);

    graph.getVertexSubEdges(currentVertex).forEach(neighbor => {
      if(neighbor === startVertex) {
        const cycle = stack.concat([startVertex]);
        allCycles.push(cycle);
        foundCycle = true
      } else if(!blockedSet.has(neighbor)) {
        let gotCycle = findCyclesInSCG(startVertex, neighbor, graph);
        foundCycle = foundCycle || gotCycle;
      }
    });

    if(foundCycle) {
      unblock(currentVertex);
    } else {
        graph.getVertexSubEdges(currentVertex).forEach(w => {
          blockedMap.set(w, currentVertex);
        });
      }

    stack.pop();
    return foundCycle;
  }

  function unblock(u) {
    blockedSet.delete(u)
    if(blockedMap.has(u)) {
      blockedMap.forEach((v) => {
        if(blockedSet.has(v)) {
          unblock(v);
        }
      });
      blockedMap.delete(u);
    }
  }

  return allCycles;
}






module.exports = {
  createSubGraph,
  leastIndexScc,
  simpleCycles
}