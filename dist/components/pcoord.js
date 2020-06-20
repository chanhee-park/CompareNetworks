var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PCoord = function (_React$Component) {
  _inherits(PCoord, _React$Component);

  function PCoord(props) {
    _classCallCheck(this, PCoord);

    var _this = _possibleConstructorReturn(this, (PCoord.__proto__ || Object.getPrototypeOf(PCoord)).call(this, props));
    // TODO: 축에 boxplot 추가
    // TODO: 축 위에 히스토그램 추가: 필터링 기능 제공
    // TODO: 유저가 축 선택 (축 별로 히스토그램 보여주기)


    _this.handleMouseOver = function (idx, network, mouseX, mouseY) {
      ScatterPlot.highlightCircle('#network_circle-' + idx);
      PCoord.highlightPath('#network_path-' + idx);
      Tooltip.show(mouseX, mouseY, network);
    };

    _this.handleMouseOut = function (idx) {
      ScatterPlot.dehighlightCircle('#network_circle-' + idx);
      PCoord.dehighlightPath('#network_path-' + idx);
      Tooltip.hidden();
    };

    _this.handleMouseClick = function (idx) {
      SelectionPopup.show(_this.props.networks[idx]);
      _this.props.clickedChanger(idx);
    };

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
      this.draw(this.props.networks, this.state.seletedStats, this.props.selected, this.state.svg);
    }

    // Parallel Coordinate를 그린다.

  }, {
    key: 'draw',
    value: function draw(networks, statNames, selected, svg) {
      var _this2 = this;

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

        var color = CONSTANTS.COLOR_INSTANCE;
        if (i == selected[0]) {
          color = CONSTANTS.COLOR_SELECTED[0];
        } else if (i == selected[1]) {
          color = CONSTANTS.COLOR_SELECTED[1];
        }

        // Draw Line
        svg.append("path").attrs({
          d: lineFunction(lineData),
          fill: "none",
          stroke: color,
          "stroke-width": CONSTANTS.STROKE_WIDTH_PCOORD,
          opacity: CONSTANTS.OPACITY_INSTANCE_PCOORD,
          id: 'network_path-' + i
        }).on("mouseover", function () {
          return _this2.handleMouseOver(i, n, d3.event.pageX, d3.event.pageY);
        }).on("mouseout", function () {
          return _this2.handleMouseOut(i);
        }).on("click", function () {
          return _this2.handleMouseClick(i);
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('svg', { id: this.state.svgId });
    }
  }], [{
    key: 'highlightPath',
    value: function highlightPath(selector) {
      d3.select(selector).attrs({
        "stroke-width": CONSTANTS.STROKE_WIDTH_PCOORD * 5,
        opacity: CONSTANTS.OPACITY_SELECTED
      });
    }
  }, {
    key: 'dehighlightPath',
    value: function dehighlightPath(selector) {
      d3.select(selector).attrs({
        "stroke-width": CONSTANTS.STROKE_WIDTH_PCOORD,
        opacity: CONSTANTS.OPACITY_INSTANCE_PCOORD
      });
    }
  }, {
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
  }]);

  return PCoord;
}(React.Component);