var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NodeLinkDiagram = function (_React$Component) {
  _inherits(NodeLinkDiagram, _React$Component);

  function NodeLinkDiagram(props) {
    _classCallCheck(this, NodeLinkDiagram);

    var _this = _possibleConstructorReturn(this, (NodeLinkDiagram.__proto__ || Object.getPrototypeOf(NodeLinkDiagram)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(NodeLinkDiagram, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var containerId = Util.getParentIdOfReactComp(this);
      var container = document.getElementById(containerId);

      var data = {
        nodes: this.generateVisNodes(),
        edges: this.generateVisEdges()
      };

      // option: https://visjs.github.io/vis-network/docs/network/#options
      var options = {
        autoResize: false,
        height: '95%',
        width: '100%',
        // https://visjs.github.io/vis-network/docs/network/edges.html
        edges: {
          color: {
            color: Util.lightenColor(this.props.color),
            opacity: 0.25
          },
          width: 0.1
        },
        // https://visjs.github.io/vis-network/docs/network/nodes.html
        nodes: {
          color: this.props.color
        },
        // https://visjs.github.io/vis-network/docs/network/physics.html
        physics: {
          forceAtlas2Based: {
            gravitationalConstant: -26,
            centralGravity: 0.005,
            springLength: 230,
            springConstant: 0.18,
            avoidOverlap: 1.5
          },
          maxVelocity: 146,
          solver: 'forceAtlas2Based',
          timestep: 0.35,
          stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 25
          }
        }
      };

      this.setState({ container: container, data: data, options: options });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.draw();
    }
  }, {
    key: 'draw',
    value: function draw() {
      // TODO: 노드 위치 받아서/계산해서 SVG에 직접 그리기
      var visNetwork = this.generateVisNetwork();
      visNetwork.on("stabilizationIterationsDone", function () {
        visNetwork.setOptions({ physics: false });
      });
      console.log(visNetwork);
    }
  }, {
    key: 'generateVisNetwork',
    value: function generateVisNetwork() {
      return new vis.Network(this.state.container, this.state.data, this.state.options);
    }
  }, {
    key: 'generateVisNodes',
    value: function generateVisNodes() {
      return new vis.DataSet([].concat(_toConsumableArray(this.props.network.nodes)).map(function (node) {
        return { id: node, label: node };
      }));
    }
  }, {
    key: 'generateVisEdges',
    value: function generateVisEdges() {
      var edgeMap = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.props.network.links[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var link = _step.value;

          var from = Math.min(link.from, link.to);
          var to = Math.max(link.from, link.to);
          var key = from + '-' + to;
          if (key in edgeMap) {
            edgeMap[key].value += 1;
          } else {
            edgeMap[key] = { from: from, to: to, value: 1 };
          }
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

      return new vis.DataSet(Object.values(edgeMap));
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('svg', { id: this.props.svgId });
    }
  }]);

  return NodeLinkDiagram;
}(React.Component);