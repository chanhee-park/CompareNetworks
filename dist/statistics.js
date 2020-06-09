var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 네트워크 통계치를 계산하고 저장한다.
 * 통계치 목록 참고
 * (wiki) https://en.wikipedia.org/wiki/Network_science
 * (web) http://networkrepository.com/
 * (paper) ManyNets (2010 CHI - Visualization)
 */
var Stat = function () {
  function Stat(network) {
    _classCallCheck(this, Stat);

    // Nodes, Edges, Density
    this.N = network.nodes.size;
    this.E = network.links.size;
    this.D = this.E / (this.N * (this.N - 1) / 2);

    // Degree - Histogram, min, max, avg
    this.degrees = Stat.getDegreeHistogram(network);
    var degreeArr = Object.values(this.degrees);
    var degreeMinMax = Util.minmax(degreeArr);
    this.degree_min = degreeMinMax.min;
    this.degree_max = degreeMinMax.max;
    this.degree_avg = Util.average(degreeArr);

    // Triangles (3-clique)
    var triangles = Stat.getTriangles(network);
    this.T = triangles.length;
    this.T_max = Stat.getMaximumTriangle(triangles);
    this.T_avg = this.T * 3 / this.E;
  }

  /**
   * Count of Degrees of all nodes in the network
   * @param {Network} network 
   */


  _createClass(Stat, null, [{
    key: 'getDegreeHistogram',
    value: function getDegreeHistogram(network) {
      var histogram = {};
      [].concat(_toConsumableArray(network.nodes)).forEach(function (node) {
        return histogram[node] = 0;
      });
      [].concat(_toConsumableArray(network.links)).forEach(function (link) {
        histogram[link.from] += 1;
        histogram[link.to] += 1;
      });
      return histogram;
    }

    /**
     * Find All Triangles (3-clique) in the Network
     * @param {Network} network 
     */

  }, {
    key: 'getTriangles',
    value: function getTriangles(network) {
      var nodes = [].concat(_toConsumableArray(network.nodes));
      var N = nodes.length;
      var matrix = network.matrix;
      var triangles = [];
      for (var i = 0; i < N - 2; i++) {
        for (var j = i + 1; j < N - 1; j++) {
          for (var k = j + 1; k < N; k++) {
            if (matrix[i][j] == 0) continue;else if (matrix[i][k] == 0) continue;else if (matrix[j][k] || 0) continue;else triangles.push([i, j, k]);
          }
        }
      }
      return triangles;
    }

    /**
     * Find Maximum Triangle formed by a edge.
     * @param {Number[]} triangles elem[0,1,2] represents node column in the matrix notation.
     */

  }, {
    key: 'getMaximumTriangle',
    value: function getMaximumTriangle(triangles) {
      var cnt = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = triangles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var t = _step.value;

          cnt[t[0]] = t[0] in cnt ? cnt[t[0]] + 1 : 1;
          cnt[t[1]] = t[1] in cnt ? cnt[t[1]] + 1 : 1;
          cnt[t[2]] = t[2] in cnt ? cnt[t[2]] + 1 : 1;
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

      return Math.max.apply(Math, _toConsumableArray(Object.values(cnt)));
    }

    /**
     * TODO: 개발이 필요한 네트워크 통계치 
     * Component count, 
     * Component size, 
     * Duration histogram,
     * Assort coefficient, 
     * Average shortest path length (or characteristic path length)
     * Clustering coefficient (local avg, global),  
     * Triangles (count, max, avg),
     * Lower bound on the size of the maximum clique
     * Histograms of k-clique
     * Histograms of k-cores
     * Maximum k-core number,
     * and so on...
     */

  }]);

  return Stat;
}();

var STAT_DESC = {
  N: {
    name: 'Number of Nodes',
    type: 'Number',
    time: 'O(1)'
  },
  E: {
    name: 'Number of Edges',
    type: 'Number',
    time: 'O(1)'
  },
  D: {
    name: 'Density(Edeg-Node Ratio)',
    type: 'Number',
    time: 'O(1)'
  },
  degrees: {
    name: 'Degree Histogram',
    type: 'Histogram',
    time: 'O(E)'
  },
  degree_min: {
    name: 'Minimum Degree',
    type: 'Number',
    time: 'O(E + N)'
  },
  degree_max: {
    name: 'Maximum Degree',
    type: 'Number',
    time: 'O(E + N)'
  },
  degree_avg: {
    name: 'Average Degree',
    type: 'Number',
    time: 'O(E + N)'
  },
  T: {
    name: 'Number of Triangles',
    type: 'Number',
    time: 'O(N^3)'
  },
  T_max: {
    name: 'Maximum number of triangles formed by a edge',
    type: 'Number',
    time: 'O(N^3)'
  },
  T_avg: {
    name: 'Average triangles formed by a edge',
    type: 'Number',
    time: 'O(N^3)'
  }
};