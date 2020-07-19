var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RadialDiagram = function (_React$Component) {
  _inherits(RadialDiagram, _React$Component);

  function RadialDiagram(props) {
    _classCallCheck(this, RadialDiagram);

    var _this = _possibleConstructorReturn(this, (RadialDiagram.__proto__ || Object.getPrototypeOf(RadialDiagram)).call(this, props));

    _this.state = {
      padding: 10
    };
    return _this;
  }

  _createClass(RadialDiagram, [{
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

      var nodes = this.props.network.nodes;
      var links = this.props.network.links;

      var radianInterval = 2 * Math.PI / nodes.size;
      var graphRadius = this.state.graphSize / 2;
      var centralPoint = {
        x: this.state.graphSize / 2 + this.state.padding,
        y: this.state.graphSize / 2 + this.state.padding
      };

      var getNodePosition = function getNodePosition(idx) {
        var radian = radianInterval * idx;
        var x = Math.sin(radian) * graphRadius + centralPoint.x;
        var y = Math.cos(radian) * graphRadius + centralPoint.y;
        return { x: x, y: y };
      };

      // draw edges 
      var lineFunction = d3.line().x(function (d) {
        return d.x;
      }).y(function (d) {
        return d.y;
      }).curve(d3.curveBundle.beta(0.2));
      // d3.curveBundle.beta(0.25), curveBasis, curveMonotoneX, curveCatmullRom.alpha(1)

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = links[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var link = _step.value;

          var fromPosition = getNodePosition(link.from);
          var toPosition = getNodePosition(link.to);
          var lineData = Math.abs(link.from - link.to) <= 1 ? [fromPosition, toPosition] : [fromPosition, centralPoint, toPosition];

          this.state.svg.append("path").attrs({
            d: lineFunction(lineData),
            fill: "none",
            stroke: Util.lightenColor(this.props.color),
            "stroke-width": 2,
            opacity: 0.5,
            id: "network_path-" + i
          });
        }

        // draw nodes 
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

      for (var idx = 0; idx < nodes.size; idx++) {
        var nodePosition = getNodePosition(idx);
        this.state.svg.append('circle').attrs({
          cx: nodePosition.x,
          cy: nodePosition.y,
          r: CONSTANTS.RADIUS_RADIAL,
          fill: this.props.color
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("svg", { id: this.props.svgId });
    }
  }]);

  return RadialDiagram;
}(React.Component);