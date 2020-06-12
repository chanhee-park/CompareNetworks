class Network {
  constructor(nodes, links) {
    this.nodes = typeof nodes !== 'undefined' ? nodes : new Set();
    this.links = typeof links !== 'undefined' ? links : new Set();
    this.nodeColumns = Network.getNodeColumns(nodes);
    this.matrix = Network.getMatrix(this.nodeColumns, this.links);
    this.distMatrix = Network.getDistanceMatrix(this.matrix)
    // TODO: Laplacians Matrix and Normalized Laplacians Matrix
    this.stat = new StatProcessor.getStat(this);
  }

  /**
   * 네트워크는 행렬 형태로도 저장됩니다. 
   * 각 노드가 몇 번째 column(row)를 사용할지 지정합니다. 
   * @param {*} nodes 
   */
  static getNodeColumns (nodes) {
    // 노드 id 별로 몇번째 행과 열을 사용할지 지정
    const nodeColumns = {};
    [...nodes].forEach((node, i) => nodeColumns[node] = i);
    return nodeColumns;
  }

  /**
   * 네트워크를 행렬 형태로 저장합니다. 
   * @param {*} nodeColumns 
   * @param {*} links 
   */
  static getMatrix (nodeColumns, links) {
    const N = Object.keys(nodeColumns).length;
    const matrix = [...Array(N)].map(e => Array(N).fill(0));
    links.forEach(link => {
      const fromIdx = nodeColumns[link.from];
      const toIdx = nodeColumns[link.to];
      matrix[fromIdx][toIdx] += 1;
      matrix[toIdx][fromIdx] += 1;
    });

    return matrix;
  }

  /**
 * Get Shortest Path lengths of All Node Pairs in a network
 * This is an implementation of Floyd–Warshall algorithm
 * @param {Network} network 
 * @returns {number[][]} Distance Matrix (2D array)
 */
  static getDistanceMatrix (matrix) {
    const N = matrix.length;
    const dist = Util.copy(matrix);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (i != j && dist[i][j] == 0) {
          dist[i][j] = Infinity;
        }
      }
    }
    for (let k = 0; k < N; k++) {
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          if (dist[i][j] > dist[i][k] + dist[k][j]) {
            dist[i][j] = dist[i][k] + dist[k][j]
          }
        }
      }
    }
    return dist;
  }

  /**
   * csv string 으로부터 네트워크를 생성합니다.  
   * @param {string} csv 네트워크를 생성할 데이터셋
   */
  static getNetwrokFromCSV (csv) {
    const lines = csv.split('\n');
    const nodes = new Set();
    const links = new Set();
    for (let line of lines) {
      const elems = line.split(',');
      const from = parseInt(elems[0]);
      const to = parseInt(elems[1]);
      if (isNaN(from + to)) continue;

      nodes.add(from).add(to);
      links.add(new Link(from, to));
    }

    return new Network(nodes, links);
  }
}

/**
 * @class Link
 * @param {number} fromId 
 * @param {number} toId 
 */
class Link {
  constructor(fromId, toId) {
    this.from = fromId;
    this.to = toId;
  }
}
