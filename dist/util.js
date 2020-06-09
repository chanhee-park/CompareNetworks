var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 잡다한 계산과 처리를 담당한다.
 * Static Class (-> non constructor)
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
       * @param {string} filePath 불러올 파일의 파일명을 포함한 경로
       * @returns {string} 불러온 파일의 responseText
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

  }]);

  return Util;
}();

Util.sum = function (v) {
  return v.reduce(function (s, e) {
    return s + e;
  }, 0);
};

Util.average = function (v) {
  return Util.sum(v) / v.length;
};