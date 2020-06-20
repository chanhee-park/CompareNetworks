var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      selected: [0, 1]
    };
    return _this;
  }

  _createClass(App, [{
    key: "changeSelectedNetwork",
    value: function changeSelectedNetwork(network, i) {
      var newSelected = this.state.selected;
      newSelected[i] = network;
      this.setState({ selected: newSelected });
    }

    // TODO: Scatter, Parallel, Tooltip의 함수들 Non-Static 하게 변경

  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "app" },
        React.createElement(
          "div",
          { className: "row row--first" },
          React.createElement(
            "div",
            { className: "section section__scatter", id: "svg_parent__scatter" },
            React.createElement(ScatterPlot, { networks: this.props.networks, selected: this.state.selected })
          ),
          React.createElement(
            "div",
            { className: "section section__pcoord", id: "svg_parent__pcoord" },
            React.createElement(PCoord, { networks: this.props.networks, selected: this.state.selected })
          ),
          React.createElement(Tooltip, null)
        ),
        React.createElement(
          "div",
          { className: "row row--second" },
          React.createElement(
            "div",
            { className: "container container__diagram container__diagram--small" },
            React.createElement(
              "div",
              { className: "section section__diagram section__diagram--small" },
              React.createElement(Diagram, { network: this.props.networks[this.state.selected[0]], idx: "1", type: "matrix" })
            ),
            React.createElement("div", { className: "section section__diagram section__diagram--small" })
          ),
          React.createElement(
            "div",
            { className: "container container__diagram container__diagram--large" },
            React.createElement("div", { className: "section section__diagram section__diagram--large" })
          ),
          React.createElement(
            "div",
            { className: "container container__diagram container__diagram--large" },
            React.createElement("div", { className: "section section__diagram section__diagram--large" })
          ),
          React.createElement(
            "div",
            { className: "container container__diagram container__diagram--small" },
            React.createElement(
              "div",
              { className: "section section__diagram section__diagram--small" },
              React.createElement(Diagram, { network: this.props.networks[this.state.selected[1]], idx: "4", type: "matrix" })
            ),
            React.createElement("div", { className: "section section__diagram section__diagram--small" })
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);