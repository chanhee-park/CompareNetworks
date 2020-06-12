var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 네트워크 통계치를 계산하고 저장한다. (Static Class)
 * 통계치 목록 참고
 * (wiki) https://en.wikipedia.org/wiki/Network_science
 * (web) http://networkrepository.com/
 * (paper) ManyNets (2010 CHI - Visualization)
 */
var StatProcessor = function () {
  function StatProcessor() {
    _classCallCheck(this, StatProcessor);
  }

  _createClass(StatProcessor, null, [{
    key: 'getStat',
    value: function getStat(network) {
      stat = {};
      stat.N = network.nodes.size;
      stat.E = network.links.size;
      stat.D = stat.E / (stat.N * (stat.N - 1) / 2);

      // Degree - Histogram, min, max, avg
      stat.degrees = StatProcessor.getDegreeHistogram(network);
      var degreeArr = Object.values(stat.degrees);
      var degreeMinMax = Util.minmax(degreeArr);
      stat.degree_min = degreeMinMax.min;
      stat.degree_max = degreeMinMax.max;
      stat.degree_avg = Util.average(degreeArr);

      // Triangles (3-clique)
      var triangles = StatProcessor.getTriangles(network);
      stat.T = triangles.length;
      stat.T_max = StatProcessor.getMaximumTriangle(triangles);
      stat.T_avg = stat.T * 3 / stat.E;

      // Distances
      var distAvgMax = StatProcessor.getAvgMaxDistance(network.distMatrix);
      stat.dist_max = distAvgMax.max;
      stat.dist_avg = distAvgMax.avg;

      return stat;
      /**
        * TODO: 개발이 필요한 네트워크 통계치
        * Clustering coefficient (local avg, global),
        * Assort coefficient,
        * Component count,
        * Component size,
        * Duration histogram,
        * Histograms of k-clique
        * Lower bound on the size of the maximum clique
        * Histograms of k-cores
        * Maximum k-core number,
        * and so on...
        */
    }

    /**
     * Count of Degrees of all nodes in the network
     * @param {Network} network 
     */

  }, {
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
     * get average and maximum distance of all connected node pairs
     * @param {number[][]} dist distance matrix (2d array)
     */

  }, {
    key: 'getAvgMaxDistance',
    value: function getAvgMaxDistance(dist) {
      var N = dist.length;
      var max_dist = 0,
          total_dist = 0,
          total_pair = 0;
      for (var i = 0; i < N - 1; i++) {
        for (var j = i + 1; j < N; j++) {
          if (isFinite(dist[i][j])) {
            max_dist = Math.max(max_dist, dist[i][j]);
            total_dist += dist[i][j];
            total_pair += 1;
          }
        }
      }
      return { max: max_dist, avg: total_dist / total_pair };
    }
  }]);

  return StatProcessor;
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
  },
  dist_max: {
    name: 'Maximum distance of all connected node pairs',
    type: 'Number',
    time: 'O(N^2)'
  },
  dist_avg: {
    name: 'Maximum distance of all connected node pairs',
    type: 'Number',
    time: 'O(N^2)'
  }
};