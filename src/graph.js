class Graph {
  constructor() {
    this._data = new Map();
    this.vertexParams = {};
  }

  addEdge(from, to) {
    this.addVertex(from);
    this.addVertex(to);
    let f = this._data.get(from);
    if (!f.has(to)) {
      f.add(to);
    }
  }

  hasVertex(id) {
    return this._data.has(id);
  }

  addVertex(id) {
    if (!this.hasVertex(id)) {
      this._data.set(id, new Set());
    }
  }

  addVertexParam(paramName, paramDefaultValue = undefined) {
    this.vertexParams[paramName] = new Map();
    let vp = this.vertexParams[paramName];
    for (let vertexId of this._data.keys()) {
      vp.set(vertexId, paramDefaultValue);
    }
  }

  setVertexParam(vertexId, paramName, paramValue) {
    if (this.vertexParams.hasOwnProperty(paramName)) {
      let vps = this.vertexParams[paramName];
      if (vps.has(vertexId)) {
        vps.set(vertexId, paramValue);
        return;
      }
    }
    throw new Error(
      `cannot set vertex param vertexId: ${vertexId}, paramName: ${paramName} , paramValue: ${paramValue}`
    );
  }

  getVertexParam(vertexId, paramName) {
    if (this.vertexParams.hasOwnProperty(paramName)) {
      let vps = this.vertexParams[paramName];
      if (vps.has(vertexId)) {
        return vps.get(vertexId);
      }
    }
    throw new Error(
      `cannot get vertex param vertexId: ${vertexId}, paramName: ${paramName}`
    );
  }

  clearVertexParams() {
    this.vertexParams = {};
  }

  getAllVertexes() {
    return [...this._data.keys()];
  }

  getVertexSubEdges(id) {
    return [...this._data.get(id).keys()];
  }

  slurpVertexToGraph(id, graph, allowedList) {
    graph.addVertex(id);
    this.getVertexSubEdges(id).forEach(sv => {
      if (allowedList.includes(sv)) {
        graph.addEdge(id, sv);
      }
    });
  }
}

module.exports = {
  Graph
};
