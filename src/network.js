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
    const N = nodes.size;
    const matrix = [...Array(N)].map(e => Array(N).fill(0));

    links.forEach(link => {
      const fromIdx = nid2idx[link.from];
      const toIdx = nid2idx[link.to];
      matrix[fromIdx][toIdx] += 1;
      matrix[toIdx][fromIdx] += 1;
    });

    return matrix;
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
