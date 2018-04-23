//https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm

const { Graph } = require("./graph");

function tarjanScc(g) {
  let index = 0;
  let stack = [];
  g.addVertexParam("index", undefined);
  g.addVertexParam("lowlink", undefined);
  g.addVertexParam("onStack", undefined);
  let sccs = [];

  g.getAllVertexes().forEach(v => {
    if (!g.getVertexParam(v, "index")) {
      scc(v);
    }
  });

  function scc(v) {
    g.setVertexParam(v, "index", index);
    g.setVertexParam(v, "lowlink", index);
    g.setVertexParam(v, "onStack", true);
    stack.push(v);
    index++;

    g.getVertexSubEdges(v).forEach(w => {
      if (!g.getVertexParam(w, "index")) {
        scc(w);
        g.setVertexParam(
          v,
          "lowlink",
          Math.min(
            g.getVertexParam(v, "lowlink"),
            g.getVertexParam(w, "lowlink")
          )
        );
      } else if (g.getVertexParam(w, "onStack")) {
        g.setVertexParam(
          v,
          "lowlink",
          Math.min(g.getVertexParam(v, "lowlink"), g.getVertexParam(w, "index"))
        );
      }
    });

    if (g.getVertexParam(v, "lowlink") === g.getVertexParam(v, "index")) {
      let w;
      let s = [];
      do {
        w = stack.pop();
        g.setVertexParam(w, "onStack", false);
        s.push(w);
      } while (w !== v);
      sccs.push(s);
    }
  }

  let sccsG = [];
  sccs.forEach(sccList => {
    let gr = new Graph();
    sccList.forEach(sv => {
      g.slurpVertexToGraph(sv, gr, sccList);
    });
    sccsG.push(gr);
  });

  g.clearVertexParams();

  return sccsG;
}

module.exports = {
  tarjanScc
};
