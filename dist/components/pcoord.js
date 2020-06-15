var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PCoord = function (_React$Component) {
  _inherits(PCoord, _React$Component);

  function PCoord(props) {
    _classCallCheck(this, PCoord);

    var _this = _possibleConstructorReturn(this, (PCoord.__proto__ || Object.getPrototypeOf(PCoord)).call(this, props));

    _this.state = {
      svgId: 'svg__pcoord',
      totalStats: ['N', 'E', 'D', 'degree_min', 'degree_max', 'degree_avg', 'T', 'T_max', 'T_avg', 'dist_max', 'dist_avg'],
      seletedStats: ['N', 'E', 'D', 'degree_min', 'degree_max', 'degree_avg', 'T', 'T_max', 'T_avg', 'dist_max', 'dist_avg']
    };
    return _this;
  }

  _createClass(PCoord, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // set SVG size
      var parentId = Util.getParentIdOfReactComp(this);
      var size = Util.getSizeOfDOM(parentId);
      var grahpW = size.width;
      var grahpH = size.height;
      var svg = d3.select('#' + this.state.svgId).style("width", grahpW + 'px').style("height", grahpH + 'px');

      // set these on state
      this.setState({ svg: svg, grahpW: grahpW, grahpH: grahpH });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      PCoord.draw(this.props.networks, this.state.seletedStats, this.state.svg);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('svg', { id: this.state.svgId });
    }
  }], [{
    key: 'getMinMaxOfStats',
    value: function getMinMaxOfStats(networks, statNames) {
      var statistics = networks.map(function (n) {
        return n.stat;
      });
      var statsByKey = Util.getArraiesByKey(statistics, statNames);
      var ret = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = statNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var statName = _step.value;

          var minmaxValue = Util.minmax(statsByKey[statName]);
          ret[statName] = {
            min: minmaxValue.min,
            max: minmaxValue.max
          };
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

      return ret;
    }

    // Parallel Coordinate를 그린다.

  }, {
    key: 'draw',
    value: function draw(networks, statNames, svg) {
      svg.selectAll("*").remove();
      var statsMinMax = PCoord.getMinMaxOfStats(networks, statNames);

      // get svg box and graph size
      var svgBBox = svg.node().getBoundingClientRect(),
          svgW = svgBBox.width,
          svgH = svgBBox.height,
          paddingW = 50,
          paddingH = 30,
          drawBoxW = svgW - paddingW * 2,
          drawBoxH = svgH - paddingH * 2;

      // Draw Axis and Legend
      var xInterval = drawBoxW / (statNames.length - 1);
      statNames.forEach(function (key, i) {
        var x = i * xInterval + paddingW;

        // 세로 선
        svg.append('line').attrs({
          x1: x,
          x2: x,
          y1: paddingH,
          y2: paddingH + drawBoxH,
          stroke: CONSTANTS.COLOR_AXIS,
          'stroke-width': 2
        });

        // 통계치 이름
        svg.append('text').text(key).attrs({
          x: x,
          y: paddingH + drawBoxH + 10,
          'text-anchor': 'middle',
          'alignment-baseline': 'hanging',
          'font-size': 14
        });

        // 가로선과 통계 수치
        var numOfHorLine = 4;
        var yInterval = drawBoxH / (numOfHorLine - 1);
        var statMin = statsMinMax[key].min;
        var statMax = statsMinMax[key].max;
        var valInterval = (statMax - statMin) / (numOfHorLine - 1);
        for (var j = 0; j < numOfHorLine; j++) {
          var y = j * yInterval + paddingH;
          var val = (numOfHorLine - j - 1) * valInterval + statMin;
          val = val < 1 ? Number(val.toFixed(3)) : parseInt(val);

          // 가로선
          svg.append('line').attrs({
            x1: x - 10,
            x2: x + 10,
            y1: y,
            y2: y,
            stroke: CONSTANTS.COLOR_AXIS
          });

          // 통계 수치
          svg.append('text').text(val).attrs({
            x: x + 15,
            y: y,
            'text-anchor': 'start',
            'alignment-baseline': 'centeral',
            'font-size': 9
          });
        }
      });

      // Draw Paths for each Network 
      var lineFunction = d3.line().x(function (d) {
        return d.x;
      }).y(function (d) {
        return d.y;
      }).curve(d3.curveMonotoneX);
      // curveLinear, curveBasis, curveMonotoneX, curveCatmullRom.alpha(1)

      networks.forEach(function (n, i) {
        // Set Line Data
        var lineData = [];
        statNames.forEach(function (k, j) {
          var smin = statsMinMax[k].min;
          var smax = statsMinMax[k].max;
          var valRel = 1 - (n.stat[k] - smin) / (smax - smin + Number.MIN_VALUE);
          lineData.push({
            x: j * xInterval + paddingW,
            y: valRel * drawBoxH + paddingH
          });
        });

        // Draw Line
        svg.append("path").attrs({
          d: lineFunction(lineData),
          fill: "none",
          stroke: CONSTANTS.COLOR_INSTANCE,
          "stroke-width": CONSTANTS.STROKE_WIDTH_PCOORD,
          opacity: CONSTANTS.OPACITY_INSTANCE_PCOORD,
          id: 'network_path-' + i
        }).on("mouseover", function () {
          PCoord.handleMouseOver(n, i);
        }).on("mouseout", function () {
          PCoord.handleMouseOut(n, i);
        });
      });

      return;
    }
  }, {
    key: 'handleMouseOver',
    value: function handleMouseOver(network, idx) {
      d3.select('#network_path-' + idx).attrs({
        stroke: CONSTANTS.COLOR_HOVERED,
        "stroke-width": CONSTANTS.STROKE_WIDTH_PCOORD * 3,
        opacity: CONSTANTS.OPACITY_SELECTED
      });

      return;
      // Specify where to put label of text
      svg.append("text").attr({
        id: "t" + d.x + "-" + d.y + "-" + i, // Create an id for text so we can select it later for removing on mouseout
        x: function x() {
          return xScale(d.x) - 30;
        },
        y: function y() {
          return yScale(d.y) - 15;
        }
      }).text(function () {
        return [d.x, d.y]; // Value of the text
      });
    }
  }, {
    key: 'handleMouseOut',
    value: function handleMouseOut(point, idx) {
      d3.select('#network_path-' + idx).attrs({
        stroke: CONSTANTS.COLOR_INSTANCE,
        "stroke-width": CONSTANTS.STROKE_WIDTH_PCOORD,
        opacity: CONSTANTS.OPACITY_INSTANCE_PCOORD
      });

      return;
      // Select text by id and then remove
      d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();
    }
  }]);

  return PCoord;
}(React.Component);