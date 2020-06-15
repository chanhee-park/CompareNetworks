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
    this.distMatrix = Network.getDistanceMatrix(this.matrix);
    // TODO: Laplacians Matrix & Normalized Laplacians Matrix
    this.stat = new StatProcessor.getStat(this);
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
      var nodeColumns = {};
      [].concat(_toConsumableArray(nodes)).forEach(function (node, i) {
        return nodeColumns[node] = i;
      });
      return nodeColumns;
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
    * Get Shortest Path lengths of All Node Pairs in a network
    * This is an implementation of Floyd–Warshall algorithm
    * @param {Network} network 
    * @returns {number[][]} Distance Matrix (2D array)
    */

  }, {
    key: 'getDistanceMatrix',
    value: function getDistanceMatrix(matrix) {
      var N = matrix.length;
      var dist = Util.copy(matrix);
      for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
          if (i != j && dist[i][j] == 0) {
            dist[i][j] = Infinity;
          }
        }
      }
      for (var k = 0; k < N; k++) {
        for (var _i = 0; _i < N; _i++) {
          for (var _j = 0; _j < N; _j++) {
            if (dist[_i][_j] > dist[_i][k] + dist[k][_j]) {
              dist[_i][_j] = dist[_i][k] + dist[k][_j];
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

  }, {
    key: 'getNetwrokFromCSV',
    value: function getNetwrokFromCSV(csv) {
      var lines = csv.split('\n');
      var nodes = new Set();
      var links = new Set();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var line = _step.value;

          var elems = line.split(',');
          var from = parseInt(elems[0]);
          var to = parseInt(elems[1]);
          if (isNaN(from + to)) continue;

          nodes.add(from).add(to);
          links.add(new Link(from, to));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return new Network(nodes, links);
    }
  }]);

  return Network;
}();

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