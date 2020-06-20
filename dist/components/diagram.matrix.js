var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MatrixDiagram = function (_React$Component) {
  _inherits(MatrixDiagram, _React$Component);

  function MatrixDiagram(props) {
    _classCallCheck(this, MatrixDiagram);

    var _this = _possibleConstructorReturn(this, (MatrixDiagram.__proto__ || Object.getPrototypeOf(MatrixDiagram)).call(this, props));

    _this.state = {
      padding: 5
    };
    return _this;
  }

  _createClass(MatrixDiagram, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // set SVG size
      var svg = d3.select("#" + this.props.svgId);
      var svgWidth = svg.style("width").replace("px", "");
      var svgHeight = svg.style("height").replace("px", "");
      var maxWH = Math.min(svgWidth, svgHeight);
      var graphSize = maxWH - this.state.padding * 2;
      this.setState({ svg: svg, graphSize: graphSize });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.draw();
    }
  }, {
    key: "draw",
    value: function draw() {
      this.state.svg.selectAll("*").remove();

      var matrix = this.props.network.matrix;
      var N = matrix.length;
      var cellSize = this.state.graphSize / N;

      for (var i = 0; i < N - 1; i++) {
        for (var j = i; j < N; j++) {
          if (i == j || matrix[i][j] > 0) {
            this.state.svg.append('rect').attrs({
              x: i * cellSize + this.state.padding,
              y: j * cellSize + this.state.padding,
              width: cellSize,
              height: cellSize,
              fill: this.props.color,
              opacity: 0.5
            });
            this.state.svg.append('rect').attrs({
              x: j * cellSize + this.state.padding,
              y: i * cellSize + this.state.padding,
              width: cellSize,
              height: cellSize,
              fill: this.props.color,
              opacity: 0.5
            });
          }
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("svg", { id: this.props.svgId });
    }
  }]);

  return MatrixDiagram;
}(React.Component);