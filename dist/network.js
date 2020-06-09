var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Network = function () {
  function Network(nodes, links) {
    _classCallCheck(this, Network);

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


  _createClass(Network, null, [{
    key: 'getNodeColumns',
    value: function getNodeColumns(nodes) {
      // 노드 id 별로 몇번째 행과 열을 사용할지 지정
      var nodeColumn = {};
      [].concat(_toConsumableArray(nodes)).forEach(function (node, i) {
        return nodeColumn[node.id] = i;
      });
      return nodeColumn;
    }

    /**
     * 네트워크를 행렬 형태로 저장합니다. 
     * @param {*} nodeColumns 
     * @param {*} links 
     */

  }, {
    key: 'getMatrix',
    value: function getMatrix(nodeColumns, links) {
      var N = Object.keys(nodeColumns).length;
      var matrix = [].concat(_toConsumableArray(Array(N))).map(function (e) {
        return Array(N).fill(0);
      });

      links.forEach(function (link) {
        var fromIdx = nodeColumns[link.from];
        var toIdx = nodeColumns[link.to];
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

  }, {
    key: 'generateRandomGraph',
    value: function generateRandomGraph(numOfNodes, edgeProb) {
      // Set Nodes
      var nodes = new Set();
      for (var i = 0; i < numOfNodes; i++) {
        nodes.add(new Node(i));
      }
      // Set Links
      var links = new Set();
      for (var _i = 0; _i < numOfNodes - 1; _i++) {
        for (var j = _i + 1; j < numOfNodes; j++) {
          if (Math.random() <= edgeProb) {
            links.add(new Link(_i, j));
          }
        }
      }
      return new Network(nodes, links);
    }
  }, {
    key: 'generateCompleteGraph',
    value: function generateCompleteGraph(numberOfNodes) {
      return this.generateRandomGraph(numberOfNodes, 1);
    }
  }]);

  return Network;
}();

/**
 * @class Node
 * @param {number} id
 * @param {any} data
 */


var Node = function Node(id) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  _classCallCheck(this, Node);

  this.id = id;
  this.data = data;
};

/**
 * @class Link
 * @param {number} fromId 
 * @param {number} toId 
 */


var Link = function Link(fromId, toId) {
  _classCallCheck(this, Link);

  this.from = fromId;
  this.to = toId;
};

function getTestNetwork() {
  var nodes = new Set();
  var links = new Set();
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

var testNetwork = getTestNetwork();
console.log(testNetwork);