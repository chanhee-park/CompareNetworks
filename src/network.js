class Network {
  constructor(nodes, links) {
    this.nodes = typeof nodes !== 'undefined' ? nodes : new Set();
    this.links = typeof links !== 'undefined' ? links : new Set();
    this.nodeColumns = Network.getNodeColumns(nodes);
    this.matrix = Network.getMatrix(this.nodeColumns, this.links);
  }

  /**
   * 네트워크는 행렬 형태로도 저장됩니다. 
   * 각 노드가 몇 번째 column(row)를 사용할지 지정합니다. 
   * @param {*} nodes 
   */
  static getNodeColumns (nodes) {
    // 노드 id 별로 몇번째 행과 열을 사용할지 지정
    const nodeColumn = {};
    [...nodes].forEach((node, i) => nodeColumn[node.id] = i);
    return nodeColumn;
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
   * 랜덤 그래프를 생성합니다.
   * @param {*} numOfNodes 노드의 수
   * @param {number} edgeProb 두 노드 사이에 엣지가 있을 확률 (0 <= P <= 1)
   * {
   *    const randomGraphs = [];
   *    const N = [25, 50, 75, 100];
   *    const P = [0.05, 0.10, 0.15, 1];
   *    for (let n of N) {
   *      for (let p of P) {
   *        randomGraphs.push(Network.generateRandomGraph(n, p));
   *       }
   *    }
   *  }
   */
  static generateRandomGraph (numOfNodes, edgeProb) {
    // Set Nodes
    const nodes = new Set();
    for (let i = 0; i < numOfNodes; i++) {
      nodes.add(new Node(i));
    }
    // Set Links
    const links = new Set();
    for (let i = 0; i < numOfNodes - 1; i++) {
      for (let j = i + 1; j < numOfNodes; j++) {
        if (Math.random() <= edgeProb) {
          links.add(new Link(i, j));
        }
      }
    }
    return new Network(nodes, links);
  }

  static generateCompleteGraph (numberOfNodes) {
    return this.generateRandomGraph(numberOfNodes, 1);
  }

}

/**
 * @class Node
 * @param {number} id
 * @param {any} data
 */
class Node {
  constructor(id, data = undefined) {
    this.id = id;
    this.data = data
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

function getTestNetwork () {
  const nodes = new Set();
  const links = new Set();
  nodes.add(new Node(0));
  nodes.add(new Node(3));
  nodes.add(new Node(5));
  nodes.add(new Node(10));
  nodes.add(new Node(13));
  links.add(new Link(0, 3));
  links.add(new Link(0, 5));
  links.add(new Link(3, 10));
  links.add(new Link(5, 10));
  links.add(new Link(5, 13));
  links.add(new Link(10, 13));
  return new Network(nodes, links);
}

const testNetwork = getTestNetwork();
console.log(testNetwork);
