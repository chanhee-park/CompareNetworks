var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 잡다한 계산과 처리를 담당한다. (Static Class)
 */
var Util = function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: "loadFile",

    /**
     * 파일을 불러온다.
     * @method loadFile
     * @param {string} filePath 불러올 파일의 파일명을 포함한 경로     * @returns {string} 불러온 파일의 responseText
     */
    value: function loadFile(filePath) {
      var result = null;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", filePath, false);
      xmlhttp.send();
      if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
      }
      return result;
    }

    // -------- 객체 처리 --------
    // clone value of obj(include array) not reference

  }, {
    key: "getArraiesByKey",


    // Get arraies by each key
    value: function getArraiesByKey(collection, keys) {
      var ret = {};
      keys.forEach(function (key) {
        return ret[key] = [];
      });
      collection.forEach(function (obj) {
        return keys.forEach(function (key) {
          return ret[key].push(obj[key]);
        });
      });
      return ret;
    }

    // -------- DOM 관리 --------
    // get width and height of the dom element by element ID

  }, {
    key: "getSizeOfDOM",
    value: function getSizeOfDOM(id) {
      var elem = document.getElementById(id);
      var bBox = elem.getBoundingClientRect();
      return {
        width: bBox.width,
        height: bBox.height
      };
    }

    /**
     * svg를 생성하고 리턴한다. 
     * @param {string} id id 스트링 (eg. 'my_container')
     */

  }, {
    key: "generateSVG",
    value: function generateSVG(id) {
      var container = d3.select("#" + id);
      var bBox = container.node().getBoundingClientRect();
      var svgW = bBox.width - 2 * PADDING_FOR_SECTION;
      var svgH = bBox.height - 2 * PADDING_FOR_SECTION;

      return container.append("svg").attr("width", svgW).attr("height", svgH);
    }

    // 리액트 컴포넌트를 입력받아 부모 DOM 오브젝트의 ID를 리턴한다.

  }, {
    key: "getParentIdOfReactComp",
    value: function getParentIdOfReactComp(ReactComp) {
      return ReactDOM.findDOMNode(ReactComp).parentNode.getAttribute('id');
    }

    // -------- 통계 연산 --------
    /**
     * 최대 값과 최소 값을 찾는다.
     * @param {Iterable<number>} arrayLike 순회할 Iterable 객체 (eg. Array, Set, ..)
     */

  }, {
    key: "minmax",
    value: function minmax(arrayLike) {
      var min = +Infinity;
      var max = -Infinity;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = arrayLike[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          if (isNaN(item)) continue;
          min = Math.min(min, item);
          max = Math.max(max, item);
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

      return {
        min: isFinite(min) ? min : -1,
        max: isFinite(max) ? max : -1
      };
    }

    // 합계 


    // 평균

  }, {
    key: "standardDeviation",


    // 표준편차
    value: function standardDeviation(arr1d) {
      var avg = Util.average(arr1d);
      var squareDiffs = arr1d.map(function (e) {
        return Math.pow(e - avg, 2);
      });
      var avgSquareDiff = Util.average(squareDiffs);
      return Math.sqrt(avgSquareDiff);
    }

    /**
     * Normalize 2D Array. 2차원 배열을 정규화한다.
     * nmin = 0 이고 nmax = 100 일 때, 배열의 값이 0 ~ 100 사이로 변환된다.
     * arr2d: (min, max) => ret: (nmin, nmax)
     * @param {Array.<Array.<number>>} arr2d 정규화할 2차원 배열
     * @param {number} nmin 정규화될 범위 최소값
     * @param {number} nmax 정규화될 범위 최대값
     * @returns {number[]} (nmin, nmax)로 정규화된 2차원 배열
     */

  }, {
    key: "normalize2d",
    value: function normalize2d(arr2d) {
      var nmin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var nmax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

      var arr1d = arr2d.flat();
      var min = Math.min.apply(Math, _toConsumableArray(arr1d));
      var max = Math.max.apply(Math, _toConsumableArray(arr1d));
      var sub = max - min;
      var rat = nmax - nmin;
      return arr2d.map(function (r) {
        return r.map(function (v) {
          return (v - min) / sub * rat + nmin;
        });
      });
    }

    /**
     *  Standardize2d 2D Array. 2차원 배열을 표준화한다.
     * @param {Array.<Array.<number>>} arr2d 정규화할 2차원 배열
     * @return {number[]} 표준화된 2차원 배열
     */

  }, {
    key: "standardize2d",
    value: function standardize2d(arr2d) {
      var arr1d = arr2d.flat();
      var avg = Util.average(arr1d);
      var std = Util.standardDeviation(arr1d);
      return arr2d.map(function (row) {
        return row.map(function (val) {
          return (val - avg) / std;
        });
      });
    }

    /**
     * PCA 차원축소
     * @param {Array.<Array.<number>>} arr2d row에 instances, colunm에 attributes 값을 담는 2차원 배열
     * @param {number} dimensions 기본 값이 2로 설정된 축소하여 반환할 차원의 수
     */

  }, {
    key: "pca",
    value: function pca(arr2d) {
      var dimensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

      // package: https://cdn.jsdelivr.net/npm/pca-js@1.0.0/pca.min.js
      var pcaRes = PCA.getEigenVectors(arr2d);
      return pcaRes.map(function (e) {
        return e.vector.slice(0, dimensions);
      });
    }

    /**
     * MDS 차원축소
     * @param {Array.<Array.<number>>} distances 2차원 인접행렬
     * @param {number} dimensions 기본 값이 2로 설정된 축소하여 반환할 차원의 수
     */

  }, {
    key: "mds",
    value: function mds(distances) {
      var dimensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

      // square distances
      var M = numeric.mul(-.5, numeric.pow(distances, 2));

      // double centre the rows/columns
      function mean(A) {
        return numeric.div(numeric.add.apply(null, A), A.length);
      }
      var rowMeans = mean(M),
          colMeans = mean(numeric.transpose(M)),
          totalMean = mean(rowMeans);

      for (var i = 0; i < M.length; ++i) {
        for (var j = 0; j < M[0].length; ++j) {
          M[i][j] += totalMean - rowMeans[i] - colMeans[j];
        }
      }

      // take the SVD of the double centred matrix, and return the points from it
      var ret = numeric.svd(M),
          eigenValues = numeric.sqrt(ret.S);

      return ret.U.map(function (row) {
        return numeric.mul(row, eigenValues).splice(0, dimensions);
      });
    }

    // -------- 행렬 연산 --------
    // 2차원 배열 두개를 더한다.

  }, {
    key: "sumMatrices",
    value: function sumMatrices(a, b) {
      var rows = a.length;
      var cols = a[0].length;
      summ = [].concat(_toConsumableArray(Array(rows))).map(function (e) {
        return Array(cols).fill(0);
      });

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          summ[r][c] = a[r][c] + b[r][c];
        }
      }
      return summ;
    }

    // 2차원 배열 여러개를 더한다.

  }, {
    key: "sumMultipleMatrices",
    value: function sumMultipleMatrices(matrices) {
      var rows = matrices[0].length;
      var cols = matrices[0][0].length;
      summ = [].concat(_toConsumableArray(Array(rows))).map(function (e) {
        return Array(cols).fill(0);
      });
      matrices.forEach(function (matrix) {
        return summ = Util.sumMatrices(summ, matrix);
      });
      return summ;
    }
  }]);

  return Util;
}();

Util.copy = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

Util.sum = function (v) {
  return v.reduce(function (s, e) {
    return s + e;
  }, 0);
};

Util.average = function (v) {
  return Util.sum(v) / v.length;
};