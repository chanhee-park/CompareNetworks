var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 네트워크간 비교를 수행한다. (Static Class)
 * 참고: comparing methods for comparing networks
 * https://www.nature.com/articles/s41598-019-53708-y
 */
var NetComparator = function () {
  function NetComparator() {
    _classCallCheck(this, NetComparator);
  }

  _createClass(NetComparator, null, [{
    key: "getDiffOfStat",

    /**
     * The (absolute) difference of statistics such as 
     * the clustering coefficient and diameter.
     * @param {*} networks 
     * @param {*} statKey 
     */
    value: function getDiffOfStat(networks, statKey) {
      var N = networks.length;
      var diff = [].concat(_toConsumableArray(Array(N))).map(function (e) {
        return Array(N).fill(0);
      });
      for (var i = 0; i < N - 1; i++) {
        for (var j = i + 1; j < N; j++) {
          var n1val = networks[i].stat[statKey];
          var n2val = networks[j].stat[statKey];
          var d = Math.abs(n1val - n2val);
          diff[i][j] = d;
          diff[j][i] = d;
        }
      }
      var diffStd = Util.standardize2d(diff);
      return Util.normalize2d(diffStd, 0, 1);
    }

    /**
    * The (absolute) difference of several statistics such as 
    * the clustering coefficient and diameter.
    * @param {*} networks 
    * @param {*} statKeys
    */

  }, {
    key: "getDiffOfStats",
    value: function getDiffOfStats(networks, statKeys) {
      var diffs = statKeys.map(function (s) {
        return NetComparator.getDiffOfStat(networks, s);
      });
      var diffSum = Util.sumMultipleMatrices(diffs);
      return Util.normalize2d(diffSum, 0, 1);
    }
  }]);

  return NetComparator;
}();

/**
 * TODO: 다양한 비교 알고리즘 구현하기
 *
 * 1. 수치로 된 여러 통계치를 통해 차원축소하기
 *
 * 2. For alignment-based methods, MI-GRAAL,
 * which allows to extract additional information from the node mapping;
 *
 * 3. For graphlet-based methods, GCD-11 and DCGD-129.
 * The first one is for undirected networks and
 * it was proved to be very effective in discriminating
 * synthetic networks of different topologies19.
 * The second one is the directed version of GCD-11,
 * except that, differently from GCD-11, DGCD-129 does not exclude redundant orbits;
 *
 * 4. For spectral methods, the Wilson and Zhu37 approach:
 * we define three distances by computing the Euclidean distance between
 * the spectra of the adjacency matrices, Laplacians,
 * and Symmetric Normalized Laplacians52 (SNLs).
 *
 * 5. NetLSD, based on the solution of a dynamical (“heat”) equation;
 *
 * 6. Portrait Divergence, which is naturally able to
 * deal with undirected and directed networks.
 *
 * 7. Graph kernels
 */