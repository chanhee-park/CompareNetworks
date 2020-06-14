var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScatterPlot = function (_React$Component) {
  _inherits(ScatterPlot, _React$Component);

  function ScatterPlot(props) {
    _classCallCheck(this, ScatterPlot);

    var _this = _possibleConstructorReturn(this, (ScatterPlot.__proto__ || Object.getPrototypeOf(ScatterPlot)).call(this, props));

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
      var points = ScatterPlot.getPoints(diff, grahpSize);

      // set these on state
      this.setState({ svg: svg, grahpSize: grahpSize, diff: diff, points: points });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      // TODO: 네트워크 사이의 거리를 정하는 방법을 유저가 직접 지정할 수 있어야한다.
      ScatterPlot.draw(this.state.points, this.state.svg, this.state.padding);
    }

    // 네트워크간 차이(dist matrix)를 입력받아 각 네트워크  포인트의 포지션을 담는 배열을 반환한다. 

  }, {
    key: 'render',
    value: function render() {
      return React.createElement('svg', { id: this.state.svgId });
    }
  }], [{
    key: 'getPoints',
    value: function getPoints(diff, grahpSize) {
      var points = Util.pca(diff);
      var normPoints = ScatterPlot.getNormalizedPoints(points, grahpSize);
      return normPoints;
    }

    // normalize position of points (x축과 y축 개별적으로 정규화)

  }, {
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
        return [x, y];
      });
    }

    // 스캐터플롯을 그린다.

  }, {
    key: 'draw',
    value: function draw(points, svg, padding) {
      svg.selectAll("*").remove();
      ScatterPlot.drawAxisLines(svg);
      ScatterPlot.drawPoints(points, svg, padding);
      // TODO: 안내선
      // TODO: 확대 축소 클릭 호버 인터랙션
      return;
    }
  }, {
    key: 'drawPoints',
    value: function drawPoints(points, svg, padding) {
      points.forEach(function (p) {
        svg.append('circle').attrs({
          cx: p[0] + padding,
          cy: p[1] + padding,
          r: 6,
          fill: '#369',
          opacity: 0.5
        });
      });
    }
  }, {
    key: 'drawAxisLines',
    value: function drawAxisLines(svg) {
      // get svg box 
      var svgBBox = svg.node().getBoundingClientRect();
      var svgW = svgBBox.width;
      var svgH = svgBBox.height;

      // Draw Axis and Legend
      var numberOfAxis = 5;
      var axisW = svgW / (numberOfAxis + 1);
      var axisH = svgH / (numberOfAxis + 1);
      for (var i = 1; i <= numberOfAxis; i++) {
        // 가로 선
        svg.append('line').attrs({
          x1: 0,
          x2: svgW,
          y1: i * axisH,
          y2: i * axisH,
          stroke: '#ddd'
        });
        // 세로 선 
        svg.append('line').attrs({
          x1: i * axisW,
          x2: i * axisW,
          y1: 0,
          y2: svgH,
          stroke: '#ddd'
        });
      }
    }
  }]);

  return ScatterPlot;
}(React.Component);