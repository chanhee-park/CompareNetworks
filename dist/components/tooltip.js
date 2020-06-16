var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tooltip = function (_React$Component) {
  _inherits(Tooltip, _React$Component);

  function Tooltip(props) {
    _classCallCheck(this, Tooltip);

    return _possibleConstructorReturn(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).call(this, props));
  }

  // TODO: 툴팁 우측에 네트워크 다이어그램 추가.

  _createClass(Tooltip, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { id: "tooltip", "class": "hidden" },
        React.createElement(
          "div",
          { className: "title" },
          "Hovered Network"
        ),
        React.createElement("div", { className: "description", id: "description" })
      );
    }
  }], [{
    key: "show",
    value: function show(x, y, network) {
      console.log();
      d3.select("#tooltip").style("left", x + "px").style("top", y + "px").classed("hidden", false).select("#description").html(Tooltip.getTooltipTxt(network));
      Tooltip.drawDegreeHistogram(network.stat.degrees);
    }
  }, {
    key: "hidden",
    value: function hidden() {
      d3.select("#tooltip").classed("hidden", true);
    }
  }, {
    key: "getTooltipTxt",
    value: function getTooltipTxt(network) {
      return "\n    <div class=\"key-val-set\">\n      <div class=\"key\">Number of Nodes:</div>\n      <div class=\"val\">" + network.stat.N + "</div>\n    </div>\n    <div class=\"key-val-set\">\n      <div class=\"key\">Number of Edges:</div>\n      <div class=\"val\">" + network.stat.E + "</div>\n    </div>\n    <div class=\"key-val-set\">\n      <div class=\"key\">Density(Edeg-Node Ratio):</div>\n      <div class=\"val\">" + Number(network.stat.D.toFixed(4)) + "</div>\n    </div>\n    <div class=\"key-val-set\">\n      <div class=\"key\">Degree Histogram</div>\n      <div class=\"val\"><svg id=\"degreesHistogram\"></svg></div>\n    </div>\n    ";
    }
  }, {
    key: "drawDegreeHistogram",
    value: function drawDegreeHistogram(degrees) {
      // svg size
      var SVG_W = 450,
          SVG_H = 200;
      // padding size
      var PADDING_L = 20,
          PADDING_R = 10,
          PADDING_B = 30,
          PADDING_T = 30;
      // render zone size
      var RENDER_W = SVG_W - PADDING_L - PADDING_R,
          RENDER_H = SVG_H - PADDING_B - PADDING_T;

      var svg = d3.select("#degreesHistogram").style("width", SVG_W).style("height", SVG_H);

      // 축 그리기
      svg.append('line').attrs({
        // 세로 축
        x1: PADDING_L,
        x2: PADDING_L,
        y1: 0,
        y2: RENDER_H + PADDING_T,
        stroke: CONSTANTS.COLOR_AXIS
      });

      svg.append('line').attrs({
        // 가로 축
        x1: SVG_W,
        x2: PADDING_L,
        y1: RENDER_H + PADDING_T,
        y2: RENDER_H + PADDING_T,
        stroke: CONSTANTS.COLOR_AXIS
      });

      // 그래프 그리기
      var maxDegree = Math.max.apply(Math, _toConsumableArray(Object.keys(degrees)));
      var maxSize = Math.max.apply(Math, _toConsumableArray(Object.values(degrees)));
      var interval = RENDER_W / maxDegree;

      // 보조 텍스트
      var numOfText = 2;
      for (var i = 0; i <= numOfText; i++) {
        var degreeVal = parseInt(maxDegree * i / numOfText);
        var sizeVal = parseInt(maxSize * i / numOfText);
        svg.append('text').text(degreeVal).attrs({
          // 가로 축 텍스트 (degree)
          x: interval * degreeVal + PADDING_L,
          y: RENDER_H + PADDING_T + 10,
          'text-anchor': 'end',
          'alignment-baseline': 'hanging'
        });
        if (i == 0) continue; // 0은 가로 축 세로축 겹치니깐 한번만 그린다.
        svg.append('text').text(sizeVal).attrs({
          // 세로 축 텍스트 (size = number of nodes)
          x: PADDING_L - 10,
          y: RENDER_H - (sizeVal / maxSize * RENDER_H - PADDING_T),
          'text-anchor': 'middle',
          'alignment-baseline': 'central'
        });
      }

      // 바 차트
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.entries(degrees)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref = _step.value;

          var _ref2 = _slicedToArray(_ref, 2);

          var degree = _ref2[0];
          var size = _ref2[1];

          var rectH = size / maxSize * RENDER_H;
          svg.append('rect').attrs({
            x: interval * degree + PADDING_L,
            y: RENDER_H - rectH + PADDING_T,
            width: interval,
            height: rectH,
            fill: CONSTANTS.COLOR_INSTANCE,
            opacity: '0.75'
          });
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
    }
  }]);

  return Tooltip;
}(React.Component);