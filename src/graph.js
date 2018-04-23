class Graph {
  constructor() {
    this._data = {};
    this.vertexParams = {};
  }

  addEdge(from, to) {
    this.addVertex(from + "");
    this.addVertex(to + "");

    if (!this._data[from+""].includes(to+"")) {
      this._data[from+""].push(to+"");
    }
  }

  hasVertex(id) {
    return this._data.hasOwnProperty(id);
  }

  addVertex(id) {
    if (!this.hasVertex(id+"")) {
      this._data[id+""] = [];
    }
  }

  addVertexParam(paramName, paramDefaultValue=undefined) {
    this.vertexParams[paramName] = {};
    let vp = this.vertexParams[paramName];
    Object.keys(this._data).forEach((vertexId) => {
      vp[vertexId] = paramDefaultValue;
    });
  }

  setVertexParam(vertexId, paramName, paramValue) {
    if(this.vertexParams.hasOwnProperty(paramName)) {
      let vps = this.vertexParams[paramName];
      if(vps.hasOwnProperty(vertexId)) {
        vps[vertexId] = paramValue;
        return;
      }
    }
    throw new Error(`cannot set vertex param vertexId: ${vertexId}, paramName: ${paramName} , paramValue: ${paramValue}`);
  }

  getVertexParam(vertexId, paramName) {
    if(this.vertexParams.hasOwnProperty(paramName)) {
      let vps = this.vertexParams[paramName];
      if(vps.hasOwnProperty(vertexId)) {
        return vps[vertexId];
      }
    }
    throw new Error(`cannot get vertex param vertexId: ${vertexId}, paramName: ${paramName}`);
  }

  clearVertexParams() {
    this.vertexParams = {};
  }

  getAllVertexes() {
    return Object.keys(this._data);
  }

  getVertexSubEdges(id) {
    return this._data[id+""];
  }

  slurpVertexToGraph(id, graph, allowedList) {
    graph.addVertex(id+"");
    this.getVertexSubEdges(id).forEach(sv => {
      if(allowedList.includes(sv)) {
        graph.addEdge(id, sv);
      }
    });
  }

}

module.exports = {
  Graph
}