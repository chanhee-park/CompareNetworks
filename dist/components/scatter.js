var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScatterPlot = function (_React$Component) {
  _inherits(ScatterPlot, _React$Component);

  function ScatterPlot(props) {
    _classCallCheck(this, ScatterPlot);

    var _this = _possibleConstructorReturn(this, (ScatterPlot.__proto__ || Object.getPrototypeOf(ScatterPlot)).call(this, props));

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
      svgId: 'svg__scatter',
      padding: 20,
      totalStats: ['D', 'degree_min', 'degree_max', 'degree_avg', 'T', 'T_max', 'T_avg', 'dist_max', 'dist_avg'],
      seletedStats: ['D', 'degree_min', 'degree_max', 'degree_avg', 'T', 'T_max', 'T_avg', 'dist_max', 'dist_avg']
    };
    return _this;
  }

  _createClass(ScatterPlot, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // set SVG size
      var parentId = Util.getParentIdOfReactComp(this);
      var size = Util.getSizeOfDOM(parentId);
      var maxWH = Math.max(size.width, size.height);
      var grahpSize = maxWH - this.state.padding * 2;
      var svg = d3.select('#' + this.state.svgId).style("width", size.width + 'px').style("height", size.height + 'px');

      // get difference between networks and points of each network
      var diff = NetComparator.getDiffByStats(this.props.networks, this.state.seletedStats);
      var points = this.getPoints(diff, grahpSize, this.props.selected);

      // set these on state
      this.setState({ svg: svg, grahpSize: grahpSize, diff: diff, points: points });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      // TODO: 네트워크 사이의 거리를 정하는 방법을 유저가 직접 지정할 수 있어야한다.
      this.draw(this.state.points, this.state.svg, this.state.padding);
    }

    // 네트워크간 차이(dist matrix)를 입력받아 각 네트워크 포인트의 포지션을 담는 배열을 반환한다. 

  }, {
    key: 'getPoints',
    value: function getPoints(diff, grahpSize, selected) {
      // pca 차원 축소를 통해 포인트 위치 지정
      var points = Util.pca(diff);

      // 그래프 사이즈에 맞춰서 포지션 조정
      var normPoints = ScatterPlot.getNormalizedPoints(points, grahpSize);

      // 포인트 색상 지정
      for (var i = 0; i < normPoints.length; i++) {
        var color = CONSTANTS.COLOR_INSTANCE;
        if (i == selected[0]) {
          color = CONSTANTS.COLOR_SELECTED[0];
        } else if (i == selected[1]) {
          color = CONSTANTS.COLOR_SELECTED[1];
        }
        normPoints[i].color = color;
      }

      return normPoints;
    }

    // 스캐터플롯을 그린다.

  }, {
    key: 'draw',
    value: function draw(points, svg, padding) {
      svg.selectAll("*").remove();
      this.drawAxisLines(svg, 5);
      this.drawPoints(points, svg, padding);
      // TODO: 확대 축소 인터랙션
      return;
    }
  }, {
    key: 'drawPoints',
    value: function drawPoints(points, svg, padding) {
      var _this2 = this;

      points.forEach(function (p, i) {
        svg.append('circle').attrs({
          cx: p.x + padding,
          cy: p.y + padding,
          r: CONSTANTS.RADIUS_SCATTER,
          fill: p.color,
          stroke: '#777',
          'stroke-width': '0px',
          opacity: CONSTANTS.OPACITY_INSTANCE_SCATTER,
          id: 'network_circle-' + i
        }).on("mouseover", function () {
          return _this2.handleMouseOver(i, networks[i], d3.event.pageX, d3.event.pageY);
        }).on("mouseout", function () {
          return _this2.handleMouseOut(i);
        }).on("click", function () {
          return _this2.handleMouseClick(i);
        });
      });
    }
  }, {
    key: 'drawAxisLines',
    value: function drawAxisLines(svg, numberOfAxis) {
      // get svg box 
      var svgBBox = svg.node().getBoundingClientRect();
      var svgW = svgBBox.width;
      var svgH = svgBBox.height;

      // Draw Axis and Legend
      var axisW = svgW / (numberOfAxis + 1);
      var axisH = svgH / (numberOfAxis + 1);
      for (var i = 1; i <= numberOfAxis; i++) {
        // 가로 선
        svg.append('line').attrs({
          x1: 0,
          x2: svgW,
          y1: i * axisH,
          y2: i * axisH,
          stroke: CONSTANTS.COLOR_AXIS
        });
        // 세로 선 
        svg.append('line').attrs({
          x1: i * axisW,
          x2: i * axisW,
          y1: 0,
          y2: svgH,
          stroke: CONSTANTS.COLOR_AXIS
        });
      }
    }

    // normalize position of points (x축과 y축 개별적으로 정규화)

  }, {
    key: 'render',
    value: function render() {
      return React.createElement('svg', { id: this.state.svgId });
    }
  }], [{
    key: 'getNormalizedPoints',
    value: function getNormalizedPoints(points, grahpSize) {
      var min = [+Infinity, +Infinity];
      var max = [-Infinity, -Infinity];
      points.forEach(function (p) {
        min[0] = Math.min(min[0], p[0]);
        max[0] = Math.max(max[0], p[0]);
        min[1] = Math.min(min[1], p[1]);
        max[1] = Math.max(max[1], p[1]);
      });
      var sub = [max[0] - min[0], max[1] - min[1]];
      return points.map(function (p) {
        var x = (p[0] - min[0]) / sub[0] * grahpSize;
        var y = (p[1] - min[1]) / sub[1] * grahpSize;
        return { x: x, y: y };
      });
    }
  }, {
    key: 'highlightCircle',
    value: function highlightCircle(selector) {
      d3.select(selector).attrs({
        r: CONSTANTS.RADIUS_SCATTER * 3,
        opacity: CONSTANTS.OPACITY_SELECTED,
        'stroke-width': '2px'
      });
    }
  }, {
    key: 'dehighlightCircle',
    value: function dehighlightCircle(selector) {
      d3.select(selector).attrs({
        r: CONSTANTS.RADIUS_SCATTER,
        opacity: CONSTANTS.OPACITY_INSTANCE_SCATTER,
        'stroke-width': '0px'
      });
    }
  }]);

  return ScatterPlot;
}(React.Component);